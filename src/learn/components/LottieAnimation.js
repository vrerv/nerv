
import Lottie from 'react-lottie';
import animationData from './done-lottie';

export const LottieAnimation = ({ width }) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  return (
    <Lottie options={defaultOptions}
      height={width}
      width={width}
    />
  );
}