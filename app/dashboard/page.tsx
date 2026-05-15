'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Project {
  id: string
  name: string
  description?: string
}

interface Task {
  id: string
  title: string
  status: string
  dueDate?: string
  project: { name: string }
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [tasks, setTasks] = useState<Task[]>([])

  const fetchProjects = async () => {
    const res = await fetch('/api/projects')
    if (res.ok) {
      const data = await res.json()
      setProjects(data)
    }
  }

  const fetchTasks = async () => {
    const res = await fetch('/api/tasks')
    if (res.ok) {
      const data = await res.json()
      setTasks(data)
    }
  }

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/login')
      return
    }
    fetchProjects()
    fetchTasks()
  }, [session, status, router])

  if (status === 'loading') return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  if (!session) return null

  const overdueTasks = tasks.filter(task => task.dueDate && new Date(task.dueDate) < new Date())

  return (
    <main className="min-h-screen px-6 py-8 sm:px-10 sm:py-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-3xl border border-white/10 bg-slate-950/90 p-8 shadow-2xl shadow-slate-950/40 backdrop-blur-xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-sky-400">Dashboard</p>
              <h1 className="mt-3 text-4xl font-semibold text-white">Welcome back, {session.user?.name ?? 'team member'}.</h1>
              <p className="mt-3 max-w-2xl text-slate-400">Fast project visibility, task updates, and overdue tracking in one single workspace.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl bg-slate-900/80 px-5 py-4 border border-slate-800/80">
                <p className="text-sm text-slate-400">Projects</p>
                <p className="mt-3 text-3xl font-semibold text-white">{projects.length}</p>
              </div>
              <div className="rounded-3xl bg-slate-900/80 px-5 py-4 border border-slate-800/80">
                <p className="text-sm text-slate-400">Active tasks</p>
                <p className="mt-3 text-3xl font-semibold text-white">{tasks.length}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-slate-950/90 p-6 shadow-xl shadow-slate-950/30">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Projects</p>
                  <h2 className="mt-3 text-2xl font-semibold text-white">Your active workspace</h2>
                </div>
              </div>
              <div className="mt-6 space-y-4">
                {projects.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-slate-700/80 bg-slate-900/80 px-5 py-6 text-slate-400">
                    No projects available yet. Create a project to start tracking milestones.
                  </div>
                ) : (
                  projects.map(project => (
                    <div key={project.id} className="rounded-3xl border border-slate-800/80 bg-slate-900/80 p-5">
                      <p className="text-lg font-semibold text-white">{project.name}</p>
                      <p className="mt-2 text-slate-400">{project.description ?? 'No description available.'}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-950/90 p-6 shadow-xl shadow-slate-950/30">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Tasks</p>
                  <h2 className="mt-3 text-2xl font-semibold text-white">Today&apos;s priorities</h2>
                </div>
              </div>
              <div className="mt-6 space-y-4">
                {tasks.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-slate-700/80 bg-slate-900/80 px-5 py-6 text-slate-400">
                    No tasks assigned yet. Tasks will show up here once created.
                  </div>
                ) : (
                  tasks.map(task => (
                    <div key={task.id} className="grid gap-2 rounded-3xl border border-slate-800/80 bg-slate-900/80 p-5 sm:grid-cols-[1fr_auto] sm:items-center">
                      <div>
                        <p className="font-semibold text-white">{task.title}</p>
                        <p className="mt-1 text-sm text-slate-400">{task.project.name}</p>
                      </div>
                      <div className="text-right">
                        <span className="rounded-full bg-slate-800 px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-300">{task.status}</span>
                        {task.dueDate && (
                          <p className="mt-2 text-sm text-slate-500">Due {new Date(task.dueDate).toLocaleDateString()}</p>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-slate-950/90 p-6 shadow-xl shadow-slate-950/30">
              <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Action item</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">Overdue tasks</h2>
              <div className="mt-6 space-y-4">
                {overdueTasks.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-slate-700/80 bg-slate-900/80 px-5 py-6 text-slate-400">
                    Great job — no overdue tasks right now.
                  </div>
                ) : (
                  overdueTasks.map(task => (
                    <div key={task.id} className="rounded-3xl border border-rose-500/20 bg-rose-500/10 p-4 text-white">
                      <p className="font-semibold">{task.title}</p>
                      <p className="mt-1 text-sm text-slate-200">Due {new Date(task.dueDate!).toLocaleDateString()}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-950/90 p-6 shadow-xl shadow-slate-950/30">
              <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Role</p>
              <p className="mt-3 text-2xl font-semibold text-white">{session.user?.role ?? 'Member'}</p>
              <p className="mt-4 text-sm leading-6 text-slate-400">Role-based access ensures you see the right projects and task assignments.</p>
            </div>
          </aside>
        </section>
      </div>
    </main>
  )
}