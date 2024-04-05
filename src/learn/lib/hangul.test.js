import { letterfy, unletterfyAll, evalLetters } from './hangul';

describe('letterfy function', () => {
  it('should correctly split Hangul letter into initial, vowel and terminal parts', () => {
    const result = letterfy('감');
    expect(result).toEqual([ 'ㄱ', 'ㅏ', 'ㅁ' ]);
  });

  it('should correctly split Hangul letter without terminal part', () => {
    const result = letterfy('가');
    expect(result).toEqual([ 'ㄱ', 'ㅏ' ]);
  });

  it('should return undefined when given a non-Hangul character', () => {
    const result = letterfy('a');
    expect(result).toEqual([undefined, undefined]);
  });
});

describe('unletterfyAll function', () => {
  it('should return string of syllables when given syllable array of letter arrays', () => {
    const input = [['ㄱ', 'ㅏ'], ['ㄴ', 'ㅏ'], ['ㅎ', 'ㅗ', 'ㅇ'], ['ㄴ', 'ㅏ', 'ㄱ']];
    const expectedOutput = '가나홍낙';
    
    expect(unletterfyAll(input)).toEqual(expectedOutput);
  });

  it('should return an empty string when given an empty array', () => {
    const input = [];
    const expectedOutput = '';

    expect(unletterfyAll(input)).toEqual(expectedOutput);
  });

  // Here you can add more tests, if necessary
});

describe('evalLetters function', () => {
  const elementSize = 10;
  it('should evaluate letter and return syllables', () => {
    const i = 2;
    // Define elements for test case
    const elements = [
      {x: 100, y: 100, width: elementSize, height: elementSize, value: 'ㄴ'},
      {x: 16, y: 10, width: elementSize, height: elementSize, value: 'ㅏ'},
      {x: 10, y: 10, width: elementSize, height: elementSize, value: 'ㄱ'},
      {x: 200, y: 200, width: elementSize, height: elementSize, value: 'ㅗ'}
    ];
    const word = evalLetters(i, elements);

    expect(word).toEqual("가");
  });
});