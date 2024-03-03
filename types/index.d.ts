/* eslint-disable no-unused-vars */

import { ITranscription } from "@/lib/database/models/transcription.model";

// ====== USER PARAMS
declare type CreateUserParams = {
    clerkId: string;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    photo: string;
    apiKey: string;
  };
  
  declare type UpdateUserParams = {
    firstName: string;
    lastName: string;
    username: string;
    photo: string;
  };
  
  // ====== IMAGE PARAMS
  declare type AddLessonParams = {
    lesson: {
      publicId: string | undefined;
      secureURL: string | undefined;
      minutes: number;
      name: string;
      transcript: string;
    };
    userId: string;
    path: string;
  };
  
  declare type UpdateTranscriptionParams = {
    transcription: {
      _id: string;
      transcript: string;
      status:string;
    };
    userId: string;
  };
  
  declare type Transformations = {
    restore?: boolean;
    fillBackground?: boolean;
    remove?: {
      prompt: string;
      removeShadow?: boolean;
      multiple?: boolean;
    };
    recolor?: {
      prompt?: string;
      to: string;
      multiple?: boolean;
    };
    removeBackground?: boolean;
  };
  
  // ====== TRANSACTION PARAMS
  declare type CheckoutTransactionParams = {
    plan: string;
    credits: number;
    amount: number;
    buyerId: string;
  };
  
  declare type CreateTransactionParams = {
    stripeId: string;
    amount: number;
    credits: number;
    plan: string;
    buyerId: string;
    createdAt: Date;
  };
  
  declare type TransformationTypeKey =
    | "restore"
    | "fill"
    | "remove"
    | "recolor"
    | "removeBackground";
  
  // ====== URL QUERY PARAMS
  declare type FormUrlQueryParams = {
    searchParams: string;
    key: string;
    value: string | number | null;
  };
  
  declare type UrlQueryParams = {
    params: string;
    key: string;
    value: string | null;
  };
  
  declare type RemoveUrlQueryParams = {
    searchParams: string;
    keysToRemove: string[];
  };
  
  declare type SearchParamProps = {
    params: { id: string; };
  };
  
  declare type TranscriptionFormProps = {
    action: "Add";
    userId: string;
    creditBalance: number;
    data?: ITranscription | null;
  };

  declare type apiKey = {
    key:string;
  }
  
