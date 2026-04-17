import { z } from 'zod'

export const feedbackFormSchema = z.object({
    title: z.string().min(5, { message: 'Minimum 5 znaków' }),
    description: z.string().min(10, { message: 'Minimum 10 znaków' })
})

export type FeedbackFormValues = z.infer<typeof feedbackFormSchema>
