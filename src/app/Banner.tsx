import React from 'react';
import Link from 'next/link';

const Banner: React.FC = () => {
  return (
    <div className="bg-violet-500 text-white w-full py-4 text-center">
      <p>
        Checkout premium Nextbase starter templates with integrated
        authentication, payments and admin panel{' '}
        <Link
          href="https://usenextbase.com/demos"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          here
        </Link>
      </p>
    </div>
  );
};

export default Banner;
