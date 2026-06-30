import { useEffect, useRef, type RefObject } from 'react';

type UseLoadMoreSentinelOptions = {
  enabled: boolean;
  root: HTMLElement | null;
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void | Promise<void>;
  rootMargin?: string;
};

/**
 * Triggers `onLoadMore` when the sentinel enters the scroll root's viewport.
 */
export function useLoadMoreSentinel({
  enabled,
  root,
  loading,
  hasMore,
  onLoadMore,
  rootMargin = '200px',
}: UseLoadMoreSentinelOptions): RefObject<HTMLDivElement | null> {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!enabled || !root || !ref.current) return;

    const el = ref.current;
    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.some((e) => e.isIntersecting);
        if (!hit || loading || !hasMore) return;
        void onLoadMore();
      },
      { root, rootMargin, threshold: 0 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [enabled, root, loading, hasMore, onLoadMore, rootMargin]);

  return ref;
}
