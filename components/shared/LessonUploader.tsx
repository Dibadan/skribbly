"use client";

import { useToast } from "@/components/ui/use-toast"
import { CldUploadWidget } from "next-cloudinary"
import Image from "next/image";


type LessonUploaderProps = {
    onValueChange: (value: string) => void;
    setLesson: React.Dispatch<any>;
    publicId: string;
    lesson: any;
}

const LessonUploader = ({
    onValueChange,
    setLesson,
    lesson,
    publicId,
}: LessonUploaderProps) => {
    const { toast } = useToast()

    const onUploadSuccessHandler = (result: any) => {

        setLesson((prevState: any) => ({
            ...prevState,
            publicId: result?.info?.public_id,
            secureURL: result?.info?.secure_url,
            fullData: result

        }))

    

        const minutes = Math.round(((result.info.duration)/60))

        onValueChange(result?.info?.public_id)

        toast({
            
            title: 'Lesson uploaded successfully',
            description: `${minutes} credits have been deducted from your account`,
            duration: 5000,
            className: 'success-toast'
        })
    }

    const onUploadErrorHandler = () => {
        toast({
            title: 'Something went wrong while uploading',
            description: 'Please try again',
            duration: 5000,
            className: 'error-toast'
        })
    }

    return (
        <CldUploadWidget
            uploadPreset="skribbly"
            options={{
                multiple: false,
                resourceType: "video",
            }}
            onSuccess={onUploadSuccessHandler}
            onError={onUploadErrorHandler}
        >
            {({ open }) => (
                <div className="flex flex-col gap-4 shadow-lg">

                    {!publicId &&  
                      
                        <div className="media-uploader_cta" onClick={() => open()}>
                            <div className="media-uploader_cta-image">
                                <Image
                                    src="/assets/icons/add.svg"
                                    alt="Add Lesson"
                                    width={24}
                                    height={24}
                                />
                            </div>
                            <p className="p-14-medium">Click here to upload your lesson</p>
                        </div>
                    }
                </div>
            )}
        </CldUploadWidget>
    )
}

export default LessonUploader