import { useRouter } from 'next/navigation';
import React, { ReactElement } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useDebounce } from 'rooks';

import { AiOutlineScissor } from '@react-icons/all-files/ai/AiOutlineScissor';
import { BsChevronDoubleUp } from '@react-icons/all-files/bs/BsChevronDoubleUp';
import { Tooltip } from 'react-tooltip';

import cuid from 'cuid';
import { toast } from 'react-hot-toast';
import {
  isValidTimestamp,
  msToTimestamp,
  splitArrayToHalves,
  timestampToMs,
} from '@/utils/helpers';
import {
  ccLengthValidator,
  convertSubtitleArrayToVTT,
  ParsedSubtitleText,
} from '@/utils/subtitle';
import { Input } from '@/components/ui/Input';
import { T } from '@/components/ui/Typography';
import { Textarea } from '@/components/ui/Textarea';

interface IProps {
  parsedSubtitles: ParsedSubtitleText;
  currentTimeSeconds: number;
  setModifiedParsedSubtitles: (
    parsedModifiedSubtitles: ParsedSubtitleText
  ) => void;
  vidRef: React.MutableRefObject<HTMLVideoElement | null>;
  runUUID: string;
}

const activeTextboxStyle = {
  background: 'black',
  opacity: '0.8',
  color: 'white',
};

const inActiveTextboxStyle = {
  background: 'white',
  opacity: '1',
  color: 'black',
};

function Editor(props: IProps): ReactElement {
  const runUUID = props.runUUID;
  const URL_SUBTITLES = [`/api/storage/subtitles/${runUUID}/edit`];
  const saveSubtitles = ({
    subtitleText,
  }: {
    subtitleText: string;
    subtitleId?: number;
  }) => {
    console.log('do nothing');
  };
  const mutateSubtitles = useMutation(URL_SUBTITLES, saveSubtitles, {
    onSettled(data: unknown, error: unknown) {
      if (data.error || error) {
        toast(`Unable to save. \n ${data?.error?.message || error?.message}`);
      }
    },
  });

  const debouncedText = useDebounce(
    (word, position) => {
      const modifiedParsedSubtitles = props.parsedSubtitles.map((s, index) => {
        return {
          ...s,
          word: index === position ? word : s.word,
        };
      });
      const modifiedSubtitlesText = convertSubtitleArrayToVTT(
        modifiedParsedSubtitles
      );
      mutateSubtitles.mutate({
        subtitleText: modifiedSubtitlesText,
        subtitleId: position,
      });
      props.setModifiedParsedSubtitles(modifiedParsedSubtitles);
    },
    // delay in ms
    500
  );

  const splitSubtitles = (position: number) => {
    const p = props.parsedSubtitles[position];
    const currSentenceHalves = splitArrayToHalves(p.word.trim().split(' '));
    const currentSentenceDuration = p.end - p.start;
    if (currentSentenceDuration < 2000) {
      toast.error('Cannot split less than 1 second');
      return;
    }
    const currModifedElem: ParsedSubtitleText[number] = {
      ...p,
      word: currSentenceHalves.firstHalf.join(' '),
      end: p.start + Math.floor(currentSentenceDuration / 2000),
    };
    const newElem: ParsedSubtitleText[number] = {
      ...p,
      word: currSentenceHalves.secondHalf.join(' '),
      start: currModifedElem.end,
    };

    const ps = JSON.parse(JSON.stringify(props.parsedSubtitles));

    ps.splice(position, 1, currModifedElem);
    ps.splice(position + 1, 0, newElem);

    const modifiedSubtitles = ps.map((p, n) => {
      return {
        ...p,
        id: n,
        renderId: cuid(),
      };
    });

    const modifiedSubtitlesText = convertSubtitleArrayToVTT(modifiedSubtitles);
    mutateSubtitles.mutate({
      subtitleText: modifiedSubtitlesText,
      subtitleId: position,
    });
    props.setModifiedParsedSubtitles(modifiedSubtitles);
  };

  const mergeWithAboveSub = (position: number) => {
    const aboveElem = props.parsedSubtitles[position - 1];
    const currElem = props.parsedSubtitles[position];

    const currModifedElem: ParsedSubtitleText[number] = {
      ...aboveElem,
      word: aboveElem.word + ' ' + currElem.word,
      end: currElem.end,
    };

    const ps: ParsedSubtitleText = JSON.parse(
      JSON.stringify(props.parsedSubtitles)
    );
    ps[position - 1] = currModifedElem;
    ps.splice(position, 1);

    const modifiedSubtitles = ps.map((p, n) => {
      return {
        ...p,
        id: n,
        renderId: cuid(),
      };
    });

    const modifiedSubtitlesText = convertSubtitleArrayToVTT(modifiedSubtitles);
    mutateSubtitles.mutate({
      subtitleText: modifiedSubtitlesText,
      subtitleId: position,
    });
    props.setModifiedParsedSubtitles(modifiedSubtitles);
  };
  console.log(props.parsedSubtitles);

  return (
    <div className="h-full space-y-4">
      {props.parsedSubtitles.map((p, n) => (
        <div key={`key_subtitle_boxes_${n}`}>
          {/* <SuperCard> */}
          <div className="flex justify-between items-center">
            {/* <Text>{p.renderId}</Text> */}

            <T.P>
              {`(${n + 1}/${props.parsedSubtitles.length})`}
              {/* {n + 1} */}
            </T.P>
            <div className="flex">
              {/* <HStack> */}
              {/* <AiOutlineLeft size={12} cursor="pointer" /> */}
              <Input
                placeholder="Unstyled"
                defaultValue={`${msToTimestamp(p.start * 1000)}`}
                onChange={(e) => {
                  const ts = e.target.value.trim();
                  if (isValidTimestamp(ts)) {
                    const modifiedParsedSubtitles = props.parsedSubtitles;
                    modifiedParsedSubtitles[n].start = timestampToMs(ts) / 1000;
                    const modifiedSubtitlesText = convertSubtitleArrayToVTT(
                      modifiedParsedSubtitles
                    );
                    mutateSubtitles.mutate({
                      subtitleText: modifiedSubtitlesText,
                    });
                    props.setModifiedParsedSubtitles(modifiedParsedSubtitles);
                  }
                }}
              />
              {/* <AiOutlineRight size={12} cursor="pointer" /> */}
              <T.P>-</T.P>
              <Input
                placeholder="Unstyled"
                defaultValue={`${msToTimestamp(p.end * 1000)}`}
                onChange={(e) => {
                  const ts = e.target.value.trim();
                  if (isValidTimestamp(ts)) {
                    const modifiedParsedSubtitles = props.parsedSubtitles;
                    modifiedParsedSubtitles[n].end = timestampToMs(ts) / 1000;
                    const modifiedSubtitlesText = convertSubtitleArrayToVTT(
                      modifiedParsedSubtitles
                    );
                    mutateSubtitles.mutate({
                      subtitleText: modifiedSubtitlesText,
                    });
                    props.setModifiedParsedSubtitles(modifiedParsedSubtitles);
                  }
                }}
              />
              {/* </HStack> */}
            </div>

            {/* {mutateSubtitles.isLoading && mutateSubtitles.variables.subtitleId === n && (
                            <Text fontSize={'xs'} textAlign="center" color={'gray.800'}>
                                {'saving...'}
                            </Text>
                        )} */}

            {/* <HStack mr={4} flex={1} justifyContent="right">
              <Tooltip label="Split into half" aria-label="Split into half">
                <Box>
                  <AiOutlineScissor
                    onClick={() => {
                      splitSubtitles(n);
                    }}
                    cursor="pointer"
                  />
                </Box>
              </Tooltip>
              {n !== 0 && (
                <Tooltip label="Merge with above" aria-label="Merge with above">
                  <Box>
                    <BsChevronDoubleUp
                      onClick={() => {
                        mergeWithAboveSub(n);
                      }}
                      cursor="pointer"
                    />
                  </Box>
                </Tooltip>
              )}
            </HStack> */}
          </div>

          <div id={`sec_${n + 1}`}>
            <Textarea
              className="bg-white text-sm"
              onChange={(e) => {
                debouncedText.callback(e.target.value, n);
              }}
              defaultValue={p.word}
              onClick={() => {
                if (props.vidRef.current) {
                  props.vidRef.current.currentTime = p.start;
                }
              }}
              onPaste={(e) => {
                debouncedText.callback(e.clipboardData.getData('text'), n);
              }}
              onKeyDown={(e) => {
                const specialKey = e.ctrlKey || e.metaKey;
                if (specialKey && e.key === 'Enter') {
                  e.preventDefault();
                  splitSubtitles(n);
                } else if (specialKey && e.key === 'Backspace') {
                  if (n !== 0) {
                    e.preventDefault();
                    mergeWithAboveSub(n);
                  }
                }
                // else if (specialKey && e.key === 'p') {
                //     e.preventDefault();
                // }
              }}
            />
            <div className="justify-end">
              {/* <Tooltip
                label={ccLengthValidator(p.text).message}
                aria-label={ccLengthValidator(p.text).message}
              >
                <T.P
                  fontSize={'xs'}
                  mr={4}
                  color={ccLengthValidator(p.text).color}
                >
                  {p.text.length}
                </T.P>
              </Tooltip> */}
            </div>
          </div>

          {/* </SuperCard> */}
        </div>
      ))}
    </div>
  );
}

export default Editor;
