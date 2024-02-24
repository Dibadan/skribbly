import { Collection } from '@/components/shared/Collection'
import { columns } from '@/components/shared/Columns';
import { getAllTranscriptions } from '@/lib/actions/transcription.action';
import { SearchParamProps } from '@/types';
import React from 'react'

const Home = async () => {



  const transcriptions = await getAllTranscriptions();
  return (
    <>
      <section className="sm:mt-12">
        {/* <Collection 
          transcriptions={transcriptions?.data}
        /> */}
      </section>
    </>
  )
}

export default Home