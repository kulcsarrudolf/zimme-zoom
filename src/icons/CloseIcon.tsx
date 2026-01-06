import React from 'react';

interface CloseIconProps {
  width?: number | string;
  height?: number | string;
  fill?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const CloseIcon: React.FC<CloseIconProps> = ({
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
      xmlnsXlink="http://www.w3.org/1999/xlink"
      className={className}
      style={style}
      viewBox="0 0 1000 1000"
    >
      <path
        fill={fill}
        d="M762.5 200l37.5 37.5-262.5 262.5 262.5 262.5-37.5 37.5-262.5-262.5-262.5 262.5-37.5-37.5 262.5-262.5-262.5-262.5 37.5-37.5 262.5 262.5z"
      />
    </svg>
  );
};

export default CloseIcon;
