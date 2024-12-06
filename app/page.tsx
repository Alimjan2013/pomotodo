"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTimer } from "../hooks/useTimer";
import { formatTime } from "../utils/formatTime";
import ReflectionForm from "../components/ReflectionForm";
import SessionLogList from "../components/SessionLogList";
import { signout } from "@/app/authentication/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createClient } from '@/lib/supabase/client'



type SessionLog = {
  duration: number;
  focusRating: number;
  notes: string;
  startTime: Date;
  endTime: Date;
};

export default function PomodoroTimer() {
  const router = useRouter();
  const supabase = createClient();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error fetching user:', error);
      } else {
        setUserId(data.user.id);
      }
    };

    fetchUser();
  }, [supabase]);

  async function insertSessionLog(duration: number, focusRating: number, notes: string, startTime: Date, endTime: Date) {
    if (!userId) {
      console.error('User is not authenticated');
      return;
    }

    const { data, error } = await supabase.from("sessionlog").insert([
      {
        user_id: userId,
        duration: duration.toFixed(4),        
        focusrating: focusRating,
        notes,
        starttime:startTime,
        endtime:endTime,
      },
    ]);

    if (error) {
      console.error("Error inserting session log:", error);
    } else {
      console.log("Session log inserted:", data);
    }
  }

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
    sessionsBeforeLongBreak: 4,
  });

  const [sessionLogs, setSessionLogs] = useState<SessionLog[]>([]);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);

  const handleStartSession = () => {
    setSessionStartTime(new Date());
    start();
  };

  const handleEndSession = () => {
    endSession();
    setShowReflection(true);
  };

  const handlePause = () => {
    pause();
  };

  // const handleStartBreak = () => {
  //   startBreak()
  // }

  const handleReflectionComplete = (focusRating: number, notes: string) => {
    if (sessionStartTime) {
      const endTime = new Date();
      const duration = (endTime.getTime() - sessionStartTime.getTime()) / 60000; // Duration in minutes
      const newLog: SessionLog = {
        duration,
        focusRating,
        notes,
        startTime: sessionStartTime,
        endTime,
      };
      setSessionLogs([...sessionLogs, newLog]);
      insertSessionLog(duration, focusRating, notes, sessionStartTime, endTime); // Call the function to insert the session log
    }
    setShowReflection(false);
    setSessionCount(sessionCount + 1);
    reset();
    setSessionStartTime(null);
  };

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
                {timerState === "BREAK"
                  ? isLongBreak
                    ? "Long Break"
                    : "Short Break"
                  : timerState === "RUNNING"
                  ? "Focus Time"
                  : timerState === "PAUSED"
                  ? "Paused"
                  : timerState === "COMPLETE"
                  ? "Session Complete"
                  : "Ready"}
              </div>
              <div className="text-md text-white">Session: {sessionCount}</div>
              <div className="flex space-x-4">
                {timerState === "IDLE" && (
                  <Button onClick={handleStartSession}>Start</Button>
                )}
                {timerState === "RUNNING" && (
                  <>
                    <Button onClick={handlePause}>Pause</Button>
                    <Button onClick={handleEndSession}>End Session</Button>
                  </>
                )}
                {timerState === "PAUSED" && (
                  <Button onClick={resume}>Resume</Button>
                )}
                {timerState === "BREAK" && (
                  <>
                    {/* <Button onClick={handleStartBreak}>Start Break</Button> */}
                    <Button onClick={handleEndSession}>End Break</Button>
                  </>
                )}
                {(timerState === "BREAK" || timerState === "COMPLETE") && (
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
      {sessionLogs.length > 0 && <SessionLogList logs={sessionLogs} />}
      <Button
        className=" border border-customeBorder "
        onClick={() => {
          console.log("logout");
          toast.success("User has successfully logged out.");
          signout();
          router.push("/authentication/login"); // Redirect to home page
        }}
      >
        logout
      </Button>
    </div>
  );
}
