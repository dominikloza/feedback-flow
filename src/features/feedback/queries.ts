import { createClient } from '@/core/supabase/server'
import { Database } from '@/core/types/supabase'

export type FeedbackWithProfile = Database['public']['Tables']['feedback']['Row'] & {
    profiles: { full_name: string | null; avatar_url: string | null } | null
    upvotesCount: number
    userHasVoted: boolean
}

export async function getFeedbackList() {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()
    const userId = session?.user?.id

    const { data, error } = await supabase
        .from('feedback')
        .select(`
            *,
            profiles (full_name, avatar_url),
            votes ( user_id )
        `)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Database query error:', error)
        return []
    }

    const formattedData: FeedbackWithProfile[] = data.map((item) => ({
        ...item,
        profiles: Array.isArray(item.profiles) ? item.profiles[0] : item.profiles,
        upvotesCount: item.votes?.length || 0,
        userHasVoted: userId ? item.votes?.some((vote: any) => vote.user_id === userId) : false,
    }))

    return formattedData
}
