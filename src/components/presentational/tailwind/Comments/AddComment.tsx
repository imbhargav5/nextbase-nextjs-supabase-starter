import { useCreateRunComment } from '@/utils/react-query-hooks';
import { ChangeEvent, FormEvent, useState } from 'react';

export const AddComment = ({ runUUID }: { runUUID: string }) => {
  const [comment, setComment] = useState('');
  const { mutate } = useCreateRunComment();
  const handleCommentChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setComment(event.target.value);
  };
  const handleCommentSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (comment) {
      mutate({ text: comment, runUUID });
      setComment('');
    }
  };
  return (
    <div className="flex flex-col w-full">
      <form onSubmit={handleCommentSubmit}>
        <div className="flex flex-row w-full">
          <div></div>
          <div className="flex flex-col w-full space-y-1">
            <textarea
              className="border border-gray-300 rounded-md p-2"
              value={comment}
              onChange={handleCommentChange}
              placeholder="Add a comment"
            />
            <button
              className="bg-blue-500 justify-self-end hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              type="submit"
            >
              Comment
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
