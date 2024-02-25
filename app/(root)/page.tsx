import { Collection } from '@/components/shared/Collection'
import { getAllTranscriptions } from '@/lib/actions/transcription.action';
import { SignedIn } from '@clerk/nextjs';
import React from 'react'

const Home = async () => {



  const transcriptions = await getAllTranscriptions();
  return (
    <>
      <section className="sm:mt-12">
        <SignedIn>
        <Collection 
          transcriptions={transcriptions?.data}
        />

        </SignedIn>
        
      </section>
    </>
  )
}

export default Home