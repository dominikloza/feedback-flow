"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    InputGroupTextarea,
} from "@/components/ui/input-group"
import { feedbackFormSchema } from "../schema"
import { createFeedback } from "../actions"
import { toast } from "sonner"


export function FeedbackForm() {
    const form = useForm<z.infer<typeof feedbackFormSchema>>({
        resolver: zodResolver(feedbackFormSchema),
        defaultValues: {
            title: "",
            description: "",
        },
    })

    async function onSubmit(values: z.infer<typeof feedbackFormSchema>) {
        const formData = new FormData()
        formData.append('title', values.title)
        formData.append('description', values.description)
        const response = await createFeedback(formData)
        if (response.error) {
            toast.error(response.error)
        } else {
            form.reset()
        }
    }

    return (
        <Card className="w-full sm:max-w-md">
            <CardHeader>
                <CardTitle className="text-2xl">Zgłoś swój pomysł</CardTitle>
                <CardDescription className="text-sm">
                    Podziel się swoim pomysłem z innymi użytkownikami.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form id="form-feedback" onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <Controller
                            name="title"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="form-feedback-title" className="text-lg">
                                        Tytuł zgłoszenia
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="form-feedback-title"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Tytuł zgłoszenia"
                                        autoComplete="off"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                        <Controller
                            name="description"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="form-feedback-description" className="text-lg">
                                        Opis zgłoszenia
                                    </FieldLabel>
                                    <InputGroup>
                                        <InputGroupTextarea
                                            {...field}
                                            id="form-feedback-description"
                                            placeholder="Opisz swój pomysł szczegółowo"
                                            rows={6}
                                            className="min-h-24 resize-none"
                                            aria-invalid={fieldState.invalid}
                                        />
                                        <InputGroupAddon align="block-end">
                                            <InputGroupText className="tabular-nums">
                                                {field.value.length}/100 characters
                                            </InputGroupText>
                                        </InputGroupAddon>
                                    </InputGroup>
                                    <FieldDescription>
                                        Opisz swój pomysł szczegółowo, aby inni użytkownicy mogli go zrozumieć.
                                    </FieldDescription>
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                    </FieldGroup>
                </form>
            </CardContent>
            <CardFooter>
                <Field orientation="horizontal">
                    <Button type="submit" form="form-feedback">
                        Wyślij zgłoszenie
                    </Button>
                </Field>
            </CardFooter>
        </Card>
    )
}
