'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { ScrollArea } from "@/components/ui/scroll-area"

// Timer states
type TimerState = 'IDLE' | 'FOCUS' | 'BREAK' | 'REFLECTION'

// Session log
type SessionLog = {
  duration: number
  focusRating: number
  notes: string
  startTime: Date
  endTime: Date
}

const FOCUS_DURATION = 25 * 60 // 25 minutes
const BREAK_DURATION = 5 * 60 // 5 minutes

export default function PomodoroTimer() {
  const [timerState, setTimerState] = useState<TimerState>('IDLE')
  const [timeLeft, setTimeLeft] = useState(FOCUS_DURATION)
  const [isActive, setIsActive] = useState(false)
  const [sessionLogs, setSessionLogs] = useState<SessionLog[]>([])
  const [focusRating, setFocusRating] = useState(5)
  const [notes, setNotes] = useState('')
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null)

  const startTimer = useCallback(() => {
    setIsActive(true)
    setTimerState('FOCUS')
    setSessionStartTime(new Date())
    requestNotificationPermission()
  }, [])

  const pauseTimer = useCallback(() => {
    setIsActive(false)
  }, [])

  const resumeTimer = useCallback(() => {
    setIsActive(true)
  }, [])

  const skipBreak = useCallback(() => {
    setTimerState('REFLECTION')
    setTimeLeft(0)
    setIsActive(false)
  }, [])

  const endSession = useCallback(() => {
    if (timerState === 'FOCUS') {
      setTimerState('BREAK')
      setTimeLeft(BREAK_DURATION)
      setIsActive(true)
      showNotification('Focus session completed', 'Time for a break!')
    } else if (timerState === 'BREAK') {
      setTimerState('REFLECTION')
      setTimeLeft(0)
      setIsActive(false)
      showNotification('Break time over', 'Ready to reflect on your session?')
    }
  }, [timerState])

  const logSession = useCallback(() => {
    if (sessionStartTime) {
      setSessionLogs(prev => [
        ...prev,
        {
          duration: FOCUS_DURATION,
          focusRating,
          notes,
          startTime: sessionStartTime,
          endTime: new Date()
        }
      ])
    }
    setTimerState('IDLE')
    setTimeLeft(FOCUS_DURATION)
    setFocusRating(5)
    setNotes('')
    setSessionStartTime(null)
  }, [focusRating, notes, sessionStartTime])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => {
          if (time > 1) return time - 1
          endSession()
          return 0
        })
      }, 1000)
    } else if (timeLeft === 0 && (timerState === 'FOCUS' || timerState === 'BREAK')) {
      endSession()
    }

    // Update the page title with the remaining time
    document.title = isActive ? `(${formatTime(timeLeft)}) Pomotodo` : 'Pomotodo'

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, timeLeft, timerState, endSession])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const requestNotificationPermission = () => {
    if ('Notification' in window) {
      Notification.requestPermission()
    }
  }

  const showNotification = (title: string, body: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body })
    }
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-rose-900">
          {timerState === 'BREAK' ? 'Break Time' : timerState === 'FOCUS' ? 'Focus Time' : 'Pomotodo'}
        </h2>
        <p className="text-rose-600">Sessions completed: {sessionLogs.length}</p>
      </div>

      <div className="relative aspect-square max-w-[320px] mx-auto">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-5xl font-bold text-rose-900">
            {formatTime(timeLeft)}
          </div>
        </div>
        <svg className="w-full h-full -rotate-90 transform">
          <circle
            cx="50%"
            cy="50%"
            r="45%"
            className="stroke-rose-100"
            fill="none"
            strokeWidth="5%"
          />
          <circle
            cx="50%"
            cy="50%"
            r="45%"
            className="stroke-rose-400"
            fill="none"
            strokeWidth="5%"
            strokeDasharray={`${2 * Math.PI * 45}%`}
            strokeDashoffset={`${2 * Math.PI * 45 * (1 - timeLeft / (timerState === 'BREAK' ? BREAK_DURATION : FOCUS_DURATION))}%`}
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="flex justify-center gap-4">
        {timerState === 'IDLE' && (
          <Button onClick={startTimer} className="bg-rose-500 hover:bg-rose-600 rounded-full h-16 w-16 p-0">
            ▶
          </Button>
        )}
        {(timerState === 'FOCUS' || timerState === 'BREAK') && isActive && (
          <Button onClick={pauseTimer} className="bg-rose-500 hover:bg-rose-600 rounded-full h-16 w-16 p-0">
            ❚❚
          </Button>
        )}
        {(timerState === 'FOCUS' || timerState === 'BREAK') && !isActive && (
          <Button onClick={resumeTimer} className="bg-rose-500 hover:bg-rose-600 rounded-full h-16 w-16 p-0">
            ▶
          </Button>
        )}
        {timerState === 'BREAK' && (
          <Button onClick={skipBreak} className="bg-rose-300 hover:bg-rose-400 rounded-full h-16 w-16 p-0">
            ⏭
          </Button>
        )}
      </div>

      {timerState === 'REFLECTION' && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-rose-900">Session Reflection</h3>
          <div>
            <label htmlFor="focus-rating" className="block text-sm font-medium text-rose-700">
              Rate your focus (1-10)
            </label>
            <Slider
              id="focus-rating"
              min={1}
              max={10}
              step={1}
              value={[focusRating]}
              onValueChange={(value) => setFocusRating(value[0])}
              className="mt-2"
            />
          </div>
          <div>
            <label htmlFor="session-notes" className="block text-sm font-medium text-rose-700">
              Session notes
            </label>
            <Input
              id="session-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-1"
              placeholder="What did you accomplish?"
            />
          </div>
          <Button onClick={logSession} className="w-full bg-rose-500 hover:bg-rose-600">
            Log Session and Start New
          </Button>
        </div>
      )}

      {sessionLogs.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-rose-900 mb-4">Completed Sessions</h3>
          <ScrollArea className="h-[200px] w-full rounded-md border border-rose-200 p-4">
            {sessionLogs.map((log, index) => (
              <div key={index} className="mb-4 pb-4 border-b border-rose-100 last:border-b-0">
                <p className="font-medium text-rose-800">Session {index + 1}</p>
                <p className="text-sm text-rose-600">
                  Start: {log.startTime.toLocaleString()}
                </p>
                <p className="text-sm text-rose-600">
                  End: {log.endTime.toLocaleString()}
                </p>
                <p className="text-sm text-rose-700">Focus Rating: {log.focusRating}/10</p>
                <p className="text-sm text-rose-700">Notes: {log.notes}</p>
              </div>
            ))}
          </ScrollArea>
        </div>
      )}
    </div>
  )
}

