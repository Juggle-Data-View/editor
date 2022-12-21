/**
 * 监听元素变化的自定义hook
 */

import { useEffect, useRef } from 'react';
import ResizeObserver from 'resize-observer-polyfill';

type Callback = (el: Element) => void;

type Options = {
  target: React.RefObject<Element>;
  wait?: number;
};

export default function useResize(cb: Callback, options: Options, deps: any[] = []) {
  const { target, wait } = options;
  const timer = useRef<any>(-1);
  useEffect(() => {
    const el = target.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === el) {
          if (typeof wait === 'number') {
            clearTimeout(timer.current);
            timer.current = setTimeout(() => cb(el), wait);
          } else {
            cb(el);
          }
        }
      }
    });
    ro.observe(el);
    return () => {
      ro.unobserve(el);
    };
  }, deps); // eslint-disable-line
}
