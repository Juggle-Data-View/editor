/**
 * 业务组件 - 预览组件
 * @创建时间 2020-06-01 17:12:15
 */

import React, { useState, useEffect, useRef } from 'react';
import { IIndex, TabAddress } from './type';
import styled from 'styled-components';
import { useInterval } from 'ahooks';
import animate from 'helpers/animate';
import View from 'components/page/view';

const IndexStyled = styled.div`
  // 预览组件的样式
  .carouselheader {
    height: 100%;
    width: 100%;
    display: flex;
  }
  .carouselBody {
    width: 100%;
    overflow: hidden;
    > div {
      display: flex;
      width: auto;
      .no-display {
        display: none !important;
      }
      .active {
        display: block !important;
      }
    }
    .fakeIFrame {
      width: 100%;
      flex-shrink: 0;
      position: relative;
      border: 0px;
    }
  }
`;

const basisUrl =
  window.location.href.indexOf('/view') !== -1
    ? window.location.href.split('?')[0]
    : window.location.href.split('?')[0] + '/view';

const Index: React.FC<IIndex> = ({ compData, sourceData, reciver }) => {
  const { attr } = compData;
  const { style, option } = compData.config;
  const {
    tabAddressOption,
    tabTitleStyle,
    activeTab,
    inactivedTab,
    animationDuration,
    animationVelocity,
    animationType,
    isAutoChange,
  } = option;
  const { tabAddress, carouselCycle } = tabAddressOption;
  const [addressIndex, setAddressIndex] = useState(0);
  const carouselContainerRef = useRef<HTMLDivElement>(null);
  const items: TabAddress[] = sourceData.length ? sourceData : tabAddress;

  const [viewArr, setViewArr] = useState<JSX.Element[]>([]);

  const handleTabChange = (index: number) => {
    const previousIndex = addressIndex;
    if (animationType === 'carousel') {
      animate(
        -attr.width * previousIndex,
        -attr.width * index,
        animationDuration,
        (val, isEnd) => {
          if (isEnd) {
            if (index < viewArr.length) {
              setAddressIndex(index);
            } else {
              setAddressIndex(0);
            }
          }
          if (carouselContainerRef.current) {
            const { current } = carouselContainerRef;
            current.style.transform = `translateX(${val}px) translateZ(0)`;
          }
        },
        animationVelocity
      );
    }
    if (animationType === 'direct') {
      if (index < viewArr.length) {
        setAddressIndex(index);
      } else {
        setAddressIndex(0);
      }
      if (carouselContainerRef.current) {
        const { current } = carouselContainerRef;
        current.style.transform = `translateX(${0}px) translateZ(0)`;
        if (current.children.length > 0 && current.children[previousIndex]) {
          current.children[previousIndex].classList.remove('active');
          current.children[addressIndex + 1 < items.length ? addressIndex + 1 : 0].classList.add('active');
        }
      }
    }
  };

  useInterval(() => {
    const autoChange = isAutoChange === undefined ? true : isAutoChange;
    if (autoChange) handleTabChange(addressIndex + 1);
  }, carouselCycle);

  useEffect(() => {
    const viewArr = [];
    for (let i = 0; i < items.length; i++) {
      // 这块根据type对URL进行拼接
      if (items[i].url) {
        const url = basisUrl + '?' + items[i].url;
        viewArr.push(<View key={i} url={url} />);
      }
    }
    setViewArr(viewArr);
  }, [items]);

  useEffect(() => {
    setAddressIndex(0);
  }, [animationType]);
  const renderIframeTitle = () => {
    return items.map((item, index) => {
      const titleStyle: any = index === addressIndex ? { ...activeTab } : { ...inactivedTab };
      titleStyle.fontSize += 'px';
      return (
        <div
          style={{
            ...titleStyle,
            ...{
              margin: `0px ${tabTitleStyle.margin}px`,
              flex: 1,
            },
          }}
          onClick={() => handleTabChange(index)}
          key={index}
        >
          {item.title}
        </div>
      );
    });
  };

  const iframeHeight = tabTitleStyle.isShowTitle ? attr.height - tabTitleStyle.height + 'px' : attr.height + 'px';

  return (
    <IndexStyled style={{ ...style }}>
      {tabTitleStyle.isShowTitle ? (
        <div
          className="carouselheader"
          style={{
            height: tabTitleStyle.height + 'px',
          }}
        >
          {renderIframeTitle()}
        </div>
      ) : null}
      <div className="carouselBody">
        <div
          ref={carouselContainerRef}
          style={{
            width: viewArr.length * attr.width + 'px',
          }}
        >
          {viewArr.length > 0 &&
            viewArr.map((item, index) => {
              return (
                <div
                  style={{
                    height: iframeHeight,
                    width: attr.width + 'px',
                    display: animationType === 'carousel' ? 'block' : 'none',
                  }}
                  className={animationType === 'direct' && index === 0 ? 'active' : ''}
                  key={index}
                >
                  <div className="fakeIFrame">{viewArr[index]}</div>
                </div>
              );
            })}
          {viewArr.length > 0 && animationType === 'carousel' ? (
            <div
              style={{
                height: iframeHeight,
                width: attr.width + 'px',
              }}
              key={'index-last'}
            >
              <div className="fakeIFrame">{viewArr[0]}</div>
            </div>
          ) : null}
        </div>
      </div>
    </IndexStyled>
  );
};

export default Index;
