import React from 'react';

interface OverlayIconProps {
  width?: number | string;
  height?: number | string;
  fill?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const OverlayIcon: React.FC<OverlayIconProps> = ({
  width = 1000,
  height = 1000,
  fill = '#ffffff',
  className,
  style,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={height}
      width={width}
      className={className}
      style={style}
      viewBox="0 0 1000 1000"
    >
      <path
        fill={fill}
        d="M100 100h200v200h-200v-200z M400 100h200v200h-200v-200z M700 100h200v200h-200v-200z M100 400h200v200h-200v-200z M400 400h200v200h-200v-200z M700 400h200v200h-200v-200z M100 700h200v200h-200v-200z M400 700h200v200h-200v-200z M700 700h200v200h-200v-200z"
      />
    </svg>
  );
};

export default OverlayIcon;
