import Image, { StaticImageData } from 'next/image';

type FeedbackComponentProps = {
  userName: string;
  feedback: string;
  userImage: StaticImageData;
};

export default function FeedbackComponent({
  userName,
  feedback,
  userImage,
}: FeedbackComponentProps) {
  return (
    <div className="flex items-start space-x-4">
      <Image
        src={userImage}
        width={48}
        alt={''}
        className="rounded-full mt-2 border b-slate-400"
      />

      <div className="w-[560px] space-y-2">
        <div>
          <p className="text-base font-[600]">{userName}</p>
          <p className="text-base font-[500] text-slate-600">{feedback}</p>
        </div>
      </div>
    </div>
  );
}
