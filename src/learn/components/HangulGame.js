import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';

import { evalLetters, letterfyAll } from '@/learn/lib/hangul';

import TextToSpeech from './TtsContainer';
import WordBuilder from './WordBuilder';

const LottieAnimation = dynamic(
  () => import('./LottieAnimation').then((mod) => mod.LottieAnimation),
  { ssr: false }
);

export const DEFAULT_WORDS = [
  '고기',
  '나비',
  '다리',
  '라마',
  '머리',
  '비누',
  '사자',
  '아기',
  '자두',
  '차',
  '코끼리',
  '쿠키',
  '타조',
  '하마',
  '꼬리',
  '머리띠',
  '뿌리',
  '씨소',
  '찌게',
  '개나리',
  '게다리',
  '야호',
  '여자',
  '요리',
  '우유',
  '크다',
];

const FONT_FAMILY = 'Nanum Gothic';
const TEXT_SIZE = 64;

function randomPositionWithoutOverlay(container, element, elements) {
  const gridSize = Math.max(element.width, element.height);
  const rows = Math.floor(container.height / gridSize);
  const cols = Math.floor(container.width / gridSize);
  const occupancyMap = Array.from({ length: rows }, () =>
    Array(cols).fill(false)
  );

  elements.forEach((existingElement) => {
    const elementCols = Math.ceil(existingElement.width / gridSize);
    const elementRows = Math.ceil(existingElement.height / gridSize);
    const row = Math.floor(existingElement.y / gridSize);
    const col = Math.floor(existingElement.x / gridSize);

    if (row < rows && col < cols) {
      for (let currentRow = row; currentRow < row + elementRows; currentRow += 1) {
        for (let currentCol = col; currentCol < col + elementCols; currentCol += 1) {
          if (occupancyMap[currentRow]) {
            occupancyMap[currentRow][currentCol] = true;
          }
        }
      }
    }
  });

  for (let attempt = 0; attempt < 200; attempt += 1) {
    const row = Math.floor(Math.random() * rows);
    const col = Math.floor(Math.random() * cols);

    if (!occupancyMap[row]?.[col]) {
      return { x: col * gridSize, y: row * gridSize };
    }
  }

  return { x: 0, y: 0 };
}

const elementsFromChars = (container, word) => {
  const chars = letterfyAll(word);
  const elementSize = { width: TEXT_SIZE + 4, height: TEXT_SIZE + 4 };
  const elements = [
    {
      id: 'BG',
      type: 'TEXT',
      x: parseInt((container.width - elementSize.width * word.length) / 2, 10),
      y: 10,
      width: (elementSize.width + 8) * word.length,
      height: elementSize.height,
      color: '#eeee00',
      value: word,
      fontSize: TEXT_SIZE,
      fontFamily: FONT_FAMILY,
      letterSpacing: 8,
      draggable: false,
    },
  ];

  chars.forEach((char, index) => {
    const { x, y } = randomPositionWithoutOverlay(container, elementSize, elements);
    elements.push({
      id: `CHAR_${index}`,
      type: 'TEXT',
      x,
      y,
      width: elementSize.width,
      height: elementSize.height,
      color: '#000000',
      value: char,
      fontSize: TEXT_SIZE,
      fontFamily: FONT_FAMILY,
      draggable: true,
    });
  });

  return elements;
};

const HangulGame = ({ words = DEFAULT_WORDS }) => {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState(`"${words[index]}" 글자를 만드세요`);
  const [loading, setLoading] = useState(false);
  const [layout, setLayout] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight - 240 : 768,
    elements: [],
  });
  const [currentWord, setCurrentWord] = useState('');

  const handleNext = () => {
    setIndex((currentIndex) =>
      currentIndex === words.length - 1 ? 0 : currentIndex + 1
    );
  };

  const handleOnChange = (changedElement) => {
    const elements = layout.elements.map((element) =>
      element.id === changedElement.id
        ? { ...element, x: changedElement.x, y: changedElement.y }
        : element
    );
    const word = evalLetters(changedElement.index, elements, currentWord);

    setLayout((currentLayout) => ({ ...currentLayout, elements }));
    setCurrentWord(word);

    if (word === words[index]) {
      setText('맞았어요!');
      setLoading(true);
      setTimeout(handleNext, 2000);
    }
  };

  useEffect(() => {
    if (index >= words.length) {
      setIndex(0);
      return;
    }

    if (typeof window !== 'undefined') {
      window.speechSynthesis?.cancel();
    }

    if (words[index]) {
      setLayout((currentLayout) => ({
        ...currentLayout,
        elements: elementsFromChars(currentLayout, words[index]),
      }));
      setText(`"${words[index]}" 글자를 만드세요`);
    }

    setCurrentWord('');
    setLoading(false);
  }, [index, words]);

  return (
    <>
      <TextToSpeech text={currentWord} />
      <TextToSpeech text={text}>
        {({ onClick }) => (
          <button style={{ padding: 20, fontSize: 24 }} type="button" onClick={onClick}>
            {text}
          </button>
        )}
      </TextToSpeech>
      <div style={{ background: '#ffffff' }}>
        {loading && <LottieAnimation width={layout.width} />}
        <WordBuilder layout={layout} setLayout={setLayout} onChange={handleOnChange} />
      </div>
      <button
        style={{ padding: 20, fontSize: 24 }}
        type="button"
        onClick={handleNext}
        disabled={loading}
      >
        다음 글자
      </button>
    </>
  );
};

export default HangulGame;
