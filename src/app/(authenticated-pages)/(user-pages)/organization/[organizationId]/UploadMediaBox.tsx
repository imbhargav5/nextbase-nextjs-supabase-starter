'use client';
import { T } from '@/components/ui/Typography';
import React, { useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-hot-toast';

export type DropzoneFile = File & {
  path: string;
};

export type DropzoneFileWithDuration = DropzoneFile & {
  duration: number;
};

type UploadMediaBoxProps = {
  onUpload: (files: DropzoneFile[]) => void;
};

//typeguard to narrow file to DropzoneFile
function isDropzoneFile(file: File): file is DropzoneFile {
  return 'path' in file;
}

export function UploadMediaBox({ onUpload }: UploadMediaBoxProps) {
  const { getRootProps, getInputProps, fileRejections } = useDropzone({
    accept: {
      ['video/mp4']: ['.mp4'],
      ['audio/mp3']: ['.mp3'],
    },
    maxSize: 1.5 * 1024 * 1024 * 1024, // 1.5 GB
    onDropAccepted(files) {
      const dropzoneFiles = files.filter(
        isDropzoneFile
      ) as unknown as DropzoneFile[];
      onUpload(dropzoneFiles);
    },
  });

  useEffect(() => {
    if (fileRejections.length > 0) {
      const rejectedFiles = fileRejections.map(
        (fileRejection) => fileRejection.file.name
      );
      toast.error(
        () => (
          <div className="space-y-2  max-w-4xl w-full">
            <T.P> Error uploading {rejectedFiles.length} files </T.P>
            <div className="!text-xs space-y-1">
              {fileRejections.map((fileRejection) => {
                if (fileRejection.errors.length > 0) {
                  return (
                    <div
                      className="flex items-center space-x-2"
                      key={fileRejection.file.name}
                    >
                      <span className="text-xs">{fileRejection.file.name}</span>
                      <span className="text-xs text-red-500">
                        {fileRejection.errors
                          .map((error) => error.message)
                          .join(', ')}
                      </span>
                    </div>
                  );
                } else {
                  return null;
                }
              })}
            </div>
          </div>
        ),
        {
          duration: 5000,
        }
      );
    }
  }, [fileRejections]);

  return (
    <section className="container select-none">
      <div
        {...getRootProps({
          className:
            'dropzone h-48 w-full border-dashed border-2 border-blue-400 flex items-center justify-center',
        })}
      >
        <input {...getInputProps()} />
        <div className="cursor-pointer space-y-2 text-gray-500 flex flex-col items-center justify-center">
          <T.P>Upload Video(.mp4) or Audio(.mp3) files</T.P>
          <div className=" space-y-1 flex flex-col items-center justify-center">
            <T.P className="text-xs">
              Pro tip: Use mp3 files for quicker conversion.
            </T.P>
            <T.P className="text-xs">Max length: 120 minutes</T.P>
            <T.P className="text-xs">Max size: 1.5 GB</T.P>
          </div>
        </div>
      </div>
    </section>
  );
}
