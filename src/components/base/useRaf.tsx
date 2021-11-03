import { useRef, useLayoutEffect } from 'react';

/*
  We are using raf which is a polyfilled version of requestAnimationFrame
*/
/**
 *
 * useRaf
 * @param {function} callback The callback function to be executed
 * @param {boolean} [isActive=true] The value which while true, keeps the raf running infinitely
 */
export default function useRaf(callback: (timeElapsed: number) => void, isActive: boolean): void {
  const savedCallback = useRef<(timeElapsed: number) => void>();
  // Remember the latest function.
  useLayoutEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useLayoutEffect(() => {
    let startTime = 0,
      animationFrame = 0;

    function tick() {
      const timeElapsed = Date.now() - startTime;
      startTime = Date.now();
      loop();
      savedCallback.current && savedCallback.current(timeElapsed);
    }

    function loop() {
      animationFrame = requestAnimationFrame(tick);
    }

    if (isActive) {
      startTime = Date.now();
      loop();
      return () => {
        cancelAnimationFrame(animationFrame);
      };
    }
  }, [isActive]);
}
