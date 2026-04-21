import { it, expect, describe } from 'vitest'
import { feedbackFormSchema } from '../schema'

describe('feedback From Schema Validation', () => {
    it('should pass on correct values', () => {
        const feedback = {
            title: 'Feedback',
            description: 'long description'
        }
        const result = feedbackFormSchema.safeParse(feedback)
        expect(result.success).toBe(true)
    })

    it('should fail when title is too short ', () => {
        const feedback = {
            title: 'abc',
            description: 'long description'
        }
        const result = feedbackFormSchema.safeParse(feedback)
        expect(result.success).toBe(false)
    })

    it('should fail when description is too short ', () => {
        const feedback = {
            title: 'Feedback',
            description: 'short'
        }
        const result = feedbackFormSchema.safeParse(feedback)
        expect(result.success).toBe(false)
    })
})