import React, {
  PropsWithChildren,
  ReactElement,
  Ref,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useMutation } from '@tanstack/react-query';
import { useDebounce, useForkRef } from 'rooks';

import { toast } from 'react-hot-toast';
import { splitArrayToHalves } from '@/utils/helpers';
import {
  convertSubtitleArrayToVTT,
  ParsedSubtitleTextWithId,
} from '@/utils/subtitle';
import { T } from '@/components/ui/Typography';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { GitMerge, Scissors } from 'lucide-react';
import { v4 } from 'uuid';
import ReactDOM from 'react-dom';
import { getTextBoundingRect } from './getTextBoundingRect';
interface IProps {
  parsedSubtitles: ParsedSubtitleTextWithId;
  currentTimeSeconds: number;
  setModifiedParsedSubtitles: (
    parsedModifiedSubtitles: ParsedSubtitleTextWithId
  ) => void;
  vidRef: React.MutableRefObject<HTMLVideoElement | null>;
  runUUID: string;
  currentSubtitleSection: ParsedSubtitleTextWithId[number] | undefined;
  seekTime: (time: number) => void;
}
type OrNull<T> = T | null;

const Portal = ({ children }) => {
  return typeof document === 'object'
    ? ReactDOM.createPortal(children, document.body)
    : null;
};

const HoveringToolbar = ({
  characterIndex,
  onSplit,
  onMoveBelow,
  isVisible,
  selectionBoundingRect,
}: {
  isVisible: boolean;
  characterIndex: number;
  onSplit: () => void;
  onMoveBelow: () => void;
  selectionBoundingRect: DOMRect | null;
}) => {
  const ref = useRef<HTMLDivElement | null>();
  const forkRef = useForkRef(ref, null);

  useEffect(() => {
    const el = ref.current;
    console.log({ el, selectionBoundingRect });
    if (!el || !isVisible || !selectionBoundingRect) {
      // remove style attribute
      el?.removeAttribute('style');
      return;
    }
    // const domSelection = window.getSelection()
    // const domRange = domSelection.getRangeAt(0)
    // const rect = domRange.getBoundingClientRect()
    // console.log('showing toolbar', domSelection, domSelection.baseOffset, domRange, rect);

    // get mouse position and offset by toolbar height and width

    el.style.opacity = '1';
    el.style.left = `${selectionBoundingRect.left +
      window.pageXOffset -
      el.offsetWidth / 2 +
      selectionBoundingRect.width / 2
      }px`;
    el.style.top = `${selectionBoundingRect.top + window.pageYOffset - el.offsetHeight - 10
      }px`;
  }, [isVisible]);

  return (
    <Portal>
      <div
        ref={forkRef}
        className="-mt-2.5 px-3 py-2 absolute z-10 -top-[10000px] -left-[10000px] opacity-0 bg-gray-800 rounded-md transition-opacity"
        onMouseDown={(e) => {
          // prevent toolbar from taking focus away from editor
          e.preventDefault();
        }}
      >
        <button
          style={{
            color: 'white',
          }}
          onClick={() => onSplit()}
        >
          Split{' '}
        </button>
        <button
          style={{
            color: 'white',
          }}
          onClick={() => onMoveBelow()}
        >
          Move Below
        </button>
      </div>
    </Portal>
  );
};

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
  const [showToolbar, setShowToolbar] = useState<boolean>(false);
  const [selectionIndex, setSelectionIndex] = useState<number>(0);
  const [boundingRect, setBoundingRect] = useState<DOMRect | null>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const { currentSubtitleSection } = props;
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
    const currentSentenceDurationSeconds = p.end - p.start;
    if (currentSentenceDurationSeconds < 2) {
      toast.error('Cannot split less than 1 second');
      return;
    }
    const currModifedElem: ParsedSubtitleTextWithId[number] = {
      ...p,
      word: currSentenceHalves.firstHalf.join(' '),
      end: p.start + Math.floor(currentSentenceDurationSeconds / 2),
    };
    const newElem: ParsedSubtitleTextWithId[number] = {
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
        id: v4(),
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

    const currModifedElem: ParsedSubtitleTextWithId[number] = {
      ...aboveElem,
      word: aboveElem.word + ' ' + currElem.word,
      end: currElem.end,
    };

    const ps: ParsedSubtitleTextWithId = JSON.parse(
      JSON.stringify(props.parsedSubtitles)
    );
    ps[position - 1] = currModifedElem;
    ps.splice(position, 1);

    const modifiedSubtitles = ps.map((p, n) => {
      return {
        ...p,
        id: v4(),
      };
    });

    const modifiedSubtitlesText = convertSubtitleArrayToVTT(modifiedSubtitles);
    mutateSubtitles.mutate({
      subtitleText: modifiedSubtitlesText,
      subtitleId: position,
    });
    props.setModifiedParsedSubtitles(modifiedSubtitles);
  };

  return (
    <div className="h-full space-y-3 bg-slate-100 border-l border-slate-200 px-6 py-4 overflow-auto">
      {props.parsedSubtitles.map((p, n) => {
        const isActive = currentSubtitleSection?.start === p.start;
        // console.log(currentSubtitleSection?.start);
        return (
          <div key={p.id} className="space-y-1">
            {/* <SuperCard> */}
            <div className="flex justify-between items-center">
              {/* <Text>{p.renderId}</Text> */}

              {/* <div className="flex space-x-2">

                <Input
                  placeholder="Unstyled"
                  defaultValue={`${msToTimestamp(p.start * 1000)}`}
                  onChange={(e) => {
                    const ts = e.target.value.trim();
                    if (isValidTimestamp(ts)) {
                      const modifiedParsedSubtitles = props.parsedSubtitles;
                      modifiedParsedSubtitles[n].start =
                        timestampToMs(ts) / 1000;
                      const modifiedSubtitlesText = convertSubtitleArrayToVTT(
                        modifiedParsedSubtitles
                      );
                      mutateSubtitles.mutate({
                        subtitleText: modifiedSubtitlesText,
                      });
                      props.setModifiedParsedSubtitles(modifiedParsedSubtitles);
                    }
                  }}
                  className="h-6 text-xs w-min"
                />
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
                  className="h-6 text-xs w-min"
                />
              </div> */}

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
            <div className="flex justify-between">
              <T.P className="text-slate-400 text-xs">
                {`(${n + 1}/${props.parsedSubtitles.length})`}
              </T.P>
              <div className="flex items-center">
                <Button
                  size="xs"
                  onClick={() => {
                    splitSubtitles(n);
                  }}
                  variant="primaryLink"
                  className="space-x-1"
                >
                  <Scissors size="12" /> <span>Split into half</span>
                </Button>
                <Button
                  onClick={() => {
                    mergeWithAboveSub(n);
                  }}
                  size="xs"
                  variant="primaryLink"
                  className="space-x-1"
                >
                  <GitMerge size="12"></GitMerge> <span>Merge with above</span>
                </Button>
              </div>
            </div>
            <div
              id={`sec_${n + 1}`}
              className="grid grid-cols-[auto,1fr] gap-4"
            >
              <div>
                <T.Small className="text-slate-500">Speaker</T.Small>
                <T.P>{p.speaker}</T.P>
              </div>
              <Textarea
                className={`text-sm ${isActive ? `bg-black text-white` : 'bg-white text-black'
                  }`}
                ref={textAreaRef}
                onChange={(e) => {
                  debouncedText.callback(e.target.value, n);
                }}
                defaultValue={p.word}
                onClick={() => {
                  console.log(p);
                  console.log(p.start);
                  props.seekTime(p.start);
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
                onSelect={(event) => {
                  // if selection has a range, return
                  // @ts-expect-error
                  const selectionStart = event.target.selectionStart as number;
                  // @ts-expect-error
                  const selectionEnd = event.target.selectionEnd as number;

                  if (selectionStart !== selectionEnd) {
                    setShowToolbar(false);
                    setSelectionIndex(0);
                  } else {
                    const selectedChar = p.word[selectionStart];
                    const previousChar = p.word[selectionStart - 1];
                    const nextChar = p.word[selectionStart + 1];
                    console.log(p);
                    console.log(
                      p.word.length,
                      selectionStart,
                      selectedChar,
                      previousChar,
                      nextChar
                    );
                    // if it's a space or a new line, show the toolbar
                    // if its the start of a new word, show the toolbar
                    // if its the end of a word, show the toolbar
                    // if its the middle of a word, hide the toolbar

                    if (selectedChar === ' ' || selectedChar === '\n') {
                      setShowToolbar(true);
                      setSelectionIndex(selectionStart);
                      if (textAreaRef.current) {
                        setBoundingRect(
                          getTextBoundingRect(
                            textAreaRef.current,
                            selectionStart,
                            selectionEnd,
                            false
                          )
                        );
                      }
                    } else if (selectionStart === 0) {
                      setShowToolbar(false);
                      setSelectionIndex(0);
                      setBoundingRect(null);
                    } else if (selectionStart >= p.word.length - 1) {
                      setShowToolbar(false);
                      setSelectionIndex(0);
                      setBoundingRect(null);
                    } else if (previousChar === ' ' || previousChar === '\n') {
                      // if its the start of a new word, show the toolbar
                      setShowToolbar(true);
                      setSelectionIndex(selectionStart);
                      if (textAreaRef.current) {
                        setBoundingRect(
                          getTextBoundingRect(
                            textAreaRef.current,
                            selectionStart,
                            selectionEnd,
                            false
                          )
                        );
                      }
                    } else if (
                      nextChar === ' ' ||
                      nextChar === '\n' ||
                      nextChar === undefined
                    ) {
                      // if its the end of a word, show the toolbar
                      setShowToolbar(true);
                      setSelectionIndex(selectionStart);
                      if (textAreaRef.current) {
                        setBoundingRect(
                          getTextBoundingRect(
                            textAreaRef.current,
                            selectionStart,
                            selectionEnd,
                            false
                          )
                        );
                      }
                    } else {
                      setShowToolbar(false);
                      setSelectionIndex(0);
                      setBoundingRect(null);
                    }
                  }
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
        );
      })}
    </div>
  );
}

export default Editor;
