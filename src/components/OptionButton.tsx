import React from 'react';

interface OptionButtonProps {
  text: string;
  className: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const OptionButton: React.FC<OptionButtonProps> = ({ text, className, onClick }) => {
  return (
    <button
      type="button"
      className={className}
      onClick={onClick}
      data-text={text}
    >
      {text}
    </button>
  );
};

export default OptionButton;