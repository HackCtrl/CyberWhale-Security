import React, { useEffect, useMemo, useState } from 'react'
import tasksData from '@/data/mvpRoadmap'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

const monthNames = ['Месяц 1', 'Месяц 2', 'Месяц 3', 'Месяц 4']

const statusColor = (status: string) => {
  switch (status) {
    case 'done':
      return 'secondary'
    case 'in-progress':
      return 'default'
    case 'review':
      return 'outline'
    case 'todo':
      return 'secondary'
    default:
      return 'default'
  }
}
const statusLabel = (status: string) => {
  switch (status) {
    case 'backlog':
      return 'Бэклог'
    case 'todo':
      return 'В очереди'
    case 'in-progress':
      return 'В работе'
    case 'review':
      return 'На проверке'
    case 'done':
      return 'Готово'
    default:
      return status
  }
}

export default function TasksBoard() {
  const [expanded, setExpanded] = useState<string | null>(null)
  const [tasks, setTasks] = useState<any[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [reportingTask, setReportingTask] = useState<any | null>(null)
  const [reportSummary, setReportSummary] = useState('')
  const [evidenceLink, setEvidenceLink] = useState('')
  const [reportFiles, setReportFiles] = useState<File[] | null>(null)
  const [filterStatus, setFilterStatus] = useState<string | null>(null)
  const [filterAssignee, setFilterAssignee] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [creating, setCreating] = useState(false)
  const [newTask, setNewTask] = useState<any>({ title: '', description: '', epic: '', priority: 'medium', estimate_days: 1 })

  useEffect(() => {
    // fetch tasks from API, fallback to static data
    let mounted = true
    setLoading(true)
    fetch('/api/tasks')
      .then(r => r.json())
      .then(data => { if (mounted) setTasks(data) })
      .catch(() => { if (mounted) setTasks(tasksData as any) })
      .finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [])

  const grouped = useMemo(() => {
    const out: Record<number, any[]> = {1: [],2:[],3:[],4:[]}
    const source = (tasks || tasksData).filter((t:any)=>{
      if (filterStatus && t.status !== filterStatus) return false
      if (filterAssignee && t.assignee !== filterAssignee) return false
      if (search && !`${t.title} ${t.description || ''}`.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
    source.forEach((t: any) => {
      // try to determine month from tags like 'month:1' or fallback to t.month
      let m = 1
      if (Array.isArray(t.tags)) {
        const mtag = t.tags.find((x: string) => x && x.startsWith && x.startsWith('month:'))
        if (mtag) m = Number(mtag.split(':')[1]) || 1
      }
      if (typeof t.month === 'number') m = Math.max(1, Math.min(4, t.month))
      out[m].push(t)
    })
    return out
  }, [tasks])

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Roadmap MVP — 4 месяца</h1>
      <p className="text-sm text-muted-foreground mb-6">Интерактивная панель задач. Каждая колонка — месяц, карточки — задачи со статусом и критериями приёмки.</p>

      <div className="mb-4 flex gap-2 items-center">
        <input className="border p-2" placeholder="Поиск по заголовку" value={search} onChange={e=>setSearch(e.target.value)} />
        <select className="border p-2" value={filterStatus||''} onChange={e=>setFilterStatus(e.target.value||null)}>
          <option value="">Все статусы</option>
          <option value="backlog">Бэклог</option>
          <option value="todo">В очереди</option>
          <option value="in-progress">В работе</option>
          <option value="review">На проверке</option>
          <option value="done">Готово</option>
        </select>
        <button className="px-3 py-1 bg-cyberdark-700 text-white" onClick={()=>setCreating(true)}>Создать задачу</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {([1,2,3,4] as const).map(month => {
          const monthTasks = grouped[month] || []
          const avg = monthTasks.length ? Math.round(monthTasks.reduce((s,t)=>s+t.percent,0)/monthTasks.length) : 0
          return (
            <div key={month}>
              <Card className="h-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{monthNames[month-1]}</CardTitle>
                      <div className="text-sm text-muted-foreground">Спринты: {((month-1)*2+1)}–{(month*2)}</div>
                    </div>
                    <div className="text-right">
                      <div className="mb-2"><Badge variant="outline">Прогресс {avg}%</Badge></div>
                      <div className="w-36"><Progress value={avg} /></div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {monthTasks.map(task => (
                      <div key={task.id} className={`border rounded-lg p-3 bg-card`}>
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{task.id}. {task.title}</h3>
                              <Badge variant={statusColor(task.status)}>{task.status}</Badge>
                            </div>
                            <div className="text-xs text-muted-foreground">{task.epic} • Sprint {task.sprint} • est. {task.estimate_days}d</div>
                          </div>
                          <div className="w-28">
                            <Progress value={Math.max(0, Math.min(100, task.percent))} />
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-muted-foreground">
                          {task.description?.slice(0, 160)}{task.description && task.description.length>160 ? '…' : ''}
                        </div>
                        <div className="mt-3 flex justify-between items-center">
                          <div className="flex gap-2">
                            <button onClick={() => setReportingTask(task)} className="text-xs px-2 py-1 rounded bg-cyberdark-700 hover:bg-cyberdark-600">Open</button>
                            <button onClick={() => setExpanded(expanded===task.id?null:task.id)} className="text-xs px-2 py-1 rounded bg-cyberdark-700 hover:bg-cyberdark-600">Details</button>
                          </div>
                          <div className="text-xs text-muted-foreground">Assignee: {task.assignee||'—'}</div>
                        </div>

                        {expanded === task.id && (
                          <div className="mt-3 border-t pt-3">
                            <div className="font-medium">Acceptance criteria</div>
                            <ul className="list-disc pl-5 mt-2 text-sm text-muted-foreground">
                              {task.acceptance?.map((a,i)=>(<li key={i}>{a}</li>))}
                            </ul>
                            <div className="mt-3">
                              <div className="text-sm font-medium">Вложения</div>
                              <TaskAttachments taskId={task.id} />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    {monthTasks.length === 0 && (
                      <div className="text-sm text-muted-foreground">Нет задач на этот месяц.</div>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="text-xs text-muted-foreground">Всего задач: {monthTasks.length}</div>
                </CardFooter>
              </Card>
            </div>
          )
        })}
      </div>
      {creating && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded p-6 w-full max-w-2xl">
            <h3 className="text-lg font-bold mb-2">Создать задачу</h3>
            <input className="w-full border p-2 mb-2" placeholder="Заголовок" value={newTask.title} onChange={e=>setNewTask({...newTask, title: e.target.value})} />
            <textarea className="w-full border p-2 mb-2" placeholder="Описание" value={newTask.description} onChange={e=>setNewTask({...newTask, description: e.target.value})} />
            <div className="flex gap-2 justify-end">
              <button className="px-3 py-1 border" onClick={()=>setCreating(false)}>Отмена</button>
              <button className="px-3 py-1 bg-cyberdark-700 text-white" onClick={async ()=>{
                const resp = await fetch('/api/tasks', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newTask) })
                if (resp.ok) {
                  const t = await resp.json()
                  const data = await fetch('/api/tasks').then(r=>r.json())
                  setTasks(data)
                  setCreating(false)
                  setNewTask({ title: '', description: '', epic: '', priority: 'medium', estimate_days: 1 })
                } else {
                  alert('Ошибка создания')
                }
              }}>Создать</button>
            </div>
          </div>
        </div>
      )}

      {reportingTask && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded p-6 w-full max-w-2xl">
            <h3 className="text-lg font-bold mb-2">Отчёт по задаче: {reportingTask.title}</h3>
            <div className="mb-2 text-sm text-muted-foreground">ID: {reportingTask.id}</div>
            <textarea value={reportSummary} onChange={e=>setReportSummary(e.target.value)} className="w-full border p-2 mb-2" placeholder="Краткое описание проделанной работы" />
            <input value={evidenceLink} onChange={e=>setEvidenceLink(e.target.value)} className="w-full border p-2 mb-2" placeholder="Ссылка на CI/PR (необязательно)" />
            <input type="file" multiple onChange={e=>setReportFiles(e.target.files ? Array.from(e.target.files) : null} className="mb-2" />
            <div className="flex gap-2 justify-end">
              <button className="px-3 py-1 border" onClick={()=>{ setReportingTask(null); setReportSummary(''); setReportFile(null); setEvidenceLink(''); }}>Отмена</button>
              <button className="px-3 py-1 bg-cyberdark-700 text-white" onClick={async ()=>{
                // submit report: upload file if present, then post report
                const id = reportingTask.id
                const attachments: any[] = []
                if (reportFiles && reportFiles.length) {
                  for (const f of reportFiles) {
                    const form = new FormData()
                    form.append('file', f)
                    const up = await fetch(`/api/tasks/${id}/attachments`, { method: 'POST', body: form })
                    if (up.ok) {
                      const meta = await up.json()
                      attachments.push(meta.path)
                    }
                  }
                }
                const payload: any = { summary: reportSummary, attachments }
                if (evidenceLink) payload.evidence_links = [evidenceLink]
                const resp = await fetch(`/api/tasks/${id}/report`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
                if (resp.ok) {
                  // refresh tasks
                  const data = await fetch('/api/tasks').then(r=>r.json())
                  setTasks(data)
                  setReportingTask(null)
                  setReportSummary('')
                  setReportFiles(null)
                  setEvidenceLink('')
                } else {
                  const err = await resp.json().catch(()=>({message:'Ошибка'}))
                  alert(err.message || 'Ошибка при отправке отчёта')
                }
              }}>Отправить отчёт</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function TaskAttachments({ taskId }: { taskId: string }) {
  const [atts, setAtts] = useState<any[] | null>(null)
  useEffect(()=>{
    let mounted = true
    fetch(`/api/tasks/${taskId}/attachments`).then(r=>r.json()).then(data=>{ if (mounted) setAtts(data) }).catch(()=>{ if (mounted) setAtts([]) })
    return ()=>{ mounted = false }
  }, [taskId])

  if (!atts) return <div className="text-sm text-muted-foreground">Загрузка...</div>
  if (atts.length === 0) return <div className="text-sm text-muted-foreground">Нет вложений</div>
  return (
    <ul className="list-disc pl-5 text-sm">
      {atts.map(a=> (
        <li key={a.id}><a className="text-cyberdark-700" href={a.path} target="_blank" rel="noreferrer">{a.filename}</a> — {Math.round((a.size||0)/1024)} KB</li>
      ))}
    </ul>
  )
}
