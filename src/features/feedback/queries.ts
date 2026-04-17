import { createClient } from '@/core/supabase/server'
import { Database } from '@/core/types/supabase'

export type FeedbackWithProfile = Database['public']['Tables']['feedback']['Row'] & {
    profiles: { full_name: string | null; avatar_url: string | null } | null
}

export async function getFeedbackList() {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('feedback')
        .select(`
      *,
      profiles (full_name, avatar_url)
    `)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Database query error:', error)
        return []
    }

    return data as FeedbackWithProfile[]
}
