import { login, signup } from '@/features/auth/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default async function RegisterPage({
    searchParams
}: {
    searchParams: Promise<{ message?: string }>
}) {
    const resolvedParams = await searchParams

    // Słownik tłumaczeń
    const messages: Record<string, string> = {
        full_name_required: "Imię i nazwisko jest wymagane",
        email_required: "E-mail jest wymagany",
        password_required: "Hasło jest wymagane",
        confirm_password_required: "Potwierdzenie hasła jest wymagane",
        email_invalid: "Nieprawidłowy format e-mail",
        password_too_short: "Hasło musi mieć co najmniej 6 znaków",
        confirm_password_too_short: "Hasło musi mieć co najmniej 6 znaków",
        passwords_do_not_match: "Hasła nie są zgodne",
    }
    const displayMessage = resolvedParams?.message ? (messages[resolvedParams.message] || resolvedParams.message) : null

    return (
        <div className="flex flex-col min-h-screen items-center justify-center bg-zinc-50 p-4">
            <Card className="w-full max-w-sm shadow-sm ring-1 ring-zinc-200">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold tracking-tight">Rejestracja</CardTitle>
                    <CardDescription>
                        Użyj formularza, aby zarejestrować się do platformy FeedbackFlow.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="flex flex-col gap-5">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="full_name" className="text-sm font-medium leading-none">Imię i Nazwisko</label>
                            <Input id="full_name" name="full_name" type="text" placeholder="Jan Kowalski" required autoComplete="full_name" aria-label="Imię i Nazwisko" />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="email" className="text-sm font-medium leading-none">Adres E-mail</label>
                            <Input id="email" name="email" type="email" placeholder="mid.developer@gmail.com" required autoComplete="email" aria-label="Adres E-mail" />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="password" className="text-sm font-medium leading-none">Hasło</label>
                            <Input id="password" name="password" type="password" required autoComplete="password" aria-label="Hasło" />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="confirm_password" className="text-sm font-medium leading-none">Powtórz hasło</label>
                            <Input id="confirm_password" name="confirm_password" type="password" required autoComplete="confirm_password" aria-label="Powtórz hasło" />
                        </div>

                        {displayMessage && (
                            <p className="text-sm font-medium text-red-500 text-center animate-in fade-in slide-in-from-top-1">
                                {displayMessage}
                            </p>
                        )}

                        <div className="flex flex-col gap-3 mt-4">
                            <Button type="submit" formAction={signup} variant="default">
                                Zarejestruj się
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
