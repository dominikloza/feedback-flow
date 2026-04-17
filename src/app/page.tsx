import React from 'react'
import { getFeedbackList } from '@/features/feedback/queries'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { InboxIcon } from 'lucide-react'
import { FeedbackForm } from '@/features/feedback/components/feedback-form'
import { FeedbackCard } from '@/features/feedback/components/feedback-card'

export default async function Home() {
  const feedbackList = await getFeedbackList()

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 w-full grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8">
      <aside className="mb-8">
        <FeedbackForm />
      </aside>
      <div>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Wasze pomysły</h1>
            <p className="text-zinc-500 mt-1">Przeglądaj wszystkie opublikowane zgłoszenia społeczności.</p>
          </div>
        </div>

        {feedbackList.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 p-12 text-center shadow-sm">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-zinc-100">
              <InboxIcon className="h-10 w-10 text-zinc-400" />
            </div>
            <h2 className="mt-6 text-xl font-semibold text-zinc-900">Brak zgłoszeń w systemie</h2>
            <p className="mt-2 text-center text-sm font-normal text-zinc-500 max-w-sm">
              Bądź autorem przełomu! Nasza baza jest obecnie przygotowana. Jutro wdrożymy formularz, z którego jako pierwszy wyślesz zapytanie do serwera.
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {feedbackList.map((feedback) => (
              <FeedbackCard key={feedback.id} feedback={feedback} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
