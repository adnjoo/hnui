import React, { Suspense } from 'react';
import { LandingBody } from './LandingBody';

export default async function Home({ params }: { params: { slug: string } }) {
  const { slug } = params;

  return (
    <main className='flex flex-col'>
      <div className='flex min-h-[80vh] flex-col justify-between p-4 sm:p-8'>
        <a href='/1'>
          <img
            src='/y18.svg'
            alt='y18'
            className='w-4 h-4 border border-white border-[0.5px]'
          />
        </a>
        <Suspense
          fallback={<div className='text-gray-500 mt-12'>Loading...</div>}
        >
          <LandingBody slug={slug} />
        </Suspense>
      </div>
    </main>
  );
}
