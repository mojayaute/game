import { useState, useEffect } from 'react';
import _ from 'lodash';

interface UseGameDataProps {
  data: Record<string, string>;
}

interface UseGameDataReturn {
  options: Record<string, string>;
  firstOption: string | undefined;
  errorCount: number;
  hasLost: boolean;
  handleClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  resetGame: () => void;
}

export const useGameData = ({ data }: UseGameDataProps): UseGameDataReturn => {
  const [options, setOptions] = useState<Record<string, string>>({});
  const [firstOption, setFirstOption] = useState<string | undefined>(undefined);
  const [errorCount, setErrorCount] = useState<number>(0);
  const [hasLost, setHasLost] = useState<boolean>(false);

  const saveToLocalStorage = (key: string, value: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Error saving to localStorage', e);
    }
  };

  const loadFromLocalStorage = (key: string) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (e) {
      console.error('Error loading from localStorage', e);
      return null;
    }
  };

  const updateOptionsClassname = (keys: string[], classname: string) => {
    setOptions((old) => {
      const updatedOptions = _.mapValues(old, (value, key) =>
        keys.includes(key) ? classname : value
      );
      keys.forEach((key) => saveToLocalStorage(`optionClass_${key}`, classname));
      return updatedOptions;
    });
  };

  const findDesiredOption = () => {
    return data[firstOption!] || _.findKey(data, (value) => value === firstOption);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (hasLost) return;

    const currOption = e.currentTarget.innerText;

    if (currOption === firstOption || e.currentTarget.className === 'right') return;

    updateOptionsClassname(_.keys(options), '');

    if (!firstOption) {
      setFirstOption(currOption);
      updateOptionsClassname([currOption], 'selected');
      return;
    }

    if (currOption === findDesiredOption()) {
      updateOptionsClassname([currOption, firstOption], 'right');
      setTimeout(() => {
        setOptions((old) => {
          const updatedOptions = _.omit(old, [currOption, firstOption]);
          localStorage.removeItem(`optionClass_${currOption}`);
          localStorage.removeItem(`optionClass_${firstOption}`);
          return updatedOptions;
        });
      }, 600);
    } else {
      updateOptionsClassname([currOption, firstOption], 'wrong');
      const newErrorCount = errorCount + 1;
      setErrorCount(newErrorCount);
      saveToLocalStorage('errorCount', newErrorCount);
    }

    setFirstOption(undefined);
  };

  const resetGame = () => {
    setOptions({});
    setFirstOption(undefined);
    setErrorCount(0);
    setHasLost(false);
    saveToLocalStorage('errorCount', 0);

    const allOptions = _.shuffle([..._.values(data), ..._.keys(data)]);
    const tempOptions = _.zipObject(allOptions, _.fill(Array(allOptions.length), ''));
    setOptions(tempOptions);

    _.forOwn(localStorage, (value, key) => {
      if (key.startsWith('optionClass_') || key === 'errorCount') {
        localStorage.removeItem(key);
      }
    });
  };

  useEffect(() => {
    const savedErrorCount = loadFromLocalStorage('errorCount');
    if (savedErrorCount !== null) {
      setErrorCount(savedErrorCount);
    }

    if (errorCount >= 3) {
      setHasLost(true);
    }
  }, [errorCount]);

  useEffect(() => {
    const allOptions = _.shuffle([..._.values(data), ..._.keys(data)]);
    const tempOptions = _.mapValues(_.zipObject(allOptions, _.fill(Array(allOptions.length), '')), (value, key) =>
      loadFromLocalStorage(`optionClass_${key}`) || ''
    );
    setOptions(tempOptions);
  }, [data]);

  return { options, firstOption, errorCount, hasLost, handleClick, resetGame };
};
