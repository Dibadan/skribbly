import Header from '@/components/shared/Header'
import TranscriptionForm from '@/components/shared/TranscriptionForm';
import { getUserById } from '@/lib/actions/user.actions';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

const AddTranscriptionTypePage = async () => {
  const { userId } = auth();

  if(!userId) redirect('/sign-in')

  const user = await getUserById(userId);

  return (
    <>
      <Header 
        title="Transcriptions"
      />
    
      <section className="mt-10">
        <TranscriptionForm 
          action="Add"
          userId={user._id}
          creditBalance={user.creditBalance}
        />
      </section>
    </>
  )
}

export default AddTranscriptionTypePage