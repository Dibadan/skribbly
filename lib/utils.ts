/* eslint-disable prefer-const */
/* eslint-disable no-prototype-builtins */
import { type ClassValue, clsx } from "clsx";

import { twMerge } from "tailwind-merge";


export async function getApiKey() {
  // Replace with your actual Deepgram API token stored securely (e.g., environment variable)
  const deepgramProjectID = process.env.DEEPGRAM_PROJECT_ID;

  if (!deepgramProjectID) {
    throw new Error('Missing Deepgram API token. Please set the DEEPGRAM_PROJECT_ID environment variable.');
  }

  const options = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${deepgramProjectID}`, // Use Bearer token for authentication
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      comment: 'User Key',
      //scopes: ['member:keys:read'],
    }),
  };

  try {
    const response = await fetch('https://api.deepgram.com/v1/projects/7e676ee2-2122-466c-9f84-fb53ecf7f2ca/keys', options);

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.key; // Return only the 'key' property
  } catch (error) {
    console.error('Error fetching API key:', error);
    throw error; // Re-throw the error for proper handling
  }
}


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ERROR HANDLER
export const handleError = (error: unknown) => {
  if (error instanceof Error) {
    // This is a native JavaScript error (e.g., TypeError, RangeError)
    console.error(error.message);
    throw new Error(`Error: ${error.message}`);
  } else if (typeof error === "string") {
    // This is a string error message
    console.error(error);
    throw new Error(`Error: ${error}`);
  } else {
    // This is an unknown type of error
    console.error(error);
    throw new Error(`Unknown error: ${JSON.stringify(error)}`);
  }
};

