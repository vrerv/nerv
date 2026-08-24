import dynamic from 'next/dynamic';

import { Meta } from '@/layouts/Meta';

const HangulGame = dynamic(() => import('@/learn/components/HangulGame'), {
  ssr: false,
});

const HangulGamePage = () => (
  <>
    <Meta
      title="한글 조합 게임"
      description="자음과 모음을 움직여 한글 단어를 완성하는 학습 게임입니다."
      canonical="https://www.vrerv.com/hangul-game/"
    />
    <HangulGame />
  </>
);

export default HangulGamePage;
