import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Image from "next/image";


import Header from "@/components/shared/Header";
import { getUserById } from "@/lib/actions/user.actions";
import { getAllTranscriptions } from "@/lib/actions/transcription.action";

const Profile = async () => {
  const { userId } = auth();

  if (!userId) redirect("/sign-in");

  const user = await getUserById(userId);



  const transcriptions = await getAllTranscriptions(user._id);
  

  return (
    <>
      <Header title="Profile" />

      <section className="profile">
        <div className="profile-balance">
          <p className="p-14-medium md:p-16-medium">CREDITS AVAILABLE ( 1 credit = 1 minute )</p>
          <div className="mt-4 flex items-center gap-4">
            <Image
              src="/assets/icons/coins.svg"
              alt="coins"
              width={50}
              height={50}
              className="size-9 md:size-12"
            />
            <h2 className="h2-bold text-dark-600">{Math.round(user.creditBalance)}</h2>
          </div>
        </div>

        <div className="profile-image-manipulation">
          <p className="p-14-medium md:p-16-medium">TRANSCRIPTIONS DONE</p>
          <div className="mt-4 flex items-center gap-4">
            <Image
              src="/assets/icons/voice.png"
              alt="transcriptions done"
              width={50}
              height={50}
              className="size-9 md:size-12"
            />
            <h2 className="h2-bold text-dark-600">{transcriptions?.data.length}</h2>
          </div>
        </div>
      </section>

    </>
  );
};

export default Profile;