import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FeedbackForm } from '../components/feedback-form'

describe('FeedbackForm UI', () => {
    it('renders the form with submit button', () => {
        render(<FeedbackForm />)
        expect(screen.getByRole('button', { name: /Wyślij zgłoszenie/i })).toBeDefined()
    })
})