import React, { useEffect, useState } from 'react';

import HangulGame, { DEFAULT_WORDS } from '@/learn/components/HangulGame';
import { getServiceByName } from '@/lib/api/services';

const LearnService = () => {
  const [words, setWords] = useState(DEFAULT_WORDS);

  useEffect(() => {
    getServiceByName('Learn Hangul').then(({ data }) => {
      setWords(data?.configuration?.words || DEFAULT_WORDS);
    });
  }, []);

  return <HangulGame words={words} />;
};

export default LearnService;
