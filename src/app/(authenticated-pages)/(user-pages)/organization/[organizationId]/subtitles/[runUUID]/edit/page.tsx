'use client';
import { T } from '@/components/ui/Typography';
import { Table, UnwrapPromise } from '@/types';
import { normalizeS3FileName } from '@/utils/helpers';
import {
  useGetRun,
  useGetRunComments,
  useGetSubtitles,
} from '@/utils/react-query-hooks';
import {
  ParsedSubtitleText,
  parsedSubtitleTextSchema,
  parsedSubtitleTextSchemaWithId,
  ParsedSubtitleTextWithId,
} from '@/utils/subtitle';
import { getSubtitles } from '@/utils/supabase-queries';
import { ReactNode, useMemo, useRef, useState } from 'react';
import Editor from './Editor';
import { SubtitleActions } from './SubtitleActions';
import { DndContext, Modifier, rectIntersection } from '@dnd-kit/core';
import { useDraggable } from '@dnd-kit/core';
import { Button } from '@/components/ui/Button';
import { useVideo } from '@/hooks/useVideo';
import {
  restrictToHorizontalAxis,
  restrictToWindowEdges,
} from '@dnd-kit/modifiers';
import { useArrayState, useKeyBindings, useKeyRef } from 'rooks';
import { v4 } from 'uuid';
import { Slider } from '@/components/ui/Slider';
import { ManageSpeakers } from '@/components/presentational/tailwind/ManageSpeakers';
import { CommentList } from '@/components/presentational/tailwind/Comments/CommentList';
import { AddComment } from '@/components/presentational/tailwind/Comments/AddComment';
import { ExportSubtitlesDialog } from '@/components/presentational/tailwind/ExportSubtitlesDialog';
import { generatedParsedSubtitlesWithId } from '@/utils/generateParsedSubtitlesWithId';

const customModifer: (
  positions: Array<{
    left: number;
    width: number;
    id: string;
  }>,
  maxPx: number
) => Modifier =
  (positions, maxPx) =>
    ({ active, activeNodeRect, transform }) => {
      // prevent collisions with previous and next items
      const currentIndex = positions.findIndex((p) => p.id === active?.id);
      if (currentIndex === -1) {
        return transform;
      } else {
        const prevIndex = currentIndex - 1;
        const nextIndex = currentIndex + 1;
        const currentPosition = positions[currentIndex];

        if (!currentPosition) {
          return transform;
        }
        const minXBoundary =
          (positions[prevIndex]?.left ?? 0) + (positions[prevIndex]?.width ?? 0);
        const maxXBoundary = positions[nextIndex]?.left ?? maxPx;

        const minXDelta = minXBoundary - currentPosition.left;
        const maxXDelta =
          maxXBoundary - (currentPosition.left + currentPosition.width);

        const newDelta = Math.max(minXDelta, Math.min(maxXDelta, transform.x));

        return {
          ...transform,
          x: newDelta,
          y: transform.y,
        };
      }
    };

function DraggableSubtitle({
  subtitle,
  left,
  width,
}: {
  left: number;
  width: number;
  subtitle: ParsedSubtitleTextWithId[number];
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: subtitle.id,
    attributes: {
      roleDescription: 'sortable',
    },
  });
  const dragTransform = {
    transform: `translate3d(${transform?.x ?? 0}px, ${transform?.y ?? 0}px, 0)`,
  };
  const style = transform
    ? {
      ...dragTransform,
      left: `${left}px`,
      width: `${width}px`,
    }
    : {
      left: `${left}px`,
      width: `${width}px`,
    };

  return (
    <div
      ref={setNodeRef}
      className="absolute bg-white"
      style={style}
      {...listeners}
      {...attributes}
    >
      <div className="text-xs cursor-pointer w-full  border w-24 rounded px-2 py-1 text-gray-500 overflow-hidden">
        {subtitle.word}
      </div>
    </div>
  );
}

function Timeline({
  parsedSubtitles,
  durationInSeconds,
  arrayControls,
  videoCurrentTime,
}: {
  parsedSubtitles: ParsedSubtitleTextWithId;
  durationInSeconds: number;
  arrayControls: ReturnType<
    typeof useArrayState<ParsedSubtitleTextWithId[number]>
  >[1];
  videoCurrentTime: number;
}) {
  const [scale, setScale] = useState<number>(60);
  const markers = Array.from({ length: durationInSeconds }, (_, i) => i);
  // let 1 second be 60px wide
  const positions = parsedSubtitles.map((s) => {
    const width = (s.end - s.start) * scale;
    return {
      left: s.start * scale,
      width: width,
      id: s.id,
    };
  });
  const lastSubtitleEndSeconds = parsedSubtitles.at(-1)?.end;
  const maxSeconds = Math.max(durationInSeconds, lastSubtitleEndSeconds ?? 0);
  const maxPx = maxSeconds * scale;
  const modifier = customModifer(positions, maxPx);
  const cursorPosition = videoCurrentTime * scale;
  return (
    <DndContext
      // prevent dragmove when there are collisions
      onDragEnd={({ active, delta, collisions }) => {
        // if (!active || !collisions?.length) {
        //   return;
        // }
        const index = parsedSubtitles.findIndex((s) => s.id === active.id);
        const position = positions[index];
        const newLeft = position.left + delta.x;
        const newStart = newLeft / scale;
        const newEnd = newStart + position.width / scale;
        arrayControls.replaceItemAtIndex(index, {
          ...parsedSubtitles[index],
          start: newStart,
          end: newEnd,
        });
      }}
      modifiers={[restrictToHorizontalAxis, restrictToWindowEdges, modifier]}
    >
      <div
        className="h-48 shadow w-full  grid overflow-auto border-t border-slate-200"
        style={{
          gridTemplateRows: 'auto auto 1fr',
        }}
      >
        <div className="bg-slate-600">
          <div className="py-3  px-2 w-[240px] ">
            <Slider
              defaultValue={[scale]}
              max={100}
              min={1}
              step={1}
              onValueChange={(newValue) => {
                setScale(newValue[0]);
              }}
              className="w-[220px]"
            />
          </div>
        </div>
        <div className="bg-slate-900  border border-slate-800 h-12 py-2">
          <div className="flex h-full gap-16">
            {markers.map((m) => {
              return <div key={m} className={`w-[1px] h-full bg-slate-800 `} />;
            })}
          </div>
        </div>
        <div className="bg-slate-900 items-start select-none py-4 relative">
          {parsedSubtitles.map((s, index) => {
            const { left, width } = positions[index];
            return (
              <DraggableSubtitle
                left={left ?? 0}
                width={width ?? 0}
                key={s.id}
                subtitle={s}
              />
            );
          })}
          <div
            className="absolute w-1 top-0 bottom-0 bg-red-600"
            style={{
              transform: `translateX(${cursorPosition}px)`,
              transition: `all ease 0.3s`,
            }}
          ></div>
        </div>
      </div>
    </DndContext>
  );
}

function VideoInner({
  data,
  runUUID,
  run,
}: {
  run: Table<'runs'>;
  runUUID: string;
  data: UnwrapPromise<ReturnType<typeof getSubtitles>>;
}) {
  const [parsedModifiedSubtitles, controls] = useArrayState(
    generatedParsedSubtitlesWithId(data.modified || data.original)
  );

  const originalSubtitles = useMemo(
    () => generatedParsedSubtitlesWithId(data.original),
    [data.original]
  );

  const originalSpeakersDetails = useMemo(() => {
    const speakers = originalSubtitles.map((s) => s.speaker);
    const list = Array.from(new Set(speakers));
    const map = list.reduce((acc, speaker) => {
      acc[speaker] = speaker;
      return acc;
    }, {} as Record<string, number>);
    return {
      list,
      map,
    };
  }, [originalSubtitles]);

  const [vidRef, videoState, videoControls] = useVideo();
  const { data: runComments, isLoading: isRunCommentsLoading } =
    useGetRunComments(runUUID);

  useKeyBindings({
    Space: (event) => {
      if (
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        /* @ts-ignore */
        event.target?.tagName === 'INPUT' ||
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        /* @ts-ignore */
        event.target?.tagName === 'TEXTAREA'
      ) {
        return;
      }
      if (videoState.paused) {
        videoControls.play();
      } else {
        videoControls.pause();
      }
    },
  });

  const { videoUrl } = data;
  const currentSubtitleSection = parsedModifiedSubtitles.reverse().find((s) => {
    return s.start <= videoState.currentTime && videoState.currentTime <= s.end;
  });
  const runTitle = normalizeS3FileName(run.file_key);
  return (
    <div
      className="h-full grid pt-2"
      style={{
        gridTemplateRows: 'auto 1fr auto',
      }}
    >
      <div className="grid justify-between grid-cols-[auto,1fr]">
        <div className="px-2">
          <T.H1>{runTitle}</T.H1>
        </div>
        <div className="flex justify-end items-center space-x-2 gap-1 px-2">
          <ManageSpeakers
            speakers={originalSpeakersDetails.list.map(String)}
            updateSpeakers={console.log}
          />
          <ExportSubtitlesDialog
            runTitle={runTitle}
            data={data}
            runUUID={runUUID}
          />
        </div>
      </div>
      <div
        className="grid relative px-2 overflow-hiddenh border-t border-slate-300"
        style={{
          gridTemplateColumns: 'auto 600px 320px',
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
            className="pt-4 bg-slate-900"
            autoPlay={false}
            preload="auto"
            loop
            ref={vidRef}
          ></video>
          <SubtitleActions
            currentSubtitleSection={currentSubtitleSection}
            parsedSubtitles={parsedModifiedSubtitles}
          />
        </div>
        <Editor
          parsedSubtitles={parsedModifiedSubtitles}
          setModifiedParsedSubtitles={(newSubtitles) => {
            controls.setArray(newSubtitles);
          }}
          vidRef={vidRef}
          seekTime={videoControls.seek}
          runUUID={runUUID}
          currentSubtitleSection={currentSubtitleSection}
          currentTimeSeconds={videoState.currentTime}
        />
        <div className="bg-slate-100 border-l border-slate-300 px-2">
          <div className="space-y-4">
            <T.H4 className="mt-2 px-2">Comments</T.H4>
            {isRunCommentsLoading || !runComments ? (
              <T.P>Loading...</T.P>
            ) : (
              <>
                <CommentList comments={runComments} />
                <AddComment runUUID={runUUID} />
              </>
            )}
          </div>
        </div>
      </div>
      <Timeline
        durationInSeconds={run.duration_in_secs}
        parsedSubtitles={parsedModifiedSubtitles}
        arrayControls={controls}
        videoCurrentTime={videoState.currentTime}
      />
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
  const { data: subtitle, isLoading: isSubtitleLoading } =
    useGetSubtitles(runUUID);
  const { data: run, isLoading: isRunLoading } = useGetRun(runUUID);
  if (isSubtitleLoading || isRunLoading) {
    return <div>Loading...</div>;
  }

  if (!subtitle || !run) {
    return <div>Error: No data</div>;
  }

  return <VideoInner run={run} runUUID={runUUID} data={subtitle} />;
}
