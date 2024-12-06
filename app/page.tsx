import PomodoroTimer from '@/components/pomodoro-timer'
import Head from 'next/head'

export default function Home() {
  return (
    <>
      <Head>
        <title>Pomotodo</title>
        <meta name="description" content="A Pomodoro timer with task tracking" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#be123c" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Pomotodo" />
      </Head>
      <main className="min-h-screen bg-gradient-to-b from-rose-50 to-white p-6">
        <div className="max-w-md mx-auto pt-12">
          <h1 className="text-4xl font-bold text-rose-900 text-center mb-12">Pomotodo</h1>
          <PomodoroTimer />
        </div>
      </main>
    </>
  )
}

