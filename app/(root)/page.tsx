// import { Collection } from '@/components/shared/Collection'
// import { getAllTranscriptions } from '@/lib/actions/transcription.action';
// import { SignedIn } from '@clerk/nextjs';
// import React from 'react'

// const Home = async () => {

  

//   const transcriptions = await getAllTranscriptions();
//   return (
//     <>
//       <section className="sm:mt-12">
//         <SignedIn>
//         <Collection 
//           transcriptions={transcriptions?.data}
//         />

//         </SignedIn>
        
//       </section>
//     </>
//   )
// }

// export default Home

"use client"
import { Collection } from '@/components/shared/Collection';
import { getAllTranscriptions } from '@/lib/actions/transcription.action';
import { SignedIn } from '@clerk/nextjs';
import React, { useEffect, useState } from 'react';

const Home = () => {
  const [transcriptions, setTranscriptions] = useState([]);

  useEffect(() => {
    const fetchTranscriptions = async () => {
      try {
        const result = await getAllTranscriptions();
        setTranscriptions(result?.data);
      } catch (error) {
        console.error('Error fetching transcriptions:', error);
      }
    };

    fetchTranscriptions();
  }, []);

  return (
    <>
      <section className="sm:mt-12">
        <SignedIn>
          <Collection transcriptions={transcriptions} />
        </SignedIn>
      </section>
    </>
  );
};

export default Home;
