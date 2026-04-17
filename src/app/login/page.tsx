import { login, signup } from '@/features/auth/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default async function LoginPage({
    searchParams
}: {
    searchParams: Promise<{ message?: string }>
}) {
    const resolvedParams = await searchParams

    // Słownik tłumaczeń
    const messages: Record<string, string> = {
        invalid_credentials: "Nieprawidłowe dane logowania",
        signup_error: "Błąd przy tworzeniu konta",
        check_email: "Sprawdź skrzynkę e-mail, aby potwierdzić profil"
    }
    const displayMessage = resolvedParams?.message ? (messages[resolvedParams.message] || resolvedParams.message) : null

    return (
        <div className="flex flex-col min-h-screen items-center justify-center bg-zinc-50 p-4">
            <Card className="w-full max-w-sm shadow-sm ring-1 ring-zinc-200">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold tracking-tight">Logowanie</CardTitle>
                    <CardDescription>
                        Użyj formularza, aby zalogować się do platformy FeedbackFlow. Brak konta automatycznie wywoła rejejestrację.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="flex flex-col gap-5">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="email" className="text-sm font-medium leading-none">Adres E-mail</label>
                            <Input id="email" name="email" type="email" placeholder="mid.developer@gmail.com" required />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="password" className="text-sm font-medium leading-none">Hasło</label>
                            <Input id="password" name="password" type="password" required />
                        </div>

                        {displayMessage && (
                            <p className="text-sm font-medium text-red-500 text-center animate-in fade-in slide-in-from-top-1">
                                {displayMessage}
                            </p>
                        )}

                        <div className="flex flex-col gap-3 mt-4">
                            <Button type="submit" formAction={login}>Zaloguj się</Button>
                            <Button type="submit" formAction={signup} variant="outline">
                                Zarejestruj się
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
