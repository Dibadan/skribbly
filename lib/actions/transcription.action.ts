"use server"

import { connectToDatabase } from "../database/mongoose";
import { handleError } from "../utils";
import User from "../database/models/user.model";
import Transcription from "../database/models/transcription.model";
import { AddLessonParams, UpdateTranscriptionParams } from "@/types";
import { revalidatePath } from "next/cache";
const { createClient } = require("@deepgram/sdk");
import {Types} from "mongoose"

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
    const transcriptionToUpdate = await Transcription.findById(transcription._id);


    const creatorID = transcriptionToUpdate.creator.toString();
  

    if (!transcriptionToUpdate || creatorID !== userId) {
      throw new Error("Unauthorized or transcription not found");
    }

    const updatedTranscription = await Transcription.findByIdAndUpdate(
      transcriptionToUpdate._id,
      transcription,
      { new: true }
    )



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
export async function getAllTranscriptions(creatorId:string) {
  try {

    await connectToDatabase();

    const transcriptions = await Transcription.find({"creator" : creatorId});
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


  if (error) throw error;
  if (!error) return result;
};

// TRANSCRIBE LESSON
export async function transcribeLesson(transcription_id: string, userId: string, secureURL?: String) { 

  try {

    await connectToDatabase();

    const transcript = await transcribeUrl(secureURL);
    

    if (transcript.results.channels[0].alternatives[0].transcript !== '') {
      const lesson_transcript = transcript.results.channels[0].alternatives[0].transcript;
      const transcription = {
        _id: transcription_id,
        transcript: lesson_transcript,
        status: "Completed"
      }
      
      const res = await updateTranscription({transcription, userId})
      return JSON.parse(JSON.stringify(transcription));
      
    }

    
  } catch (error) {
    handleError(error)
  }
}


