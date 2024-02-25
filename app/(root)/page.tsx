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
import { SignedIn, SignedOut } from '@clerk/nextjs';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'
import { useAuth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { getUserById } from '@/lib/actions/user.actions';

const Home = () => {
  const [transcriptions, setTranscriptions] = useState([]);
  const router = useRouter()

  const { userId } = useAuth();
  

  useEffect(() => {
    const fetchTranscriptions = async () => {
      try {
        if (!userId) redirect("/");
        const user = await getUserById(userId);
        const result = await getAllTranscriptions(user._id);
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
        <SignedOut>
          <section className="sm:mt-12">
            {/* Hero Section */}
            <div className=" text-customColor py-16 px-4 sm:px-0 flex justify-center items-center" style={{ backgroundColor: "#FFF7EA" }}>
              <div className="max-w-7xl mx-auto text-center">
                <h1 className="text-4xl sm:text-5xl font-bold mb-4">Welcome to Skribbly</h1>
                <p className="text-lg sm:text-xl mb-8">The ultimate tool for transcribing your lessons.</p>
                <button onClick={() => router.push('/sign-up')} className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-6 rounded-full text-lg font-semibold shadow-md" style={{ backgroundColor: "#EA750F" }}>Get Started</button>
              </div>
            </div>
            
          </section>
        </SignedOut>
      </section>
    </>
  );
};

export default Home;

