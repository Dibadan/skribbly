// "use client"

// import { zodResolver } from "@hookform/resolvers/zod"
// import { useForm } from "react-hook-form"
// import { z } from "zod"
// import {
//     Form,
// } from "@/components/ui/form"
// import { CustomField } from "./CustomField"
// import { useState, useTransition } from "react"
// import { updateCredits } from "@/lib/actions/user.actions"
// import { useRouter } from "next/navigation"
// import LessonUploader from "./LessonUploader"
// import { TranscriptionFormProps } from "@/types"
// import { addLesson } from "@/lib/actions/transcription.action"
// import { Button } from "../ui/button"

// export const formSchema = z.object({
//     title: z.string(),
//     publicId: z.string(),
// })

// const TranscriptionForm = ({ action, data = null, userId, creditBalance }: TranscriptionFormProps) => {
//     const [lesson, setLesson] = useState(data)
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [isTransforming, setIsTransforming] = useState(false);
//     const [isPending, startTransition] = useTransition()
//     const router = useRouter()



//     // 1. Define your form.
//     const form = useForm<z.infer<typeof formSchema>>({
//         resolver: zodResolver(formSchema),
//     })

//     async function onSubmit(values: z.infer<typeof formSchema>) {
//         setIsSubmitting(true);

//         if (data || lesson) {


//             const lessonData = {
//                 title: values.title,
//                 publicId: lesson?.publicId,
//                 secureURL: lesson?.secureURL
//             }

//             if (action === 'Add') {
//                 try {
//                     const newLesson = await addLesson({
//                         lesson: lessonData,
//                         userId,
//                         path: '/'
//                     })

//                     if (newLesson) {
//                         console.log("NEWLESSON = ", newLesson)
//                         form.reset()
//                         setLesson(data)
//                         router.push(`/transformations/${newLesson._id}`)
//                     }
//                 } catch (error) {
//                     console.log(error);
//                 }
//             }


//         }

//         setIsSubmitting(false)
//     }



//     return (
//         <Form {...form}>
//             <form id="my_form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
//                 {/* {creditBalance < Math.abs(creditFee) && <InsufficientCreditsModal />} */}
//                 <div className="media-uploader-field">
//                     <CustomField
//                         control={form.control}
//                         name="publicId"
//                         className="flex size-full flex-col"
//                         render={({ field }) => (
//                             <LessonUploader
//                                 onValueChange={field.onChange}
//                                 setLesson={setLesson}
//                                 publicId={field.value}
//                                 lesson={lesson}
//                             />
//                         )}
//                     />

//                 </div>

//                 <div className="flex flex-col gap-4">

//                     <Button type="submit"
//                         className="submit-button capitalize"
//                         disabled={isSubmitting}>
//                         {isSubmitting ? 'Submitting...' : 'Save Lesson'}
//                     </Button>


//                 </div>
//             </form>
//         </Form>
//     )
// }

// export default TranscriptionForm


"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"


import { Button } from "@/components/ui/button"
import {
    Form,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { aspectRatioOptions, creditFee, defaultValues, transformationTypes } from "@/constants"
import { CustomField } from "./CustomField"
import { useEffect, useState, useTransition } from "react"
import { AspectRatioKey, debounce, deepMergeObjects } from "@/lib/utils"
import LessonUploader from "./LessonUploader"
import { updateCredits } from "@/lib/actions/user.actions"
import { getCldImageUrl } from "next-cloudinary"
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
    const [isTranscribing, setIsTranscribing] = useState(false);
    const [isPending, startTransition] = useTransition()
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
            const minutes = blob?.fullData.info.duration;
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

                    console.log("NEW LESSON = ", newLesson)

                    if (newLesson) {
                        form.reset()
                        setLesson(newLesson)
                        console.log("NEW LESSON (192)", newLesson)
                        await transcribeLesson(newLesson?._id, userId, newLesson?.secureURL)
                        await updateCredits(userId, minutes)
                        // startTransition(async () => {
                        //     const transcribed = await transcribeLesson(newLesson?._id, userId, newLesson?.secureURL)
                        //     if(transcribed.status === "Completed") {
                        //         await updateCredits(userId, minutes)
                        //     }
                            
                        // })
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