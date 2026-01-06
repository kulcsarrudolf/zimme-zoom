import React from 'react';

const ICON_SIZE = 18;

interface NavigationActionButtonProps {
  icon: React.ComponentType<{
    width?: number | string;
    height?: number | string;
    fill?: string;
    className?: string;
    style?: React.CSSProperties;
  }>;
  onClick?: (e?: React.MouseEvent) => void;
  transform?: string;
  style?: React.CSSProperties;
}

export const NavigationActionButton: React.FC<NavigationActionButtonProps> = ({
  icon: Icon,
  onClick,
  transform,
  style: customStyle,
}) => {
  return (
    <div
      className="nav-action-button"
      style={{
        minWidth: `${ICON_SIZE}px`,
        minHeight: `${ICON_SIZE}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transform,
        transition: 'all 0.2s ease-in-out',
        borderRadius: '4px',
        padding: '4px',
        ...customStyle,
      }}
      onClick={onClick}
    >
      <Icon
        width={ICON_SIZE}
        height={ICON_SIZE}
        fill="#ffffff"
        className="nav-action-icon"
        style={{
          display: 'block',
          width: `${ICON_SIZE}px`,
          height: `${ICON_SIZE}px`,
          transition: 'transform 0.2s ease-in-out',
        }}
      />
    </div>
  );
};

const style = document.createElement('style');
style.textContent = `
  .nav-action-button:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
  .nav-action-button:hover .nav-action-icon {
    transform: scale(1.2);
  }
`;
document.head.appendChild(style);

export default NavigationActionButton;
