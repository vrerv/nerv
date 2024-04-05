import React, { useEffect, useState } from "react";
import WordBuilder from '@/learn/components/WordBuilder'; // 이 컴포넌트는 아래에서 구현됩니다.
import TextToSpeech from "../../../learn/components/TtsContainer";
import { evalLetters, letterfyAll } from "../../../learn/lib/hangul";

/**
 * element should not be overlayed with other elements
 * @param container = {width, height}
 * @param element = {width, height}
 * @param elements = [{x, y, width, height}]
 * @returns { x, y}
 */
function randomPositionWithoutOverlay(container, element, elements) {
  const [x, y] = [Math.random() * (container.width - element.width), Math.random() * (container.height - element.height)]
  const [width, height] = [element.width, element.height]
  const [x2, y2] = [x + width, y + height]

  for (let i = 0; i < elements.length; i++) {
    const e = elements[i]
    const [ex, ey] = [e.x, e.y]
    const [ex2, ey2] = [ex + e.width, ey + e.height]

    if (x < ex2 && x2 > ex && y < ey2 && y2 > ey) {
      return randomPositionWithoutOverlay(container, element, elements)
    }
  }

  return { x, y }
}

const words = [
  "고기", "나비", "다리", "라마", "머리", "비누", "사자", "아기", "자두", "차", "코끼리", "쿠키", "타조",
  "하마", "꼬리", "머리띠", "뿌리", "씨소", "찌게", "개나리", "게다리", "야호", "여자", "요리", "우유", "크다"
]

const elementsFromChars = (container, chars) => {
  const elementSize = { width: 100, height: 100 }
  const elements = []
  for (let i = 0; i < chars.length; i++) {
    const char = chars[i]
    const { x, y } = randomPositionWithoutOverlay(container, elementSize, elements)
    elements.push({
      type: 'TEXT',
      x: x,
      y: y,
      width: elementSize.width,
      height: elementSize.height,
      color: '#000000',
      value: char,
      fontSize: 96,
      fontFamily: 'Nanum Gothic'
    })
  }
  return elements
}

function App() {

  const [chars, setChars] = useState([])
  const [index, setIndex] = useState(0)
  const [text, setText] = useState(`"${words[index]}" 글자를 만드세요`)
  const [loading, setLoading] = useState(false)
  const [layout, setLayout] = useState({
    width: window.innerWidth,
    height: window.innerHeight - 240,
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
    elements[e.index].x = e.x
    elements[e.index].y = e.y
    setLayout({...layout, elements})
    console.log("e", e, "elements", elements)
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
    setChars((pre) => {

      const newChars = letterfyAll(words[index])
      setLayout({...layout, elements: elementsFromChars(layout, newChars)})
      setText(`"${words[index]}" 글자를 만드세요`)
      setLoading(false)
      return newChars
    })
  }, [index]);

  return (
    <>
      <TextToSpeech text={currentWord} />
      <TextToSpeech text={text}>
        {({onClick}) => <button style={{padding: 20, fontSize: 32}} onClick={onClick}>{text}</button>}
      </TextToSpeech>
      <div style={{background: '#ffffff'}}>
        <WordBuilder layout={layout} setLayout={setLayout} onChange={handleOnChange} />
      </div>
      <button style={{padding: 20, fontSize: 32}} onClick={handleNext} disabled={loading}>다음 글자</button>
    </>
  );
}

export default App;
