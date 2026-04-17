'use server'

import { createClient } from '@/core/supabase/server'
import { revalidatePath } from 'next/cache'

type FeedbackStatus = 'idea' | 'planned' | 'in-progress' | 'completed'

export async function updateFeedbackStatus(feedbackId: string, newStatus: FeedbackStatus) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Odmowa dostępu: Brak sesji' }

    const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single()
    if (!profile?.is_admin) return { error: 'Potajemny Atak: Brak uprawnień administratora' }

    const { error } = await supabase
        .from('feedback')
        .update({ status: newStatus })
        .eq('id', feedbackId)

    if (error) return { error: `Błąd Bazy Danych: ${error.message}` }

    revalidatePath('/')
    revalidatePath('/admin')
    return { success: true }
}
