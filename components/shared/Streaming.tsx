import { getUserById } from "@/lib/actions/user.actions";
import React, { useState, useRef, useEffect } from "react";
const { createClient, LiveTranscriptionEvents  } = require("@deepgram/sdk");
const fetch = require("cross-fetch");
//const dotenv = require("dotenv");
//dotenv.config();

interface StreamingProps {userId:string}

const url = "http://stream.live.vc.bbcmedia.co.uk/bbc_world_service";


async function liveTranscribe(userId:string) {
  // STEP 1: Create a Deepgram client using the API key
  const user = await getUserById(userId);
  const userApiKey = user.apiKey;
  const deepgram = createClient(userApiKey);
  // STEP 2: Create a live transcription connection
  const connection = deepgram.listen.live({
    model: "nova-2",
    language: "en-US",
    smart_format: true,
  });

  // STEP 3: Listen for events from the live transcription connection
  connection.on(LiveTranscriptionEvents.Open, () => {
    connection.on(LiveTranscriptionEvents.Close, () => {
      console.log("Connection closed.");
    });

    connection.on(LiveTranscriptionEvents.Transcript, (data: { channel: { alternatives: { transcript: any; }[]; }; }) => {
      console.log(data.channel.alternatives[0].transcript);
    });

    connection.on(LiveTranscriptionEvents.Metadata, (data: any) => {
      console.log(data);
    });

    connection.on(LiveTranscriptionEvents.Error, (err: any) => {
      console.error(err);
    });

    // STEP 4: Fetch the audio stream and send it to the live transcription connection
    fetch(url)
      .then((r: { body: any; }) => r.body)
      .then((res: { on: (arg0: string, arg1: () => void) => void; read: () => any; }) => {
        res.on("readable", () => {
          connection.send(res.read());
        });
      });
  });
}

const Streaming: React.FC<StreamingProps> = ({userId}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
  const [transcript, setTranscript] = useState('')
  const recorderRef = useRef<MediaRecorder | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      recorderRef.current = new MediaRecorder(stream);
      recorderRef.current.ondataavailable = (e) => setRecordedAudio(e.data);
      recorderRef.current.start();
      liveTranscribe(userId)
      setIsRecording(true);
    } catch (err) {
      console.error("Error recording audio:", err);
    }
  };

  const stopRecording = () => {
    if (recorderRef.current) {
      recorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const downloadRecording = () => {
    if (recordedAudio) {
      const url = window.URL.createObjectURL(recordedAudio);
      const link = document.createElement("a");
      link.href = url;
      link.download = "recording.webm"; // Adjust file extension as needed
      link.click();
    }
  };

  useEffect(() => {
    return () => {
      if (recorderRef.current) {
        recorderRef.current.stop();
      }
    };
  }, []);

  return (
    <div>
      <button onClick={isRecording ? stopRecording : startRecording}>
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>
      {isRecording ? <p>{transcript}</p> : <p></p>}
    </div>
  );
};

export default Streaming;
