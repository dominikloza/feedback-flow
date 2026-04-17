'use client'

import { Skeleton } from "@/components/ui/skeleton";
import { InboxIcon } from "lucide-react";

export default function Loading() {
    return (
        <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 w-full">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Platforma Pomysłów</h1>
                    <p className="text-zinc-500 mt-1">Przeglądaj wszystkie opublikowane zgłoszenia społeczności.</p>
                </div>
            </div>

            <div className="grid gap-6">
                <Skeleton className="h-32 w-full rounded-xl" />
                <Skeleton className="h-32 w-full rounded-xl" />
                <Skeleton className="h-32 w-full rounded-xl" />
            </div>
        </main>
    )
}   