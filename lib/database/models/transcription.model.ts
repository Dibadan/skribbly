import { Schema, model, models, Document } from "mongoose";

export interface ITranscription extends Document {
    audioFile: string;
    minutes: number;
    name: string;
    status: "transcribing" | "completed";
    transcript: string;
    creationDate: Date;
    creator: {
        _id:string;
        firstName:string;
        lastName:string;
    }
  }
  

const TranscriptionSchema = new Schema({
    audioFile: {
      type: String,
      required: true
    },
    minutes: {
      type: Number,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ["transcribing", "completed"],
      default: "transcribing"
    },
    transcript: {
      type: String,
      required: true
    },
    creationDate: {
      type: Date,
      default: Date.now
    },
    creator: {
        type: Schema.Types.ObjectId, ref: 'User'
    }
  });

const Transcription = models?.Transcription || model('Transcription', TranscriptionSchema)

export default Transcription;