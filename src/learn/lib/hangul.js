
const START_CHAR_CODE_KOR_GA = 44032;
const KOR_INITIAL_LETTERS = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ',
  'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ',
  'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
const KOR_VOWELS = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ',
  'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ',
  'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'];
const KOR_VOWELS_CHANGE = 28;
const KOR_TERMINALS = ['', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ',
  'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ',
  'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ',
  'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
export const letterfy = (kor) => {

  let charCode = kor.charCodeAt(0);

  charCode = charCode - START_CHAR_CODE_KOR_GA;

  let initialIndex = parseInt(charCode / 588);
  let vowelIndex = parseInt((charCode - (initialIndex * 588)) / KOR_VOWELS_CHANGE);
  let terminalIndex = parseInt(charCode % KOR_TERMINALS.length);

  return KOR_TERMINALS[terminalIndex]
    ? [KOR_INITIAL_LETTERS[initialIndex], KOR_VOWELS[vowelIndex], KOR_TERMINALS[terminalIndex]]
    : [KOR_INITIAL_LETTERS[initialIndex], KOR_VOWELS[vowelIndex]];
}

export const unletterfy = (chars) => {
  let initialIndex = KOR_INITIAL_LETTERS.indexOf(chars[0]);
  let vowelIndex = KOR_VOWELS.indexOf(chars[1]);
  let terminalIndex = chars[2] ? KOR_TERMINALS.indexOf(chars[2]) : 0;

  return String.fromCharCode(
    START_CHAR_CODE_KOR_GA
    + 588 * initialIndex
    + KOR_VOWELS_CHANGE * vowelIndex
    + terminalIndex);
}

/**
 *
 * @param letters syllable array of letter arrays, e.g.) [['ㄱ', 'ㅏ'], ['ㄴ', 'ㅏ']]
 * @return string of syllables, e.g.) '가나'
 */
export const unletterfyAll = (letters) => {
  return letters.map((letter) => {
    return unletterfy(letter);
  }).join('');
}

export const letterfyAll = (kor) => {
  return kor.split('').flatMap(letterfy);
}

// 수직 모음
const KOR_VERTICAL_VOWELS = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ',
  'ㅖ', 'ㅣ'];
// 수평 모음
const KOR_HORIZONTAL_VOWELS = ['ㅗ', 'ㅜ', 'ㅛ', 'ㅠ', 'ㅡ'];
// 대각 모음
const KOR_BOTH_VOLES = ['ㅘ', 'ㅙ', 'ㅚ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅢ']

export function evalLetters(i, paramElements, word) {
  const syllables = []; // 연결된 음절들을 저장할 리스트
  // x, y 좌표(글자 읽는 방향)를 기준으로 정렬된 elements
  const elements = paramElements.sort((a, b) => a.x + a.y - b.x - b.y);

  // 문자 위치 및 크기를 기준으로 두 문자가 연결 가능한지 판단하는 함수
  function canConnect(element1, element2) {
    const xDiff = element2.x - element1.x;
    const yDiff = element2.y - element1.y;
    const minimum = element1.width * 0.7;
    const diff = Math.sqrt(xDiff ** 2 + yDiff ** 2);
    //console.log("xDiff", xDiff, "yDiff", yDiff, "element1", {x: element1.x, y: element1.y}, "element2", {x: element2.x, y: element2.y})
    const isElement1BelowElement2 = yDiff < -minimum * 0.3 && yDiff > -minimum && diff < minimum;
    const isElement1LeftOfElement2 =  xDiff > minimum * 0.5 && xDiff < minimum && diff < minimum
      && Math.abs(yDiff) < minimum / 3 && !isElement1BelowElement2;
    const isElement1AboveElement2 = yDiff > minimum * 0.3 && yDiff < minimum && diff < minimum
      && Math.abs(xDiff) < minimum / 3;

    return {
      isLeft: isElement1LeftOfElement2,
      isAbove: isElement1AboveElement2,
      isBelow: isElement1BelowElement2
    };
  }

  // 초성, 중성, 종성을 찾아서 음절을 형성하는 함수
  function findSyllable(baseIndex) {
    const baseElement = elements[baseIndex];
    const syllableParts = {initial: null, medial: null, final: null};

    elements.forEach((e, index) => {
      if (!KOR_VOWELS.includes(e.value)) {
        const connection = canConnect(e, baseElement);
        if (KOR_HORIZONTAL_VOWELS.includes(baseElement.value) && (connection.isAbove && !connection.isLeft)) {
          syllableParts.initial = e.value;
          syllableParts.medial = baseElement.value;
        }
        else if (KOR_VERTICAL_VOWELS.includes(baseElement.value) && (connection.isLeft && !connection.isAbove)) {
          syllableParts.initial = e.value;
          syllableParts.medial = baseElement.value;
        }
        else if (KOR_BOTH_VOLES.includes(baseElement.value) && (connection.isLeft || connection.isAbove)) {
          syllableParts.initial = e.value;
          syllableParts.medial = baseElement.value;
        }

        else if (KOR_TERMINALS.includes(e.value) && connection.isBelow) {
          syllableParts.final = e.value;
        }
      }
    });

    // 연결된 음절이 유효한 경우만 결과에 추가
    if (syllableParts.initial !== null && syllableParts.medial !== null) {
      const syllable = [syllableParts.initial, syllableParts.medial];
      if (syllableParts.final !== null) syllable.push(syllableParts.final);
      syllables.push(syllable);
    }
  }

  elements.forEach((e, index) => {
    if (e => KOR_VOWELS.includes(e.value)) {
      findSyllable(index)
    }
  });

  return unletterfyAll(syllables);
}

