import React from 'react';

const ICON_SIZE = 18;

/**
 * The `nav-action-button` class is load-bearing beyond styling: it is listed in
 * `IGNORE_SELECTORS` in `useClickOutsideToClose`, so dropping or renaming it
 * makes every control click close the viewer. Its rules, including the browser
 * button reset and the focus ring, live in the `<style>` block rendered by
 * `Navigation`.
 */
interface NavigationActionButtonProps {
  icon: React.ComponentType<{
    width?: number | string;
    height?: number | string;
    fill?: string;
    className?: string;
    style?: React.CSSProperties;
  }>;
  /** Accessible name. Required, so every control is named at compile time. */
  label: string;
  onClick?: (e?: React.MouseEvent) => void;
  /** Toggle state. Omitted entirely for plain buttons. */
  pressed?: boolean;
  transform?: string;
  style?: React.CSSProperties;
}

export const NavigationActionButton: React.FC<NavigationActionButtonProps> = ({
  icon: Icon,
  label,
  onClick,
  pressed,
  transform,
  style: customStyle,
}) => {
  return (
    <button
      type="button"
      className="nav-action-button"
      aria-label={label}
      aria-pressed={pressed}
      style={{
        // Intentionally no `backgroundColor` here: an inline background would
        // outrank the `:hover` and `:focus-visible` rules in the stylesheet.
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
      <span aria-hidden="true" style={{ display: 'flex' }}>
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
      </span>
    </button>
  );
};

export default NavigationActionButton;
