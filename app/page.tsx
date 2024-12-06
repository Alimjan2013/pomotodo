import PomodoroTimer from '@/components/pomodoro-timer'

export default function Home() {
  return (
    <>
  
      <main className="min-h-screen bg-gradient-to-b from-rose-50 to-white p-6">
        <div className="max-w-md mx-auto pt-12">
          <h1 className="text-4xl font-bold text-rose-900 text-center mb-12">Pomotodo</h1>
          <PomodoroTimer />
        </div>
      </main>
    </>
  )
}

