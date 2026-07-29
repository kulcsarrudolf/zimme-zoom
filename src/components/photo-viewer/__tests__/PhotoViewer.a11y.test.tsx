import '@testing-library/jest-dom';
import React, { useState } from 'react';
import { renderToString } from 'react-dom/server';
import { act, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PhotoViewer } from '../PhotoViewer';
import type { ZZImage } from '../../../types/image.type';

const images: ZZImage[] = [
  { id: '1', src: 'https://example.com/1.jpg', alt: 'First image' },
  { id: '2', src: 'https://example.com/2.jpg', alt: 'Second image' },
];

const overlayImage: ZZImage = {
  id: '3',
  src: 'https://example.com/3.jpg',
  alt: 'Third image',
  svgOverlay: '<circle cx="5" cy="5" r="4" />',
};

/** Every control rendered with the default settings and more than one image. */
const DEFAULT_CONTROL_NAMES = [
  'Previous image',
  'Next image',
  'Zoom out',
  'Zoom in',
  'Rotate left',
  'Rotate right',
  'Close',
];

afterEach(() => {
  // The scroll lock keeps module-level state; reset so failures do not cascade.
  document.body.style.overflow = '';
  document.body.style.paddingRight = '';
});

describe('PhotoViewer accessibility', () => {
  describe('control semantics', () => {
    it('renders every control as a native button with an accessible name', () => {
      render(<PhotoViewer selectedImage={images[0]} images={images} onClose={jest.fn()} />);

      for (const name of DEFAULT_CONTROL_NAMES) {
        const button = screen.getByRole('button', { name });
        expect(button.tagName).toBe('BUTTON');
        expect(button).toHaveAttribute('type', 'button');
      }
    });

    it('keeps the nav-action-button class, which useClickOutsideToClose depends on', () => {
      render(<PhotoViewer selectedImage={images[0]} images={images} onClose={jest.fn()} />);

      for (const name of DEFAULT_CONTROL_NAMES) {
        expect(screen.getByRole('button', { name })).toHaveClass('nav-action-button');
      }
    });

    it('hides the icons from assistive technology', () => {
      render(<PhotoViewer selectedImage={images[0]} images={images} onClose={jest.fn()} />);

      const button = screen.getByRole('button', { name: 'Close' });
      expect(button.querySelector('[aria-hidden="true"]')).not.toBeNull();
      expect(within(button).queryByRole('img')).toBeNull();
    });

    it('exposes aria-pressed on the overlay toggle only', async () => {
      const user = userEvent.setup();
      render(
        <PhotoViewer
          selectedImage={overlayImage}
          images={[overlayImage]}
          onClose={jest.fn()}
          settings={{ showOverlayButton: true }}
        />,
      );

      const toggle = screen.getByRole('button', { name: 'Toggle overlay' });
      expect(toggle).toHaveAttribute('aria-pressed', 'false');
      expect(screen.getByRole('button', { name: 'Close' })).not.toHaveAttribute('aria-pressed');

      await user.click(toggle);
      expect(screen.getByRole('button', { name: 'Toggle overlay' })).toHaveAttribute(
        'aria-pressed',
        'true',
      );
    });

    it('brightens the control bar while focus is inside it', () => {
      render(<PhotoViewer selectedImage={images[0]} images={images} onClose={jest.fn()} />);
      const nav = document.body.querySelector('.photo-viewer-navigation') as HTMLElement;

      expect(nav).toHaveStyle({ backgroundColor: 'rgba(0, 0, 0, 0.5)' });

      act(() => screen.getByRole('button', { name: 'Close' }).focus());
      expect(nav).toHaveStyle({ backgroundColor: 'rgba(0, 0, 0, 0.8)' });
    });
  });

  describe('labels', () => {
    it('applies overrides and keeps defaults for unspecified keys', () => {
      render(
        <PhotoViewer
          selectedImage={images[0]}
          images={images}
          onClose={jest.fn()}
          labels={{ close: 'Bezár' }}
        />,
      );

      expect(screen.getByRole('button', { name: 'Bezár' })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Zoom in' })).toBeInTheDocument();
    });

    it('names the dialog from the image title, then the dialog label', () => {
      const { rerender } = render(
        <PhotoViewer selectedImage={images[0]} images={images} onClose={jest.fn()} />,
      );
      expect(screen.getByRole('dialog')).toHaveAccessibleName('Photo viewer');

      rerender(
        <PhotoViewer
          selectedImage={images[0]}
          images={images}
          onClose={jest.fn()}
          labels={{ dialog: 'Képnéző' }}
        />,
      );
      expect(screen.getByRole('dialog')).toHaveAccessibleName('Képnéző');

      rerender(
        <PhotoViewer
          selectedImage={{ ...images[0], title: 'Sunset' }}
          images={images}
          onClose={jest.fn()}
          labels={{ dialog: 'Képnéző' }}
        />,
      );
      expect(screen.getByRole('dialog')).toHaveAccessibleName('Sunset');
    });
  });

  describe('keyboard operability', () => {
    it('activates a control with Enter', async () => {
      const user = userEvent.setup();
      render(<PhotoViewer selectedImage={images[0]} images={images} onClose={jest.fn()} />);

      act(() => screen.getByRole('button', { name: 'Zoom in' }).focus());
      await user.keyboard('{Enter}');

      // Reset only renders once the transform differs from its default.
      expect(
        await screen.findByRole('button', { name: 'Reset zoom and rotation' }),
      ).toBeInTheDocument();
    });

    it('activates a control with Space', async () => {
      const user = userEvent.setup();
      render(<PhotoViewer selectedImage={images[0]} images={images} onClose={jest.fn()} />);

      act(() => screen.getByRole('button', { name: 'Zoom in' }).focus());
      await user.keyboard(' ');

      expect(
        await screen.findByRole('button', { name: 'Reset zoom and rotation' }),
      ).toBeInTheDocument();
    });

    it('does not close the viewer when a control is clicked', async () => {
      const user = userEvent.setup();
      const onClose = jest.fn();
      render(<PhotoViewer selectedImage={images[0]} images={images} onClose={onClose} />);

      await user.click(screen.getByRole('button', { name: 'Zoom in' }));

      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe('focus trap', () => {
    it('moves focus to the dialog on open', () => {
      render(<PhotoViewer selectedImage={images[0]} images={images} onClose={jest.fn()} />);

      expect(screen.getByRole('dialog')).toHaveFocus();
    });

    it('tabs from the dialog to the first control', async () => {
      const user = userEvent.setup();
      render(<PhotoViewer selectedImage={images[0]} images={images} onClose={jest.fn()} />);

      await user.tab();

      expect(screen.getByRole('button', { name: 'Previous image' })).toHaveFocus();
    });

    it('wraps forward from the last control to the first', async () => {
      const user = userEvent.setup();
      render(<PhotoViewer selectedImage={images[0]} images={images} onClose={jest.fn()} />);

      act(() => screen.getByRole('button', { name: 'Close' }).focus());
      await user.tab();

      expect(screen.getByRole('button', { name: 'Previous image' })).toHaveFocus();
    });

    it('wraps backward from the first control to the last', async () => {
      const user = userEvent.setup();
      render(<PhotoViewer selectedImage={images[0]} images={images} onClose={jest.fn()} />);

      act(() => screen.getByRole('button', { name: 'Previous image' }).focus());
      await user.tab({ shift: true });

      expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus();
    });

    it('never lets focus reach content behind the dialog', async () => {
      const user = userEvent.setup();
      render(
        <>
          <button data-testid="outside">outside</button>
          <PhotoViewer selectedImage={images[0]} images={images} onClose={jest.fn()} />
        </>,
      );

      const outside = screen.getByTestId('outside');
      const dialog = screen.getByRole('dialog');

      for (let i = 0; i < DEFAULT_CONTROL_NAMES.length + 2; i += 1) {
        await user.tab();
        expect(outside).not.toHaveFocus();
        expect(dialog.contains(document.activeElement)).toBe(true);
      }
    });

    it('pulls focus back when something outside steals it', () => {
      render(
        <>
          <button data-testid="outside">outside</button>
          <PhotoViewer selectedImage={images[0]} images={images} onClose={jest.fn()} />
        </>,
      );

      screen.getByTestId('outside').focus();

      expect(screen.getByRole('dialog')).toHaveFocus();
    });

    it('recovers when the focused control unmounts itself', async () => {
      const user = userEvent.setup();
      render(<PhotoViewer selectedImage={images[0]} images={images} onClose={jest.fn()} />);

      await user.click(screen.getByRole('button', { name: 'Zoom in' }));
      const reset = await screen.findByRole('button', { name: 'Reset zoom and rotation' });

      // Resetting removes this very button from the DOM. Browsers and jsdom
      // move focus to <body> without firing focusin, so only the focusout
      // path can recover here.
      act(() => reset.focus());
      await user.click(reset);

      expect(
        screen.queryByRole('button', { name: 'Reset zoom and rotation' }),
      ).not.toBeInTheDocument();
      // Recovery is deferred to a microtask so React's commit lands first.
      await waitFor(() => expect(screen.getByRole('dialog')).toHaveFocus());

      await user.tab();
      expect(screen.getByRole('button', { name: 'Previous image' })).toHaveFocus();
    });

    it('does not trap focus while closed', () => {
      render(
        <>
          <button>outside</button>
          <PhotoViewer selectedImage={null} images={images} onClose={jest.fn()} />
        </>,
      );

      const outside = screen.getByRole('button', { name: 'outside' });
      outside.focus();

      expect(outside).toHaveFocus();
    });
  });

  describe('focus restore', () => {
    function Harness() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button onClick={() => setOpen(true)}>Open</button>
          <PhotoViewer
            selectedImage={open ? images[0] : null}
            images={images}
            onClose={() => setOpen(false)}
            // Isolates this from useClickOutsideToClose, whose window-level
            // mousedown handler would otherwise fire on the trigger click.
            settings={{ clickOutsideToExit: false }}
          />
        </>
      );
    }

    it('returns focus to the element that opened the viewer', async () => {
      const user = userEvent.setup();

      render(<Harness />);
      const trigger = screen.getByRole('button', { name: 'Open' });

      await user.click(trigger);
      expect(screen.getByRole('dialog')).toHaveFocus();

      await user.keyboard('{Escape}');

      expect(trigger).toHaveFocus();
    });

    it('restores focus under StrictMode, whose setup/cleanup/setup remount must not discard the opener', async () => {
      const user = userEvent.setup();

      // Mounts the viewer on open (rather than keeping it mounted and toggling
      // `selectedImage`), so its focus-trap effect mounts already enabled. That
      // is the only path where StrictMode double-invokes setup/cleanup/setup,
      // and where an eagerly-cleared restore target is lost.
      function MountHarness() {
        const [open, setOpen] = useState(false);
        return (
          <>
            <button onClick={() => setOpen(true)}>Open</button>
            {open && (
              <PhotoViewer
                selectedImage={images[0]}
                images={images}
                onClose={() => setOpen(false)}
                settings={{ clickOutsideToExit: false }}
              />
            )}
          </>
        );
      }

      render(
        <React.StrictMode>
          <MountHarness />
        </React.StrictMode>,
      );
      const trigger = screen.getByRole('button', { name: 'Open' });

      await user.click(trigger);
      expect(screen.getByRole('dialog')).toHaveFocus();

      await user.keyboard('{Escape}');

      expect(trigger).toHaveFocus();
    });
  });

  describe('body scroll lock', () => {
    it('locks while open and restores the previous value on close', () => {
      document.body.style.overflow = 'scroll';

      const { rerender } = render(
        <PhotoViewer selectedImage={images[0]} images={images} onClose={jest.fn()} />,
      );
      expect(document.body.style.overflow).toBe('hidden');

      rerender(<PhotoViewer selectedImage={null} images={images} onClose={jest.fn()} />);
      expect(document.body.style.overflow).toBe('scroll');
    });

    it('restores on unmount', () => {
      document.body.style.overflow = 'scroll';

      const { unmount } = render(
        <PhotoViewer selectedImage={images[0]} images={images} onClose={jest.fn()} />,
      );
      expect(document.body.style.overflow).toBe('hidden');

      unmount();
      expect(document.body.style.overflow).toBe('scroll');
    });

    it('does not lock while closed', () => {
      document.body.style.overflow = 'scroll';

      render(<PhotoViewer selectedImage={null} images={images} onClose={jest.fn()} />);

      expect(document.body.style.overflow).toBe('scroll');
    });

    it('stays locked until the last open viewer unmounts', () => {
      document.body.style.overflow = 'scroll';

      const first = render(
        <PhotoViewer selectedImage={images[0]} images={images} onClose={jest.fn()} />,
      );
      const second = render(
        <PhotoViewer selectedImage={images[1]} images={images} onClose={jest.fn()} />,
      );
      expect(document.body.style.overflow).toBe('hidden');

      first.unmount();
      expect(document.body.style.overflow).toBe('hidden');

      second.unmount();
      expect(document.body.style.overflow).toBe('scroll');
    });
  });

  describe('portal and background accessibility', () => {
    it('renders the dialog into document.body instead of inside the owner tree', () => {
      const { container } = render(
        <div style={{ transform: 'translateZ(0)' }}>
          <PhotoViewer selectedImage={images[0]} images={images} onClose={jest.fn()} />
        </div>,
      );

      const dialog = screen.getByRole('dialog');

      expect(dialog.parentElement).toBe(document.body);
      expect(container).not.toContainElement(dialog);
    });

    it('hides background content while open and restores it when closed', () => {
      const { container, rerender } = render(
        <>
          <button>outside</button>
          <PhotoViewer selectedImage={images[0]} images={images} onClose={jest.fn()} />
        </>,
      );

      expect(container).toHaveAttribute('inert');
      expect(container).toHaveAttribute('aria-hidden', 'true');
      expect(screen.queryByRole('button', { name: 'outside' })).not.toBeInTheDocument();

      rerender(
        <>
          <button>outside</button>
          <PhotoViewer selectedImage={null} images={images} onClose={jest.fn()} />
        </>,
      );

      expect(container).not.toHaveAttribute('inert');
      expect(container).not.toHaveAttribute('aria-hidden');
      expect(screen.getByRole('button', { name: 'outside' })).toBeInTheDocument();
    });

    it('restores pre-existing background aria-hidden and inert attributes', () => {
      const root = document.createElement('div');
      root.setAttribute('aria-hidden', 'false');
      root.setAttribute('inert', 'existing');
      document.body.appendChild(root);

      const { rerender, unmount } = render(
        <PhotoViewer selectedImage={images[0]} images={images} onClose={jest.fn()} />,
        { container: root },
      );

      expect(root).toHaveAttribute('inert', '');
      expect(root).toHaveAttribute('aria-hidden', 'true');

      rerender(<PhotoViewer selectedImage={null} images={images} onClose={jest.fn()} />);

      expect(root).toHaveAttribute('inert', 'existing');
      expect(root).toHaveAttribute('aria-hidden', 'false');

      unmount();
      root.remove();
    });

    it('keeps background content hidden until every open viewer closes', () => {
      const first = render(
        <PhotoViewer selectedImage={images[0]} images={images} onClose={jest.fn()} />,
      );
      const second = render(
        <PhotoViewer selectedImage={images[1]} images={images} onClose={jest.fn()} />,
      );

      expect(first.container).toHaveAttribute('inert');
      expect(first.container).toHaveAttribute('aria-hidden', 'true');

      second.unmount();

      expect(first.container).toHaveAttribute('inert');
      expect(first.container).toHaveAttribute('aria-hidden', 'true');

      first.unmount();

      expect(first.container).not.toHaveAttribute('inert');
      expect(first.container).not.toHaveAttribute('aria-hidden');
    });

    it('keeps click outside close working after the dialog moves to a portal', async () => {
      const user = userEvent.setup();
      const onClose = jest.fn();

      render(<PhotoViewer selectedImage={images[0]} images={images} onClose={onClose} />);

      await user.click(screen.getByAltText('First image'));
      expect(onClose).not.toHaveBeenCalled();

      await user.click(screen.getByRole('dialog'));
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('does not access document during server rendering', () => {
      expect(() =>
        renderToString(
          <PhotoViewer selectedImage={images[0]} images={images} onClose={jest.fn()} />,
        ),
      ).not.toThrow();
    });
  });
});
