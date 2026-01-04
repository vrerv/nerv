import React, { useEffect, useState } from "react";
import WordBuilder from '@/learn/components/WordBuilder'; // 이 컴포넌트는 아래에서 구현됩니다.
import TextToSpeech from "../../../learn/components/TtsContainer";
import { evalLetters, letterfyAll } from "../../../learn/lib/hangul";
import dynamic from 'next/dynamic';

const LottieAnimation = dynamic(
  () => import('@/learn/components/LottieAnimation').then((mod) => mod.LottieAnimation),
  { ssr: false }
);

/**
 * element should not be overlayed with other elements
 * @param container = {width, height}
 * @param element = {width, height}
 * @param elements = [{x, y, width, height}]
 * @returns { x, y}
 */
function randomPositionWithoutOverlay(container, element, elements) {
  const gridSize = Math.max(element.width, element.height); // Assuming square grid cells for simplicity
  const rows = Math.floor(container.height / gridSize);
  const cols = Math.floor(container.width / gridSize);
  const occupancyMap = Array.from({ length: rows }, () => Array(cols).fill(false));

  // Mark existing elements as occupied in the occupancy map
  elements.forEach(el => {
    const elCols = Math.ceil(el.width / gridSize);
    const elRows = Math.ceil(el.height / gridSize);
    const row = Math.floor(el.y / gridSize);
    const col = Math.floor(el.x / gridSize);
    if (row < rows && col < cols) {
      occupancyMap[row][col] = true;
      for (let r = row; r < row + elRows; r++) {
        for (let c = col; c < col + elCols; c++) {
          occupancyMap[r][c] = true;
        }
      }
    }
  });

  // Try to find an unoccupied spot
  for (let attempt = 0; attempt < 200; attempt++) {
    const row = Math.floor(Math.random() * rows);
    const col = Math.floor(Math.random() * cols);
    if (!occupancyMap[row][col]) {
      return { x: col * gridSize, y: row * gridSize }; // Found an open spot
    }
  }

  // Fallback if no spot is found after attempts
  return { x: 0, y: 0 };
}

const words = [
  "고기", "나비", "다리", "라마", "머리", "비누", "사자", "아기", "자두", "차", "코끼리", "쿠키", "타조",
  "하마", "꼬리", "머리띠", "뿌리", "씨소", "찌게", "개나리", "게다리", "야호", "여자", "요리", "우유", "크다"
]

const fontFamily = 'Nanum Gothic'
const textSize = 96

const elementsFromChars = (container, word) => {
  const chars = letterfyAll(word)
  const elementSize = { width: 100, height: 100 }
  const elements = []
  // show guide text
  elements.push({
    id: 'BG',
    type: 'TEXT',
    x: parseInt((container.width - (elementSize.width * word.length)) / 2),
    y: 10,
    width: (elementSize.width + 8) * word.length,
    height: elementSize.height,
    color: '#eeee00',
    value: word,
    fontSize: textSize,
    fontFamily: fontFamily,
    letterSpacing: 8,
    draggable: false,
  })
  for (let i = 0; i < chars.length; i++) {
    const char = chars[i]
    const { x, y } = randomPositionWithoutOverlay(container, elementSize, elements)
    elements.push({
      id: `CHAR_${i}`,
      type: 'TEXT',
      x: x,
      y: y,
      width: elementSize.width,
      height: elementSize.height,
      color: '#000000',
      value: char,
      fontSize: textSize,
      fontFamily: fontFamily,
      draggable: true,
    })
  }
  return elements
}

function App() {

  const [index, setIndex] = useState(0)
  const [text, setText] = useState(`"${words[index]}" 글자를 만드세요`)
  const [loading, setLoading] = useState(false)
  const [layout, setLayout] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight - 240 : 768,
    elements: []
  })
  const [currentWord, setCurrentWord] = useState("")

  const handleNext = () => {
    if (index === words.length - 1) {
      setIndex(0)
    } else {
      setIndex(index + 1)
    }
  }

  const handleOnChange = (e) => {
    const elements = [...layout.elements]
    console.log("e1", e, "elements", layout.elements)
    elements.forEach(element => {
      if (element.id === e.id) {
        console.log("id", e.id)
        element.x = e.x
        element.y = e.y
      }
    })
    // TODO: setLayout 시 다른 엘리먼트가 같이 움직이는 버그가 있다.
    //setLayout({...layout, elements})
    console.log("e2", e, "elements", elements)
    const word = evalLetters(e.index, elements, currentWord)
    console.log("word", word)
    setCurrentWord(word)
    if (word === words[index]) {
      setText('맞았어요!')
      setLoading(true)
      setTimeout(() => handleNext(), 2000)
    }
  }

  useEffect(() => {

    speechSynthesis.cancel()
    setLayout({ ...layout, elements: elementsFromChars(layout, words[index]) })
    setText(`"${words[index]}" 글자를 만드세요`)
    setLoading(false)
  }, [index]);

  return (
    <>
      <TextToSpeech text={currentWord} />
      <TextToSpeech text={text}>
        {({ onClick }) => <button style={{ padding: 20, fontSize: 32 }} onClick={onClick}>{text}</button>}
      </TextToSpeech>
      <div style={{ background: '#ffffff' }}>
        {loading && <LottieAnimation width={layout.width} />}
        <WordBuilder layout={layout} setLayout={setLayout} onChange={handleOnChange} />
      </div>
      <button style={{ padding: 20, fontSize: 32 }} onClick={handleNext} disabled={loading}>다음 글자</button>
    </>
  );
}

export default App;
