import { useState, useEffect, useCallback } from 'react'

interface TimerConfig {
  focusDuration: number
  shortBreakDuration: number
  longBreakDuration: number
  sessionsBeforeLongBreak: number
}

type TimerState = 'IDLE' | 'RUNNING' | 'PAUSED' | 'BREAK' | 'COMPLETE'

export function useTimer({
  focusDuration,
  shortBreakDuration,
  longBreakDuration,
  sessionsBeforeLongBreak
}: TimerConfig) {
  const [time, setTime] = useState(focusDuration)
  const [timerState, setTimerState] = useState<TimerState>('IDLE')
  const [sessionCount, setSessionCount] = useState(0)
  const [isLongBreak, setIsLongBreak] = useState(false)

  const start = useCallback(() => {
    setTimerState('RUNNING')
  }, [])

  const pause = useCallback(() => {
    setTimerState('PAUSED')
  }, [])

  const resume = useCallback(() => {
    setTimerState('RUNNING')
  }, [])

  const reset = useCallback(() => {
    setTime(focusDuration)
    setTimerState('IDLE')
    setIsLongBreak(false)
  }, [focusDuration])

  const startBreak = useCallback(() => {
    const shouldStartLongBreak = (sessionCount + 1) % sessionsBeforeLongBreak === 0
    setIsLongBreak(shouldStartLongBreak)
    setTime(shouldStartLongBreak ? longBreakDuration : shortBreakDuration)
    setTimerState('BREAK')
  }, [sessionCount, sessionsBeforeLongBreak, longBreakDuration, shortBreakDuration])

  const endSession = useCallback(() => {
    setTimerState('COMPLETE')
    // Reset the time to the focus duration
    setTime(focusDuration)
  }, [focusDuration])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (timerState === 'RUNNING' || timerState === 'BREAK') {
      interval = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 1) {
            if (timerState === 'RUNNING') {
              startBreak()
              return isLongBreak ? longBreakDuration : shortBreakDuration
            } else if (timerState === 'BREAK') {
              endSession()
            }
            return 0
          }
          return prevTime - 1
        })
      }, 1000)
    } else if (interval) {
      clearInterval(interval)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [timerState, startBreak, endSession, longBreakDuration, shortBreakDuration, isLongBreak])

  return {
    time,
    timerState,
    isLongBreak,
    sessionCount,
    setSessionCount,
    start,
    pause,
    resume,
    reset,
    startBreak,
    endSession
  }
}

