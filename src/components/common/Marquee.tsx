/**
 * 文本 跑马灯 组件
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';

interface IMarquee {
  text: React.ReactNode;

  /** 滚动速度，值越小越慢，为0时不会滚动 */
  speed: number;

  /** 滚动方向 */
  direction?: 'vertical' | 'horizontal';

  /**
   * 是否无缝滚动
   * 当文字内容的宽度or高度没有溢出时，无缝滚动不会生效
   */
  seamless?: boolean;

  /** 是否禁用跑马灯动画 */
  disabled?: boolean;
}

const Marquee: React.FC<IMarquee> = (props) => {
  const { text, seamless, speed, disabled } = props;
  const wrapRef = useRef<any>(null);
  const innerRef = useRef<any>(null);
  const rafRef = useRef<number>(-1);
  const offset: any = useRef(0);
  const [isOver, setIsOver] = useState<boolean>(false);

  const direction = props.direction || 'horizontal';

  const getOverflow = useCallback(() => {
    let overflow = false;
    const w = wrapRef.current;
    const i = innerRef.current;
    if (direction === 'vertical') {
      if (i.offsetHeight > w.offsetHeight) {
        overflow = true;
      }
    } else {
      if (i.offsetWidth > w.offsetWidth) {
        overflow = true;
      }
    }
    return overflow;
  }, [wrapRef.current, innerRef.current]); // eslint-disable-line

  const stop = () => {
    if (innerRef && innerRef.current) {
      const isX = direction === 'horizontal';
      innerRef.current.style.transform = `translate${isX ? 'X' : 'Y'}(0)`;
      offset.current = 0;
    }
  };

  const move = () => {
    if (!wrapRef || !wrapRef.current || !innerRef || !innerRef.current) {
      return false;
    }
    const w = wrapRef.current;
    const i = innerRef.current;
    const isX = direction === 'horizontal';
    const noSpeed = typeof speed !== 'number' || isNaN(speed) || speed <= 0;

    if (noSpeed || disabled) {
      stop();
      return;
    }

    offset.current -= speed;

    if (isX) {
      if (seamless) {
        if (offset.current <= -i.offsetWidth / 2) {
          offset.current = 0;
        }
      } else {
        if (offset.current <= -i.offsetWidth) {
          offset.current = w.offsetWidth;
        }
      }
    } else {
      if (seamless) {
        if (offset.current <= -i.offsetHeight / 2) {
          offset.current = 0;
        }
      } else {
        if (offset.current <= -i.offsetHeight) {
          offset.current = w.offsetHeight;
        }
      }
    }

    i.style.transform = `translate${isX ? 'X' : 'Y'}(${offset.current}px)`;

    rafRef.current = requestAnimationFrame(move);
  };

  // eslint-disable-next-line
  useEffect(() => {
    setIsOver(getOverflow());
  });

  useEffect(() => {
    if (isOver) {
      move();
    } else {
      stop();
    }
    return () => cancelAnimationFrame(rafRef.current);
  }); // eslint-disable-line

  let wrapStyle: React.CSSProperties = {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  };

  let innerStyle: React.CSSProperties = {
    display: 'inline-block',
  };

  let itemStyle: React.CSSProperties = {};

  if (direction === 'vertical') {
    wrapStyle = {
      overflow: 'hidden',
      height: '100%',
    };
    innerStyle = {
      display: 'block',
    };
  } else {
    itemStyle = {
      display: 'inline-block',
    };
  }

  return (
    <div
      className="autoDV-marquee"
      ref={wrapRef}
      style={{
        wordBreak: 'break-all',
        ...wrapStyle,
      }}
    >
      <div ref={innerRef} style={innerStyle}>
        <div style={itemStyle}>{text}</div>
        {seamless && isOver ? <div style={itemStyle}>{text}</div> : null}
      </div>
    </div>
  );
};

export default Marquee;
