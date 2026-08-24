import React, { useCallback, useEffect } from 'react';

const TextToSpeech = ({ text, children }) => {
  const speak = useCallback((value) => {
    if (
      typeof window === 'undefined' ||
      !window.speechSynthesis ||
      !window.SpeechSynthesisUtterance
    ) {
      return;
    }

    const utterance = new window.SpeechSynthesisUtterance(value);
    utterance.lang = 'ko-KR';
    window.speechSynthesis.speak(utterance);
  }, []);

  useEffect(() => {
    speak(text);
  }, [speak, text]);

  return children ? children({ onClick: () => speak(text) }) : null;
};

export default TextToSpeech;
