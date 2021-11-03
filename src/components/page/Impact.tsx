import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { random } from 'lodash';

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: black;
  user-select: none;
  .item {
    position: absolute;
    border: 1px solid #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 18px;
    box-sizing: border-box;
    &.--in {
      border-color: red;
    }
  }
  .temp {
    position: absolute;
    box-sizing: border-box;
    border: 1px solid #f00;
  }
`;

interface Rect {
  t: number;
  l: number;
  w: number;
  h: number;
}

interface Item extends Rect {
  id: string;
}

let isMouseDown = false;
let isMouseUp = true;
let start = { t: 0, l: 0 };

const Impact = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [rect, setRect] = useState<Rect>({ t: 0, l: 0, w: 0, h: 0 });
  const [dragging, setDragging] = useState<boolean>(false);

  useEffect(() => {
    const { width, height } = document.documentElement.getBoundingClientRect();
    const _items: Item[] = [];

    for (let i = 0; i < 30; i++) {
      const w = random(30, 100);
      const h = random(30, 100);
      const l = random(0, width - w);
      const t = random(0, height - h);
      _items.push({
        id: i.toString(),
        t,
        l,
        w,
        h,
      });
    }
    setItems(_items);
  }, []);

  const handleMove = (e: React.MouseEvent) => {
    if (isMouseDown && !isMouseUp) {
      if (!dragging) {
        setDragging(true);
      }

      let l = start.l,
        t = start.t,
        w = 0,
        h = 0;

      switch (true) {
        case e.clientX === start.l && e.clientY < start.t:
          // console.log('上');
          h = start.t - e.clientY;
          break;
        case e.clientY === start.t && e.clientX > start.l:
          // console.log('右');
          w = e.clientX - start.l;
          break;
        case e.clientX === start.l && e.clientY > start.t:
          // console.log('下');
          h = e.clientY - start.t;
          break;
        case e.clientY === start.t && e.clientX < start.l:
          // console.log('左');
          w = start.l - e.clientX;
          l = e.clientX;
          t = e.clientY;
          break;
        case e.clientX > start.l && e.clientY < start.t:
          // console.log('右上');
          t = e.clientY;
          w = e.clientX - start.l;
          h = start.t - e.clientY;
          break;
        case e.clientX > start.l && e.clientY > start.t:
          // console.log('右下');
          w = e.clientX - start.l;
          h = e.clientY - start.t;
          break;
        case e.clientX < start.l && e.clientY < start.t:
          // console.log('左上');
          l = e.clientX;
          t = e.clientY;
          w = start.l - e.clientX;
          h = start.t - e.clientY;
          break;
        case e.clientX < start.l && e.clientY > start.t:
          // console.log('左下');
          w = start.l - e.clientX;
          h = e.clientY - start.t;
          l = e.clientX;
          break;
        default:
          break;
      }

      setRect({ l, t, w, h });
    }
  };

  return (
    <Container
      onMouseDown={(e) => {
        isMouseDown = true;
        isMouseUp = false;
        start = { l: e.clientX, t: e.clientY };
        setRect({
          ...rect,
        });
      }}
      onMouseUp={() => {
        isMouseDown = false;
        isMouseUp = true;
        setDragging(false);
        setRect({ l: 0, t: 0, w: 0, h: 0 });
      }}
      onMouseMove={handleMove}
    >
      {items.map(({ id, t, l, w, h }, index) => {
        // rect 就是拖拽选区
        const isIn = rect.l < l + w && rect.l + rect.w > l && rect.t < t + h && rect.h + rect.t > t;
        return (
          <div className={`item ${isIn ? '--in' : ''}`} key={id} style={{ width: w, height: h, top: t, left: l }}>
            {index + 1}
          </div>
        );
      })}

      <div className="temp" style={{ top: rect.t, left: rect.l, width: rect.w, height: rect.h }} />
    </Container>
  );
};

export default Impact;
