import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { updateFeedbackStatus } from "../actions"
import { FeedbackWithProfile } from "@/features/feedback/queries"

export default function AdminCards({ feedback }: { feedback: FeedbackWithProfile }) {
    const statusColors: Record<string, string> = {
        'idea': 'bg-blue-100 text-blue-800 border-blue-200',
        'planned': 'bg-purple-100 text-purple-800 border-purple-200',
        'in-progress': 'bg-amber-100 text-amber-800 border-amber-200',
        'completed': 'bg-emerald-100 text-emerald-800 border-emerald-200',
    }

    const currentBadgeStyle = statusColors[feedback.status] || statusColors['idea']

    return (
        <Card className="flex flex-col h-full transition-all hover:shadow-lg border-zinc-200 w-full overflow-hidden">
            <CardHeader className="pb-3 flex flex-row items-start justify-between space-y-0 gap-4">
                <div className="space-y-1.5 flex-1">
                    <CardTitle className="text-xl line-clamp-2 leading-tight">{feedback.title}</CardTitle>
                    <CardDescription className="text-zinc-500">
                        Zgłasza: <span className="font-semibold text-zinc-900">{feedback.profiles?.full_name || 'Anonim'}</span>
                    </CardDescription>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border whitespace-nowrap uppercase tracking-wider ${currentBadgeStyle}`}>
                    {feedback.status}
                </span>
            </CardHeader>
            <CardContent className="flex-1">
                <p className="text-zinc-600 leading-relaxed text-sm line-clamp-4">{feedback.description}</p>
            </CardContent>

            <CardFooter className="pt-4 pb-4 border-t border-zinc-100 bg-zinc-50">
                <form className="flex items-center w-full gap-3" action={async (formData) => {
                    'use server'
                    const newStatus = formData.get('status') as 'idea' | 'planned' | 'in-progress' | 'completed'
                    await updateFeedbackStatus(feedback.id, newStatus)
                }}>
                    <select
                        key={feedback.status}
                        name="status"
                        defaultValue={feedback.status}
                        className="flex-1 p-2 border border-zinc-300 rounded-md text-sm font-medium bg-white focus:ring-2 focus:ring-zinc-900 focus:outline-none"
                    >
                        <option value="idea">Oczekujące (Idea)</option>
                        <option value="planned">W Planach</option>
                        <option value="in-progress">W Trakcie Prac</option>
                        <option value="completed">Zakończono Pomyślnie</option>
                    </select>
                    <button type="submit" className="px-4 py-2 bg-zinc-900 text-white rounded-md text-sm font-semibold hover:bg-zinc-800 transition-colors shadow-sm cursor-pointer">
                        Zapisz
                    </button>
                </form>
            </CardFooter>
        </Card>
    )
}