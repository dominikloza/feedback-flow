import { z } from 'zod'

export const registerSchema = z.object({
    full_name: z.string().min(3, "Imię i nazwisko musi mieć co najmniej 3 znaki"),
    email: z.string().email("Błędny format e-mail"),
    password: z.string().min(6, "Hasło musi mieć co najmniej 6 znaków"),
    confirm_password: z.string().min(6, "Hasło musi mieć co najmniej 6 znaków"),
}).refine((data) => data.password === data.confirm_password, {
    message: "Hasła nie są zgodne",
    path: ["confirm_password"],
})

export type RegisterSchema = z.infer<typeof registerSchema>
