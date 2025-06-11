import { useState, useEffect } from 'react';

type QueryType = 'min' | 'max';

/**
 * Hook to detect if a media query matches
 * @param query - The media query to match (e.g., '(min-width: 768px)')
 * @returns boolean indicating if the media query matches
 */
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    // Ensure window is defined (for SSR/SSG)
    if (typeof window === 'undefined') return;

    const media = window.matchMedia(query);
    
    // Update state with current match value
    setMatches(media.matches);
    
    // Create event listener
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    
    // Add listener for changes
    media.addEventListener('change', listener);
    
    // Clean up
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}

/**
 * Convenience hook for min-width media queries
 * @param width - The minimum width in pixels
 * @returns boolean indicating if the viewport is at least the specified width
 */
function useMinWidth(width: number): boolean {
  return useMediaQuery(`(min-width: ${width}px)`);
}

/**
 * Convenience hook for max-width media queries
 * @param width - The maximum width in pixels
 * @returns boolean indicating if the viewport is at most the specified width
 */
function useMaxWidth(width: number): boolean {
  return useMediaQuery(`(max-width: ${width - 1}px)`);
}

export { useMediaQuery, useMinWidth, useMaxWidth };
