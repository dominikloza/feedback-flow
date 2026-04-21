'use client'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FeedbackWithProfile } from "../queries"
import { useOptimistic, startTransition } from 'react'
import { deleteFeedback, toggleVote } from '../actions'
import { Button } from '@/components/ui/button'
import { Heart, Trash } from 'lucide-react'
import { toast } from 'sonner'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function FeedbackCard({ feedback }: { feedback: FeedbackWithProfile }) {
    const [optimisticVotes, addOptimisticVote] = useOptimistic(
        { count: feedback.upvotesCount, hasVoted: feedback.userHasVoted },
        (state, newVoteValue: boolean) => ({
            count: state.count + (newVoteValue ? 1 : -1),
            hasVoted: newVoteValue
        })
    )

    const handleVote = async () => {
        startTransition(() => {
            addOptimisticVote(!optimisticVotes.hasVoted)
        })
        const response = await toggleVote(feedback.id)
        if (response.error) {
            toast.error(response.error)
        }
    }

    const statusColors: Record<string, string> = {
        'idea': 'bg-blue-100 text-blue-800 border-blue-200',
        'planned': 'bg-purple-100 text-purple-800 border-purple-200',
        'in-progress': 'bg-amber-100 text-amber-800 border-amber-200',
        'completed': 'bg-emerald-100 text-emerald-800 border-emerald-200',
    }

    const currentBadgeStyle = statusColors[feedback.status] || statusColors['idea']

    const handleDelete = async () => {
        const response = await deleteFeedback(feedback.id)
        if (response?.error) {
            toast.error(response.error)
        } else {
            toast.success("Usunięto pomysł")
        }
    }

    return (
        <Card key={feedback.id} className="transition-all hover:shadow-md hover:border-zinc-500 border-zinc-200 ">
            <CardHeader className="pb-3">
                <CardTitle className="text-xl">{feedback.title}</CardTitle>
                <CardDescription className="flex items-center gap-2 mt-1">
                    {feedback.profiles?.avatar_url ? (
                        <img
                            src={feedback.profiles.avatar_url}
                            alt={feedback.profiles.full_name || 'Avatar'}
                            className="w-6 h-6 rounded-full border border-zinc-200"
                        />
                    ) : (
                        <div className="w-6 h-6 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-[10px] font-bold">
                            {feedback.profiles?.full_name?.substring(0, 2).toUpperCase() || 'FF'}
                        </div>
                    )}
                    <span>Wnioskodawca: <span className="font-medium text-zinc-900">{feedback.profiles?.full_name || 'Użytkownik FeedbackFlow'}</span></span>
                </CardDescription>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border whitespace-nowrap uppercase tracking-wider w-fit ${currentBadgeStyle}`}>
                    {feedback.status}
                </span>
            </CardHeader>
            <CardContent>
                <p className="text-zinc-600 leading-relaxed">{feedback.description}</p>
            </CardContent>
            <CardFooter className="flex items-center justify-end gap-2">
                <Button
                    variant={optimisticVotes.hasVoted ? "default" : "outline"}
                    onClick={handleVote}
                    className="flex items-center gap-2 hover:cursor-pointer hover:bg-red-500 hover:text-white"
                >
                    <Heart className="w-4 h-4" />
                    {optimisticVotes.count}
                </Button>

                {feedback.owner && (
                    <AlertDialog>
                        <AlertDialogTrigger
                            render={
                                <Button
                                    variant="outline"
                                    className="flex items-center gap-2 hover:cursor-pointer hover:bg-red-500 hover:text-white"
                                />
                            }
                        >
                            <Trash className="w-4 h-4" />
                            Usuń
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Czy na pewno chcesz usunąć ten pomysł?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Tej operacji nie można cofnąć. Pomysł zostanie trwale usunięty z naszej bazy danych.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Anuluj</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleDelete}
                                    className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                                >
                                    Usuń mimo to
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}
            </CardFooter>
        </Card>
    )
}