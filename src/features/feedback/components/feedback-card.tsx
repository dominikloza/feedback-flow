'use client'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FeedbackWithProfile } from "../queries"
import { useOptimistic, startTransition } from 'react'
import { toggleVote } from '../actions'
import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'
import { toast } from 'sonner'


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


    return (
        <Card key={feedback.id} className="transition-all hover:shadow-md hover:border-zinc-500 border-zinc-200 ">
            <CardHeader className="pb-3">
                <CardTitle className="text-xl">{feedback.title}</CardTitle>
                <CardDescription>Wnioskodawca: <span className="font-medium text-zinc-900">{feedback.profiles?.full_name || 'Użytkownik FeedbackFlow'}</span></CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-zinc-600 leading-relaxed">{feedback.description}</p>
            </CardContent>
            <CardFooter className="flex items-center justify-end">
                <Button
                    variant={optimisticVotes.hasVoted ? "default" : "outline"}
                    onClick={handleVote}
                    className="flex items-center gap-2 hover:cursor-pointer hover:bg-red-500 hover:text-white"
                >
                    <Heart className="w-4 h-4" />
                    {optimisticVotes.count}
                </Button>
            </CardFooter>
        </Card>
    )
}