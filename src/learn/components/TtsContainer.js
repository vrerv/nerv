import React, { useEffect } from "react";

const TextToSpeech = ({text, children}) => {
  const utterance = new SpeechSynthesisUtterance(text);

  useEffect(() => {
    speak(text);
  }, [text]);

  const speak = (text) => {
    speechSynthesis.speak(utterance);
  };

  return (
    children({onClick: (e) => speak(text)})
  );
};

export default TextToSpeech;
