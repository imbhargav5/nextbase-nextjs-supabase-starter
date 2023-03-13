import {
  useRef,
  useState,
  useEffect,
  MutableRefObject,
  useCallback,
  useMemo,
} from 'react';

interface State {
  duration: number;
  currentTime: number;
  paused: boolean;
  ended: boolean;
  playbackRate: number;
  muted: boolean;
  volume: number;
  fullscreen: boolean;
}

interface Controls {
  play: () => void;
  pause: () => void;
  fastForward: () => void;
  rewind: () => void;
  toggleMute: () => void;
  setVolume: (value: number) => void;
  toggleFullscreen: () => void;
  seek: (time: number) => void;
}

type UseVideoReturnType = [
  MutableRefObject<HTMLVideoElement | null>,
  State,
  Controls
];

export const useVideo = (): UseVideoReturnType => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [state, setState] = useState<State>({
    duration: 0,
    currentTime: 0,
    paused: true,
    ended: false,
    playbackRate: 1,
    muted: false,
    volume: 1,
    fullscreen: false,
  });

  // rewrite controls object . make each of the functions in it into a usecallback hook
  // so that the functions are not recreated on every render

  const play = useCallback(() => videoRef.current?.play(), []);
  const pause = useCallback(() => videoRef.current?.pause(), []);
  const fastForward = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.currentTime += 10;
    }
  }, []);

  const rewind = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.currentTime -= 10;
    }
  }, []);

  const toggleMute = useCallback(
    () => setState((prevState) => ({ ...prevState, muted: !prevState.muted })),
    []
  );

  const setVolume = useCallback(
    (value: number) =>
      setState((prevState) => ({ ...prevState, volume: value })),
    []
  );

  const toggleFullscreen = useCallback(
    () =>
      setState((prevState) => ({
        ...prevState,
        fullscreen: !prevState.fullscreen,
      })),

    []
  );

  const seek = useCallback((time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  }, []);

  const controls = useMemo(
    () => ({
      play,
      pause,
      fastForward,
      rewind,
      toggleMute,
      setVolume,
      toggleFullscreen,
      seek,
    }),
    [
      play,
      pause,
      fastForward,
      rewind,
      toggleMute,
      setVolume,
      toggleFullscreen,
      seek,
    ]
  );

  useEffect(() => {
    const video = videoRef.current;

    const onDurationChange = () =>
      setState((prevState) => ({
        ...prevState,
        duration: video?.duration ?? prevState.duration,
      }));
    const onTimeUpdate = () => {
      console.log('time update', video?.currentTime);
      setState((prevState) => ({
        ...prevState,
        currentTime: video?.currentTime ?? prevState.currentTime,
      }));
    };
    const onPlay = () =>
      setState((prevState) => ({ ...prevState, paused: false }));
    const onPause = () =>
      setState((prevState) => ({ ...prevState, paused: true }));
    const onEnded = () =>
      setState((prevState) => ({ ...prevState, ended: true }));

    video?.addEventListener('durationchange', onDurationChange);
    video?.addEventListener('timeupdate', onTimeUpdate);
    video?.addEventListener('play', onPlay);
    video?.addEventListener('pause', onPause);
    video?.addEventListener('ended', onEnded);

    return () => {
      video?.removeEventListener('durationchange', onDurationChange);
      video?.removeEventListener('timeupdate', onTimeUpdate);
      video?.removeEventListener('play', onPlay);
      video?.removeEventListener('pause', onPause);
      video?.removeEventListener('ended', onEnded);
    };
  }, []);

  return [videoRef, state, controls];
};
