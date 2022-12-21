/**
 * 缓动动画
 * @see https://www.zhangxinxu.com/wordpress/2016/12/how-use-tween-js-animation-easing/
 */

import Tween from './tween';

/**
 * 动画回调函数
 * @param to 当前动画位置
 * @param isEnd 动画是否结束
 */
type FuncCallback = (to: number, isEnd: boolean) => void;

/**
 * 动画函数
 * @param from  起始位置
 * @param to 终点位置
 * @param duration 持续时间，单位: 毫秒
 * @param callback 回调函数。参数val: 当前改变值，isEnd: 动画是否结束
 * @param easing 缓动函数名称，如: 'Cubic.easeOut'，具体见: tween.js
 */
const animate = (from: number, to: number, duration: number, callback: FuncCallback, easing?: string) => {
  let t = 0;
  const b = from;
  const c = to - from;
  const d = Math.ceil(duration / 17);
  let e = false; // isEnd
  let raf: any = null;

  const move = () => {
    let fnGetValue;

    if (typeof easing === 'string') {
      // 当前动画算法
      // 确保首字母大写
      const _easing = easing.slice(0, 1).toUpperCase() + easing.slice(1);
      const arrKeyTween: any[] = _easing.split('.');

      if (arrKeyTween.length === 1) {
        fnGetValue = (Tween as any)[arrKeyTween[0]];
      } else if (arrKeyTween.length === 2) {
        fnGetValue = (Tween as any)[arrKeyTween[0]] && (Tween as any)[arrKeyTween[0]][arrKeyTween[1]];
      }

      if (typeof fnGetValue !== 'function') {
        console.error('没有找到名为"' + easing + '"的动画算法');
        return;
      }
    }

    // v就是当前的位置值
    const v = fnGetValue ? fnGetValue(t, b, c, d) : Tween.Cubic.easeOut(t, b, c, d);

    t++;
    if (t <= d) {
      // 继续运动
      raf = requestAnimationFrame(move);
    } else {
      // 动画结束
      e = true;
      cancelAnimationFrame(raf);
    }
    callback(v, e);
  };

  move();

  return raf;
};

export default animate;
