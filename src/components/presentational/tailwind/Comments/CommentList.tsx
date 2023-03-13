import { T } from '@/components/ui/Typography';
import { CommentWithUser } from '@/types';
import Image from 'next/image';

export const CommentList = ({
  comments,
}: {
  comments: Array<CommentWithUser>;
}) => {
  return (
    <div className="flex flex-col px-2 space-y-4">
      {comments.map((comment) => (
        <div className="flex flex-row rounded space-x-2" key={comment.id}>
          <div className="rounded-full overflow-hidden bg-slate-300 border border-slate-500">
            <Image
              src={
                comment.user_profile.avatar_url ?? 'https://place-hold.it/24'
              }
              className="opacity-0"
              alt={comment.user_profile.full_name ?? 'No name'}
              width={24}
              height={24}
            />
          </div>
          <T.Small className="relative top-1">{comment.text}</T.Small>
        </div>
      ))}
    </div>
  );
};
