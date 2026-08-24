import { render } from '@testing-library/react';

import TextToSpeech from './TtsContainer';

describe('TextToSpeech', () => {
  const cancel = jest.fn();
  const speak = jest.fn();

  beforeEach(() => {
    cancel.mockClear();
    speak.mockClear();
    Object.defineProperty(window, 'speechSynthesis', {
      configurable: true,
      value: { cancel, speak },
    });
    Object.defineProperty(window, 'SpeechSynthesisUtterance', {
      configurable: true,
      value: function SpeechSynthesisUtterance(text) {
        this.text = text;
      },
    });
  });

  it('does not enqueue empty speech', () => {
    render(<TextToSpeech text="" />);

    expect(cancel).not.toHaveBeenCalled();
    expect(speak).not.toHaveBeenCalled();
  });

  it('replaces queued speech before speaking the latest text', () => {
    render(<TextToSpeech text="다음 글자" />);

    expect(cancel).toHaveBeenCalledTimes(1);
    expect(speak).toHaveBeenCalledWith(
      expect.objectContaining({ text: '다음 글자', lang: 'ko-KR' })
    );
  });
});
