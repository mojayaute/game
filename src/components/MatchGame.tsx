import React from 'react';
import { useGameData } from '../hooks/useGameData';
import OptionButton from './OptionButton';
import VictoryMessage from './VictoryMessage';

interface MatchGameProps {
  data: Record<string, string>;
}

const MatchGame: React.FC<MatchGameProps> = ({ data }) => {
  const { options, errorCount, hasLost, handleClick, resetGame } = useGameData({ data });

  const optionsArray = Object.keys(options);

  return (
    <>
        <div className="CountryCapitalGame">
            {optionsArray.map((option, index) => (
            <OptionButton
                key={index}
                text={option}
                className={options[option]}
                onClick={handleClick}
            />
            ))}
        </div>
        <div className="status-container">
            {optionsArray.length === 0 && <VictoryMessage />}
            <p className="error-count">Errors: {errorCount}</p>
            {hasLost && (
            <div className="lost-message">
                <h2>You lost! Try again!</h2>
                <button onClick={resetGame}>Reset Game</button>
            </div>
            )}
        </div>
      </>
  );
};

export default MatchGame;
