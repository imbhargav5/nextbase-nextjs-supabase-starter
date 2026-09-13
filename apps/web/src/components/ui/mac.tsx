import { useId, type SVGProps } from 'react';

export interface MacProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  src?: string;
}

const DEFAULT_WIDTH = 600;
const DEFAULT_HEIGHT = 500;

export function Mac({
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  src,
  ...props
}: MacProps) {
  const rawId = useId();
  const safeId = rawId.replace(/:/g, '');
  const gradientId = `mac-gradient-${safeId}`;
  const clipId = `mac-rounded-corners-${safeId}`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <defs>
        <clipPath id={clipId}>
          <rect
            fill="#ffffff"
            x="29.12"
            y="25.02"
            width="541.76"
            height="305.06"
            rx=".44"
            ry=".44"
          />
        </clipPath>
        <linearGradient
          id={gradientId}
          x1="300"
          y1="484.69"
          x2="300"
          y2="401.32"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#a7a9ac" />
          <stop offset=".1" stopColor="#d1d3d4" />
          <stop offset=".41" stopColor="#e6e7e8" />
          <stop offset=".73" stopColor="#e6e7e8" />
          <stop offset="1" stopColor="#d1d3d4" />
        </linearGradient>
      </defs>
      <rect
        fill={`url(#${gradientId})`}
        x="232.4"
        y="401.32"
        width="135.19"
        height="83.37"
      />
      <rect
        fill="#dedfe2"
        x="234.32"
        y="489.39"
        width="17.21"
        height="1.9"
        rx=".15"
        ry=".15"
      />
      <rect
        fill="#dedfe2"
        x="348.45"
        y="489.39"
        width="17.21"
        height="1.9"
        rx=".15"
        ry=".15"
      />
      <rect fill="#dedfe1" x="232.4" y="484.69" width="135.19" height="5.61" />
      <path
        fill="#eeeeef"
        d="M23.83,10.99h552.03c4.92,0,8.91,3.99,8.91,8.91v324.18H14.92V19.9c0-4.92,3.99-8.91,8.91-8.91Z"
      />
      <path
        fill="#d9d9db"
        d="M23.83,343.94h552.03c4.92,0,8.91,3.99,8.91,8.91v48.47H14.92v-48.47c0-4.92,3.99-8.91,8.91-8.91Z"
        transform="translate(599.69 745.26) rotate(180)"
      />
      <path
        fill="#231f20"
        d="M570.43,330.43H29.57c-.44,0-.79-.36-.79-.79V25.47c0-.44.36-.79.79-.79h540.87c.44,0,.79.36.79.79v304.17c0,.44-.36.79-.79.79ZM29.57,25.37c-.05,0-.1.04-.1.09v304.17c0,.05.04.1.1.1h540.87c.05,0,.09-.04.09-.1V25.47c0-.05-.04-.09-.09-.09H29.57Z"
      />
      <rect
        fill="#fff"
        x="29.12"
        y="25.02"
        width="541.76"
        height="305.06"
        rx=".44"
        ry=".44"
      />
      <circle fill="#414042" cx="300" cy="17.7" r="2.11" />
      <circle fill="#262262" cx="300" cy="17.7" r=".85" />
      <rect
        fill="currentColor"
        x="29.12"
        y="25.02"
        width="541.76"
        height="305.06"
        rx=".44"
        ry=".44"
      />
      {src ? (
        <image
          href={src}
          x="29.12"
          y="25.02"
          width="541.76"
          height="305.06"
          preserveAspectRatio="xMidYMid slice"
          clipPath={`url(#${clipId})`}
        />
      ) : null}
    </svg>
  );
}

/** Screen inset within the default Mac SVG (viewBox 600×500). */
export const MAC_SCREEN_INSET = {
  left: (29.12 / DEFAULT_WIDTH) * 100,
  top: (25.02 / DEFAULT_HEIGHT) * 100,
  width: (541.76 / DEFAULT_WIDTH) * 100,
  height: (305.06 / DEFAULT_HEIGHT) * 100,
} as const;
