'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTimer } from '../hooks/useTimer'
import { formatTime } from '../utils/formatTime'
import ReflectionForm from '../components/ReflectionForm'
import SessionLogList from '../components/SessionLogList'

type SessionLog = {
  duration: number
  focusRating: number
  notes: string
  startTime: Date
  endTime: Date
}

export default function PomodoroTimer() {
  const {
    time,
    timerState,
    isLongBreak,
    sessionCount,
    setSessionCount,
    start,
    pause,
    resume,
    reset,
    // startBreak,
    endSession,
    showReflection,
    setShowReflection,
  } = useTimer({
    focusDuration: 0.3 * 60,
    shortBreakDuration: 0.1 * 60,
    longBreakDuration: 0.2 * 60,
    sessionsBeforeLongBreak: 4
  })

  const [sessionLogs, setSessionLogs] = useState<SessionLog[]>([])
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null)

  const handleStartSession = () => {
    setSessionStartTime(new Date())
    start()
  }

  const handleEndSession = () => {
    endSession()
    setShowReflection(true)
  }

  const handlePause = () => {
    pause()
  }

  // const handleStartBreak = () => {
  //   startBreak()
  // }

  const handleReflectionComplete = (focusRating: number, notes: string) => {
    if (sessionStartTime) {
      const newLog: SessionLog = {
        duration: 0.3 * 60, // This should be the actual duration
        focusRating,
        notes,
        startTime: sessionStartTime,
        endTime: new Date()
      }
      setSessionLogs([...sessionLogs, newLog])
    }
    setShowReflection(false)
    setSessionCount(sessionCount + 1)
    reset()
    setSessionStartTime(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-md mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-white">
            Pomotodo
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-6">
          {!showReflection ? (
            <>
              <div className="text-6xl font-bold text-white">
                {formatTime(time)}
              </div>
              <div className="text-xl font-semibold text-white">
                {timerState === 'BREAK' ? (isLongBreak ? 'Long Break' : 'Short Break') : 
                 timerState === 'RUNNING' ? 'Focus Time' : 
                 timerState === 'PAUSED' ? 'Paused' : 
                 timerState === 'COMPLETE' ? 'Session Complete' : 'Ready'}
              </div>
              <div className="text-md text-white">
                Session: {sessionCount}
              </div>
              <div className="flex space-x-4">
                {timerState === 'IDLE' && (
                  <Button onClick={handleStartSession}>Start</Button>
                )}
                {timerState === 'RUNNING' && (
                  <>
                    <Button onClick={handlePause}>Pause</Button>
                    <Button onClick={handleEndSession}>End Session</Button>
                  </>
                )}
                {timerState === 'PAUSED' && (
                  <Button onClick={resume}>Resume</Button>
                )}
                {timerState === 'BREAK' && (
                  <>
                    {/* <Button onClick={handleStartBreak}>Start Break</Button> */}
                    <Button onClick={handleEndSession}>End Break</Button>
                  </>
                )}
                {(timerState === 'BREAK' || timerState === 'COMPLETE') && (
                  <Button onClick={handleEndSession}>End Session</Button>
                )}
                <Button onClick={reset}>Reset</Button>
              </div>
            </>
          ) : (
            <ReflectionForm onComplete={handleReflectionComplete} />
          )}
        </CardContent>
      </Card>
      {sessionLogs.length > 0 && (<SessionLogList logs={sessionLogs} />)}
    </div>
  )
}

