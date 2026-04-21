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

export async function toggleVote(feedbackId: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: 'Tylko zalogowani użytkownicy mogą głosować.' }
    }

    const { data, error } = await supabase
        .from('votes')
        .select('*')
        .eq('feedback_id', feedbackId)
        .eq('user_id', user.id)
        .single()

    if (error && error.code !== 'PGRST116') {
        console.error('Error checking vote:', error)
        return { error: 'Wystąpił błąd podczas sprawdzania głosu.' }
    }

    if (data) {
        const { error: deleteError } = await supabase
            .from('votes')
            .delete()
            .eq('id', data.id)

        if (deleteError) {
            console.error('Error deleting vote:', deleteError)
            return { error: 'Wystąpił błąd podczas usuwania głosu.' }
        }
    } else {
        const { error: insertError } = await supabase
            .from('votes')
            .insert({
                feedback_id: feedbackId,
                user_id: user.id
            })

        if (insertError) {
            console.error('Error inserting vote:', insertError)
            return { error: 'Wystąpił błąd podczas dodawania głosu.' }
        }
    }

    revalidatePath('/')
    return { success: true }
}

export async function deleteFeedback(feedbackId: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: 'Tylko zalogowani użytkownicy mogą usuwać opinie.' }
    }
    if (!feedbackId) {
        return { error: 'Podaj id opinii.' }
    }

    const { error } = await supabase
        .from('feedback')
        .delete()
        .eq('id', feedbackId)
        .eq('user_id', user.id)

    if (error) {
        console.error('Error deleting feedback:', error)
        return { error: 'Wystąpił błąd podczas usuwania opinii.' }
    }

    revalidatePath('/')
    return { success: true }
}
