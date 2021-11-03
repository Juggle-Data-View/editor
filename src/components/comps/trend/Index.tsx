/**
 * 业务组件 - 预览组件
 *
 * @author longchan
 * @createTime 2020-08-19 12:49:50
 */

import React, { useEffect, useState } from 'react';
import { IIndex } from './type';
import styled from 'styled-components';
import { ReactSVG } from 'react-svg';
import svgs from './icons/index';
import { num2ThousandOrDecimal } from 'utils/index';
import numeral from 'numeral';
import { getNotificationContent, getTriggerCondition } from 'utils/limitNotification';
import { triggerNotification } from 'utils/api';
import notice from 'utils/notice';

const IndexStyled = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  .icon > * {
    width: 100%;
    height: 100%;
  }
`;

const Index: React.FC<IIndex> = ({ compData, sourceData }) => {
  const { icon, color, number, global, limitOption } = compData.config;

  const value = sourceData.getSourceDataValue('value', 0);
  const base = sourceData.getSourceDataValue('base', number.base);
  const [notificationColor, setNotificationColor] = useState('');
  const diff = Number(value) - Number(base);

  let iconColor = '';

  if (diff > 0) {
    iconColor = color.up;
  } else if (diff < 0) {
    iconColor = color.down;
  } else {
    iconColor = color.equal;
  }

  let result = value;

  useEffect(() => {
    if (compData.config.limitOption) notification(); //兼容线上组件
  }, [sourceData, compData]); //eslint-disable-line

  const notification = async () => {
    const { isShow, limitTrigger } = limitOption;
    const condition = getTriggerCondition(limitTrigger, value);
    if (!isShow) {
      setNotificationColor('');
      return;
    }
    if (!condition) {
      setNotificationColor('');
      return;
    }
    const { isTrigger, conditionCode, color, intervalType, left, right } = condition;

    setNotificationColor(color);
    if (!isTrigger) {
      // setNotificationColor('');
      return;
    }
    try {
      await triggerNotification({
        instCode: compData.code,
        conditionCode,
        conditionName: getNotificationContent(intervalType, left, right),
        value: value,
      });
    } catch (error) {
      console.log(error);

      notice.error('阈值条件错误');
    }
  };

  try {
    const func = new Function(`return ${number.formatter}`)(); // eslint-disable-line
    if (typeof func === 'function') {
      result = func(result, numeral);
    }
  } catch (error) {
    console.log('函数编写错误:', error.message);
  }

  return (
    <IndexStyled
      style={{
        justifyContent: global.align,
        flexDirection: global.layout,
        backgroundColor: notificationColor,
      }}
    >
      {icon.name ? (
        <ReactSVG
          src={diff === 0 ? svgs['./icon11.svg'] : svgs[icon.name]}
          className="icon"
          style={{
            width: icon.size,
            height: icon.size,
            marginRight: global.layout === 'row' ? global.gap : 0,
            marginLeft: global.layout === 'row-reverse' ? global.gap : 0,
          }}
          wrapper={undefined}
          beforeInjection={(svg) => {
            svg.style.width = icon.size + 'px';
            svg.style.height = icon.size + 'px';
            svg.style.fill = iconColor;
            svg.style.stroke = iconColor;
            if (diff < 0) {
              svg.style.transform = `scale(1, -1)`;
            }
          }}
        />
      ) : null}
      <span
        style={{
          ...number.textStyle,
          color: number.isIconColor ? iconColor : number.textStyle.color,
        }}
      >
        {number.prefix + (number.formatter ? result : num2ThousandOrDecimal(value, number.isThousands)) + number.suffix}
      </span>
    </IndexStyled>
  );
};

export default Index;
