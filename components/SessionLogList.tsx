import { formatDistanceToNow } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

type SessionLog = {
  duration: number
  focusRating: number
  notes: string
  startTime: Date
  endTime: Date
}

interface SessionLogListProps {
  logs: SessionLog[]
}

export default function SessionLogList({ logs }: SessionLogListProps) {
  return (
    <Card className="w-full max-w-md bg-white/10 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-white">Session Log</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] w-full rounded-md border p-4">
          {logs.map((log, index) => (
            <div key={index} className="mb-4 p-4 bg-white/5 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-300">
                  {formatDistanceToNow(log.startTime, { addSuffix: true })}
                </span>
                <span className="text-sm font-semibold text-white">
                  Duration: {Math.floor(log.duration / 60)}:{(log.duration % 60).toString().padStart(2, '0')}
                </span>
              </div>
              <div className="mb-2">
                <span className="text-sm font-medium text-white">Focus Rating: {log.focusRating}/10</span>
              </div>
              {log.notes && (
                <div className="text-sm text-gray-300">
                  <p>{log.notes}</p>
                </div>
              )}
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

