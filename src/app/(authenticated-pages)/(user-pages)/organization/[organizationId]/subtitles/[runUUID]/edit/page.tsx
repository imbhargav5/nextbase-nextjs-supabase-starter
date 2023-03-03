'use client';
import { T } from '@/components/ui/Typography';
import { UnwrapPromise } from '@/types';
import { useGetSubtitles } from '@/utils/react-query-hooks';
import { ParsedSubtitleText } from '@/utils/subtitle';
import { getSubtitles } from '@/utils/supabase-queries';
import { useRef, useState } from 'react';
import Editor from './Editor';
import { SubtitleActions } from './SubtitleActions';

function VideoInner({
  data,
  runUUID,
}: {
  runUUID: string;
  data: UnwrapPromise<ReturnType<typeof getSubtitles>>;
}) {
  const [state, setState] = useState({
    videoOnLeft: true,
    parsedModifiedSubtitles: JSON.parse(data.modified || data.original),
    currentTimeSeconds: 0,
  });
  const vidRef = useRef<HTMLVideoElement>(null);

  const { videoUrl, original, modified } = data;
  const jsonSubtitles: ParsedSubtitleText = JSON.parse(modified ?? original);
  const currentSubtitleSection = jsonSubtitles.reverse().find((s) => {
    return (
      s.start <= state.currentTimeSeconds && state.currentTimeSeconds <= s.end
    );
  });
  return (
    <div>
      <T.H1>Subtitles</T.H1>
      <div
        className="grid "
        style={{
          gridTemplateColumns: '1fr 1fr',
          columnGap: '2rem',
        }}
      >
        <div className="space-y-2">
          <video
            controls
            src={videoUrl}
            width="100%"
            height="auto"
            style={{
              maxWidth: '700px',
              borderRadius: '10px',
              maxHeight: '400px',
            }}
            autoPlay={false}
            preload="auto"
            loop
            onTimeUpdate={(e) => {
              setState({
                ...state,
                currentTimeSeconds: e.currentTarget.currentTime,
              });
              // if (currentSubtitleSection) {
              //     document
              //         .getElementById(`sec_${currentSubtitleSection.id + 1}`)
              //         .scrollIntoView({
              //             behavior: 'smooth',
              //             block: 'center',
              //         });
              // }
            }}
            ref={vidRef}
          ></video>
          <SubtitleActions
            currentSubtitleSection={currentSubtitleSection}
            parsedSubtitles={state.parsedModifiedSubtitles}
          />
        </div>
        <Editor
          parsedSubtitles={state.parsedModifiedSubtitles}
          setModifiedParsedSubtitles={(newSubtitles) => {
            setState({
              ...state,
              parsedModifiedSubtitles: newSubtitles,
            });
          }}
          vidRef={vidRef}
          runUUID={runUUID}
          currentTimeSeconds={state.currentTimeSeconds}
        />
      </div>
    </div>
  );
}

export default function SubtitlesPage({
  params: { runUUID },
}: {
  params: {
    runUUID: string;
  };
}) {
  console.log({ runUUID });
  const { data, isLoading } = useGetSubtitles(runUUID);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>Error: No data</div>;
  }

  return <VideoInner runUUID={runUUID} data={data} />;
}
