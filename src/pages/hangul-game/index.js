import dynamic from 'next/dynamic';

const HangulGame = dynamic(() => import('@/learn/components/HangulGame'), {
  ssr: false,
});

export default HangulGame;
