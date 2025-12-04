import React, { useMemo, useState } from 'react'
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

  const grouped = useMemo(() => {
    const out: Record<number, typeof tasksData> = {1: [],2:[],3:[],4:[]}
    tasksData.forEach(t => {
      const m = Math.max(1, Math.min(4, t.month))
      out[m].push(t)
    })
    return out
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Roadmap MVP — 4 месяца</h1>
      <p className="text-sm text-muted-foreground mb-6">Интерактивная панель задач. Каждая колонка — месяц, карточки — задачи со статусом и критериями приёмки.</p>

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
                            <button className="text-xs px-2 py-1 rounded bg-cyberdark-700 hover:bg-cyberdark-600">Open</button>
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
    </div>
  )
}
