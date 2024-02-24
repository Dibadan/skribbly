"use server"

import { connectToDatabase } from "../database/mongoose";
import { handleError } from "../utils";
import User from "../database/models/user.model";
import Transcription from "../database/models/transcription.model";
import { AddLessonParams, UpdateTranscriptionParams } from "@/types";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
const { createClient } = require("@deepgram/sdk");


const populateUser = (query: any) => query.populate({
  path: 'creator',
  model: User,
  select: '_id firstName lastName clerkId'
})

// ADD TRANSCRIPTION
export async function addLesson({ lesson, userId, path }: AddLessonParams) {
  try {
    await connectToDatabase();

    const author = await User.findById(userId);

    console.log("AUTHOR = ", author)

    if (!author) {
      throw new Error("User not found");
    }

    const newLesson = await Transcription.create({
      ...lesson,
      creator: author._id,
    })

    revalidatePath(path);

    return JSON.parse(JSON.stringify(newLesson));
  } catch (error) {
    handleError(error)
  }
}

// UPDATE TRANSCRIPTION
export async function updateTranscription({ transcription, userId }: UpdateTranscriptionParams) {
  try {
    await connectToDatabase();
    console.log("TID = ", transcription._id)
    const transcriptionToUpdate = await Transcription.findById(transcription._id);

    console.log("TTU = ", transcriptionToUpdate)

    const creatorID = transcriptionToUpdate.creator.toString();
    console.log("CREATOR ID = ", creatorID);
    console.log("USERID = ", userId)
    console.log(creatorID!==userId)

    if (!transcriptionToUpdate || creatorID !== userId) {
      throw new Error("Unauthorized or transcription not found");
    }

    const updatedTranscription = await Transcription.findByIdAndUpdate(
      transcriptionToUpdate._id,
      transcription,
      { new: true }
    )

    console.log("UPTRANS (63)", updatedTranscription)

    //revalidatePath(path);

    return JSON.parse(JSON.stringify(updatedTranscription));
  } catch (error) {
    handleError(error)
  }
}





// GET LESSON
export async function getLessonById(lessonId: string) {
  try {
    await connectToDatabase();

    const lesson = await populateUser(Transcription.findById(lessonId));

    if (!lesson) throw new Error("Lesson not found");

    return JSON.parse(JSON.stringify(lesson));
  } catch (error) {
    handleError(error)
  }
}


// GET TRANSCRIPTIONS
export async function getAllTranscriptions() {
  try {

    await connectToDatabase();

    const transcriptions = await Transcription.find({});

    if (!transcriptions) throw new Error("No transcription found!");

    return {
      data: JSON.parse(JSON.stringify(transcriptions))
    }
  } catch (error) {
    handleError(error)
  }
}

const transcribeUrl = async (secureURL?: String) => {
  const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

  const { result, error } = await deepgram.listen.prerecorded.transcribeUrl(
    {
      url: secureURL,
    },
    {
      model: "nova-2",
      smart_format: true,
      detect_language: true
    }
  );

  console.log("RES = ", result)

  if (error) throw error;
  if (!error) return result;
};

// TRANSCRIBE LESSON
export async function transcribeLesson(transcription_id: string, userId: string, secureURL?: String) { 

  try {

    await connectToDatabase();

    console.log("SEC URL = ", secureURL)
    const transcript = await transcribeUrl(secureURL);

    console.log("TRANSCRIPT = (140)", transcript)
    

    if (transcript) {
      //console.log("TRanscript = ", transcript.results.channels[0].alternatives[0].transcript)
      const lesson_transcript = transcript.results.channels[0].alternatives[0].transcript;
      console.log("LT = ", lesson_transcript)
      const transcription = {
        _id: transcription_id,
        transcript: lesson_transcript,
        status: "Completed"
      }

      console.log("TRANS = (155)", transcription)
      
      const res = await updateTranscription({transcription, userId})
      console.log("RES (156) = ", res)
      return JSON.parse(JSON.stringify(transcription));
      
    }

    
  } catch (error) {
    handleError(error)
  }
}


