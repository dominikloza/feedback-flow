'use server'

import { createClient } from '@/core/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createFeedback(formData: FormData) {
    const supabase = await createClient()


    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: 'Tylko zalogowani użytkownicy mogą dodawać opinie.' }
    }

    const title = formData.get('title') as string
    const description = formData.get('description') as string

    if (!title || !description) {
        return { error: 'Podaj tytuł i opis.' }
    }

    const { error } = await supabase
        .from('feedback')
        .insert({
            title,
            description,
            user_id: user.id
        })

    if (error) {
        console.error('Insertion failed:', error)
        return { error: 'Wystąpił błąd podczas zapisywania.' }
    }

    revalidatePath('/')

    return { success: true }
}
