// "use client";

// import { useToast } from "@/components/ui/use-toast"
// import { CldUploadWidget, CldVideoPlayer } from "next-cloudinary"
// import Image from "next/image";
// import 'next-cloudinary/dist/cld-video-player.css';

// type LessonUploaderProps = {
//     onValueChange: (value: string) => void;
//     setFile: React.Dispatch<any>;
//     publicId: string;
//     file: any;
// }

// const LessonUploader = ({
//     onValueChange,
//     setFile,
//     file,
//     publicId,
// }: LessonUploaderProps) => {
//     const { toast } = useToast()

//     const onUploadSuccessHandler = (result: any) => {
//         setFile((prevState: any) => ({
//             ...prevState,
//             publicId: result?.info?.public_id,
//             secureURL: result?.info?.secure_url
//         }))

//         onValueChange(result?.info?.public_id)

//         toast({
//             title: 'Lesson uploaded successfully',
//             description: '1 credit was deducted from your account',
//             duration: 5000,
//             className: 'success-toast'
//         })
//     }

//     const onUploadErrorHandler = () => {
//         toast({
//             title: 'Something went wrong while uploading',
//             description: 'Please try again',
//             duration: 5000,
//             className: 'error-toast'
//         })
//     }

//     return (
//         <CldUploadWidget
//             uploadPreset="skribbly"
//             options={{
//                 multiple: false,
//                 resourceType: "video",
//             }}
//             onSuccess={onUploadSuccessHandler}
//             onError={onUploadErrorHandler}
//         >
//             {({ open }) => (
//                 <div className="flex flex-col gap-4">
//                     {publicId ? (
//                         <>
//                             <div className="cursor-pointer overflow-hidden rounded-[10px]">
//                                 <CldVideoPlayer
//                                     width="1920"
//                                     height="1080"
//                                     src={publicId}
//                                 />
//                             </div>
//                         </>
//                     ) : (
//                         <div className="media-uploader_cta" onClick={() => open()}>
//                             <div className="media-uploader_cta-image">
//                                 <Image
//                                     src="/assets/icons/add.svg"
//                                     alt="Add Lesson"
//                                     width={24}
//                                     height={24}
//                                 />
//                             </div>
//                             <p className="p-14-medium">Click here to upload your lesson</p>
//                         </div>
//                     )}
//                 </div>
//             )}
//         </CldUploadWidget>
//     )
// }

// export default LessonUploader


"use client";

import { useToast } from "@/components/ui/use-toast"
import { dataUrl, getImageSize } from "@/lib/utils";
import { CldImage, CldUploadWidget, CldVideoPlayer } from "next-cloudinary"
import { PlaceholderValue } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import 'next-cloudinary/dist/cld-video-player.css';
import Link from "next/link";

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

        onValueChange(result?.info?.public_id)

        toast({
            title: 'Lesson uploaded successfully',
            description: '1 credit was deducted from your account',
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
                <div className="flex flex-col gap-4">

                    {publicId ? (
                        <>
                            <div className="cursor-pointer overflow-hidden rounded-[10px]">
                                {/* <CldVideoPlayer
                                    width="1920"
                                    height="1080"
                                    src={lesson.secureURL}
                                /> */}
                                {/* <Link href={lesson.secureURL}>LessonLINK</Link> */}
                            </div>
                        </>
                    ) : (
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
                    )}
                </div>
            )}
        </CldUploadWidget>
    )
}

export default LessonUploader