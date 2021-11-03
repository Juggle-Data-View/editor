/**
 * 封装气泡效果
 *
 * ```
 * // 配置项
 * {
 *   radius: [5, 20], // 气泡大小，区间值 [5, 20]
 *   count: [10, 20], // 气泡数量 [10, 20]
 *   strokeColor: "rgba(255, 255, 255, 0.4)", // 描边色
 *   fillColor: "rgba(255, 255, 255, 0.4)", // 填充色
 *   speed: [-0.05, -5], // 气泡上浮速度
 *   opacity: [0.2, 0.7] // 气泡透明度
 * }
 * ```
 * // 定义 & 调用
 * const autoDVBubble = new AutoDVBubble(canvas, {
 *   limit: [10, 20],
 *   radius: [5, 20],
 *   strokeColor: 'rgba(255, 255, 255, 0.4)',
 *   fillColor: 'rgba(255, 255, 255, 0.4)',
 * });
 *
 * autoDVBubble.init();
 */

import tinycolor from 'tinycolor2';
import { random } from 'lodash';

class Bubble {
  constructor(x, y, radius, speed = [-0.5, -5], strokeColor, fillColor) {
    this.x = x; //出现位置的x坐标
    this.y = y; //出现位置的y坐标
    this.radius = radius; //气泡的大小
    this.vy = random(speed[0], speed[1], true); //气泡上浮的速度
    this.oldY = y;
    this.strokeColor = strokeColor;
    this.fillColor = fillColor;
  }

  draw(ctx) {
    // var strokeColor, fillColor;
    // strokeColor = 'rgba(255, 255, 255,' + this.opacity + ')'; // 描边，气泡外围的颜色
    // fillColor = 'rgba(255, 255, 255,' + this.opacity / 2 + ')'; // 填充，气泡内部的颜色
    ctx.save(); // 存好当前状态
    ctx.lineWidth = 0.8; // 画笔粗细
    ctx.strokeStyle = this.strokeColor; // 描边
    ctx.fillStyle = this.fillColor; // 填充
    ctx.beginPath(); // 开始绘制
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true); // 绘制气泡
    ctx.closePath(); // 关闭路劲
    ctx.fill(); // 填充路劲
    ctx.stroke(); // 描边
    ctx.restore(); // 释放状态
  }
}

class AutoDVBubble {
  constructor(canvas, opt) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
    this.canvasWidth = this.canvas.width;
    this.canvasHeight = this.canvas.height;
    this.bubbles = [];

    const defaultOpt = {
      limit: [10, 20],
      radius: [5, 20],
      strokeColor: 'rgba(255, 255, 255, 0.4)',
      fillColor: 'rgba(255, 255, 255, 0.4)',
    };

    this.opt = Object.assign({}, defaultOpt, opt);
  }

  init() {
    this.generateBubbles();

    const drawFrame = () => {
      window.requestAnimationFrame(drawFrame);
      this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
      this.bubbles.forEach(this.moveBubble.bind(this));
    };

    drawFrame();
  }

  generateBubbles() {
    const { limit, radius, speed, opacity, strokeColor, fillColor } = this.opt;
    let count = random(...limit);
    for (var i = 0; i <= count; i++) {
      let r = random(...radius);
      let x = random(0, this.canvasWidth - r);
      let y = this.canvasHeight + (Math.random() * this.canvasHeight) / 2;
      let _strokeColor = tinycolor(strokeColor).setAlpha(random(...opacity, true));
      let _fillColor = tinycolor(fillColor).setAlpha(random(...opacity, true));
      this.bubbles.push(new Bubble(x, y, r, speed, _strokeColor, _fillColor));
    }
  }

  moveBubble(bubble) {
    const { y, radius, oldY, vy } = bubble;
    // for loop
    if (y + radius <= 0) {
      bubble.y = oldY;
    }
    bubble.y += vy;
    bubble.draw(this.ctx);
  }
}

export default AutoDVBubble;
