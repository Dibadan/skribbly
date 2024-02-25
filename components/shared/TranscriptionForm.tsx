"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"


import { Button } from "@/components/ui/button"
import {
    Form,
} from "@/components/ui/form"
import { creditFee } from "@/constants"
import { CustomField } from "./CustomField"
import { useState, useTransition } from "react"
import LessonUploader from "./LessonUploader"
import { updateCredits } from "@/lib/actions/user.actions"
import { addLesson, transcribeLesson } from "@/lib/actions/transcription.action"
import { useRouter } from "next/navigation"
import { TranscriptionFormProps } from "@/types"
import { InsufficientCreditsModal } from "./InsufficientCreditsModal"

export const formSchema = z.object({
    publicId: z.string(),
})

const TranscriptionForm = ({ action, data = null, userId, creditBalance }: TranscriptionFormProps) => {

    const [lesson, setLesson] = useState(data)
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter()



    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema)
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {

        setIsSubmitting(true);

        if (data || lesson) {

            const blob = lesson as any;
            const minutes = Math.round(((blob?.fullData.info.duration)/60));
            const transcript = " ";
            const name = blob?.fullData.info.original_filename;

            const lessonData = {
                publicId: lesson?.publicId,
                secureURL: lesson?.secureURL,
                minutes: minutes,
                transcript:transcript,
                name:name
            }


            if (action === 'Add') {
                try {
                    const newLesson = await addLesson({
                        lesson: lessonData,
                        userId,
                        path: '/'
                    })


                    if (newLesson) {
                        form.reset()
                        setLesson(newLesson)
                        await transcribeLesson(newLesson?._id, userId, newLesson?.secureURL)
                        await updateCredits(userId, -minutes)
                        router.push(`/`)
                    }
                } catch (error) {
                    console.log(error);
                }
            }



            setIsSubmitting(false)
        }
    }

    
        return (
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    {creditBalance < Math.abs(creditFee) && <InsufficientCreditsModal />}

                    <div className="media-uploader-field">
                        <CustomField
                            control={form.control}
                            name="publicId"
                            className="flex size-full flex-col"
                            render={({ field }) => (
                                <LessonUploader
                                    onValueChange={field.onChange}
                                    setLesson={setLesson}
                                    publicId={field.value}
                                    lesson={lesson}
                                />
                            )}
                        />


                    </div>

                    <div className="flex flex-col gap-4">

                        <Button
                            type="submit"
                            className="submit-button capitalize"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Uploading...' : 'Upload Lesson'}
                        </Button>
                    </div>
                </form>
            </Form>
        )
    

}


export default TranscriptionForm