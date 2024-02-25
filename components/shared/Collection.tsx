"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { CldImage } from "next-cloudinary";

import {
  Pagination,
  PaginationContent,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { transformationTypes } from "@/constants";
import { formUrlQuery } from "@/lib/utils";

import { Button } from "../ui/button";


import { ITranscription } from "@/lib/database/models/transcription.model";

export const Collection = ({
  transcriptions
  
}: {
  transcriptions: ITranscription[];
}) => {

  

  return (
    <>
      <div className="collection-heading">
        <h2 className="h2-bold text-customColor">Recent Transcriptions</h2>
      </div>

      {transcriptions.length > 0 && 
        <ul className="collection-list">
          {transcriptions.map((transcription) => (
            <Card transcription={transcription} key={transcription._id} />
          ))}
        </ul>
            }
    </>
  );
};


const Card = ({ transcription }: { transcription: ITranscription }) => {
  const isCompleted = transcription.status === "Completed";

  return (
    <div className={`collection-card ${isCompleted ? 'clickable' : ''}`}>
      {isCompleted ? (
        <Link href={`/transcriptions/${transcription._id}`}>
          
            <div className="flex flex-col">
              <p>Name: {transcription.name}</p>
              <p>Duration: {transcription.minutes} seconds</p>
              <p>Status: {transcription.status}</p>
            </div>
        </Link>
      ) : (
        <div className="flex flex-col">
          <p>Name: {transcription.name}</p>
          <p>Duration: {transcription.minutes} seconds</p>
          <p>Status: {transcription.status}</p>
        </div>
      )}
    </div>
  );
};

// const Card = ({ transcription }: { transcription: ITranscription }) => {
//     return (
//             <Link href={`/transcriptions/${transcription._id}`} className="collection-card">
        
//         <div className="flex flex-col">
//           <p>
//             Name: {transcription.name}
//           </p>
//           <p>
//             Duration: {transcription.minutes} seconds
//           </p>
//           <p>
//             Status: {transcription.status}
//           </p>
          
//         </div>
//       </Link>
//     );
//   };
  


// const Card = ({ transcription }: { transcription: ITranscription }) => {
//   return (
//     <li>
//       <Link href={`/transcriptions/${transcription._id}`} className="collection-card">
        
//         <div className="flex-between">
//           <p className="p-20-semibold mr-3 line-clamp-1 text-dark-600">
//             Name: {transcription.name}
//           </p>
//           <p className="p-20-semibold mr-3 line-clamp-1 text-dark-600">
//             Duration: {transcription.minutes}
//           </p>
//           <p className="p-20-semibold mr-3 line-clamp-1 text-dark-600">
//             Status: {transcription.minutes}
//           </p>
          
//         </div>
//       </Link>
//     </li>
//   );
// };