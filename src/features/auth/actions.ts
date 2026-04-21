'use server'

import { registerSchema } from '@/app/register/schema'
import { createClient } from '@/core/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
    const supabase = await createClient()
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return redirect('/login?message=invalid_credentials')
    }
    revalidatePath('/', 'layout')
    redirect('/')
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const full_name = formData.get('full_name') as string

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name,
                avatar_url: generateRandomAvatarWithInitials()
            }
        }
    })

    const validatedFields = registerSchema.safeParse(Object.fromEntries(formData))
    if (!validatedFields.success) {
        return redirect('/register?message=' + encodeURIComponent(validatedFields.error.issues[0].message))
    }
    function generateRandomAvatarWithInitials() {
        const initials = full_name
            .split(' ')
            .map((name) => name[0])
            .join('')
            .toUpperCase();
        const randomColor = Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
        return `https://api.dicebear.com/7.x/avataaars/svg?seed=${initials}&backgroundColor=${randomColor}`;
    }

    if (error) {
        return redirect('/register?message=signup_error')
    }
    if (data.session) {
        revalidatePath('/', 'layout')
        return redirect('/')
    }
    redirect('/login?message=check_email')
}

export async function signOut() {
    const supabase = await createClient()
    await supabase.auth.signOut()

    revalidatePath('/', 'layout')
    redirect('/login')
}
