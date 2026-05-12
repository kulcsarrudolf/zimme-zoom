import { useCallback, useReducer } from 'react';
import { clamp } from '../../utils/photo-viewer/transformUtils';

type TransformState = {
  zoom: number;
  panX: number;
  panY: number;
  rotationCount: number;
};

type TransformAction =
  | { type: 'reset' }
  | { type: 'setZoom'; zoom: number }
  | { type: 'setPan'; panX: number; panY: number }
  | { type: 'zoomTo'; zoom: number; panX: number; panY: number }
  | { type: 'rotate'; direction: 'left' | 'right' };

const INITIAL_STATE: TransformState = { zoom: 1, panX: 0, panY: 0, rotationCount: 0 };

function transformReducer(state: TransformState, action: TransformAction): TransformState {
  switch (action.type) {
    case 'reset':
      return INITIAL_STATE;
    case 'setZoom':
      if (action.zoom === 1) return { ...state, zoom: 1, panX: 0, panY: 0 };
      return { ...state, zoom: action.zoom };
    case 'setPan':
      return { ...state, panX: action.panX, panY: action.panY };
    case 'zoomTo':
      if (action.zoom === 1) return { ...state, zoom: 1, panX: 0, panY: 0 };
      return { ...state, zoom: action.zoom, panX: action.panX, panY: action.panY };
    case 'rotate':
      return {
        ...state,
        rotationCount: state.rotationCount + (action.direction === 'left' ? -1 : 1),
      };
    default:
      return state;
  }
}

export type Transform = TransformState & {
  setZoom: (zoom: number) => void;
  setPan: (panX: number, panY: number) => void;
  zoomTo: (zoom: number, panX: number, panY: number) => void;
  rotate: (direction: 'left' | 'right') => void;
  reset: () => void;
};

export function useTransform({
  minZoom,
  maxZoom,
}: {
  minZoom: number;
  maxZoom: number;
}): Transform {
  const [state, dispatch] = useReducer(transformReducer, INITIAL_STATE);

  const setZoom = useCallback(
    (zoom: number) => dispatch({ type: 'setZoom', zoom: clamp(zoom, minZoom, maxZoom) }),
    [minZoom, maxZoom]
  );

  const setPan = useCallback(
    (panX: number, panY: number) => dispatch({ type: 'setPan', panX, panY }),
    []
  );

  const zoomTo = useCallback(
    (zoom: number, panX: number, panY: number) =>
      dispatch({ type: 'zoomTo', zoom: clamp(zoom, minZoom, maxZoom), panX, panY }),
    [minZoom, maxZoom]
  );

  const rotate = useCallback(
    (direction: 'left' | 'right') => dispatch({ type: 'rotate', direction }),
    []
  );

  const reset = useCallback(() => dispatch({ type: 'reset' }), []);

  return { ...state, setZoom, setPan, zoomTo, rotate, reset };
}
