import React, { useEffect } from "react";

const TextToSpeech = ({text, children}) => {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ko-KR";

  useEffect(() => {
    speak(text);
  }, [text]);

  const speak = (text) => {
    speechSynthesis.speak(utterance);
  };

  return (
    children && children({onClick: (e) => speak(text)})
  );
};

export default TextToSpeech;
