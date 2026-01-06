import React from 'react';

interface NavigationActionButtonProps {
  icon: string;
  onClick?: (e?: React.MouseEvent) => void;
  transform?: string;
  style?: React.CSSProperties;
}

export const NavigationActionButton: React.FC<NavigationActionButtonProps> = ({
  icon,
  onClick,
  transform,
  style: customStyle,
}) => {
  return (
    <div
      className="nav-action-button"
      style={{
        width: '12px',
        height: '12px',
        backgroundImage: icon,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        cursor: 'pointer',
        transform,
        transition: 'all 0.2s ease-in-out',
        borderRadius: '4px',
        padding: '4px',
        ...customStyle,
      }}
      onClick={onClick}
    />
  );
};

const style = document.createElement('style');
style.textContent = `
  .nav-action-button:hover {
    transform: scale(1.2);
    background-color: rgba(0, 0, 0, 0.05);
  }
`;
document.head.appendChild(style);

export default NavigationActionButton;
