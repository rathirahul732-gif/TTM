import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const tasks = await prisma.task.findMany({
    where: {
      OR: [
        { project: { ownerId: session.user.id } },
        { project: { members: { some: { id: session.user.id } } } },
        { assignedToId: session.user.id }
      ]
    },
    include: { project: { select: { name: true } } }
  })

  return NextResponse.json(tasks)
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { title, description, projectId, assignedToId, dueDate } = await request.json()

  // check if project accessible
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      OR: [
        { ownerId: session.user.id },
        { members: { some: { id: session.user.id } } }
      ]
    }
  })

  if (!project) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // if assignedToId, check if member
  if (assignedToId) {
    const isMember = await prisma.project.findFirst({
      where: {
        id: projectId,
        OR: [
          { ownerId: assignedToId },
          { members: { some: { id: assignedToId } } }
        ]
      }
    })
    if (!isMember) {
      return NextResponse.json({ error: 'Invalid assignee' }, { status: 400 })
    }
  }

  const task = await prisma.task.create({
    data: {
      title,
      description,
      projectId,
      assignedToId,
      dueDate: dueDate ? new Date(dueDate) : null
    }
  })

  return NextResponse.json(task)
}