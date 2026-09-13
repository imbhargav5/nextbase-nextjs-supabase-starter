'use client';

import { useEffect, useRef } from 'react';

import { SMITH_MUX_HLS } from '@/components/templates/smith/constants';
import { cn } from '@/lib/utils';

interface SmithHlsVideoProps {
  className?: string;
  flipVertical?: boolean;
}

export function SmithHlsVideo({ className, flipVertical }: SmithHlsVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let hls: { destroy: () => void } | null = null;

    async function attach() {
      const el = videoRef.current;
      if (!el) {
        return;
      }

      if (el.canPlayType('application/vnd.apple.mpegurl')) {
        el.src = SMITH_MUX_HLS;
        return;
      }

      const HlsModule = await import('hls.js');
      const Hls = HlsModule.default;
      if (!Hls.isSupported()) {
        return;
      }

      const instance = new Hls();
      instance.loadSource(SMITH_MUX_HLS);
      instance.attachMedia(el);
      hls = instance;
    }

    void attach();

    return () => {
      hls?.destroy();
    };
  }, []);

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      loop
      playsInline
      className={cn(
        'absolute top-1/2 left-1/2 min-h-full min-w-full -translate-x-1/2 -translate-y-1/2 object-cover',
        flipVertical && 'scale-y-[-1]',
        className,
      )}
    />
  );
}
