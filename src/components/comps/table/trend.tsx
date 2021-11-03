import React from 'react';
import { Trend } from './type';
import styled from 'styled-components';
import { ReactSVG } from 'react-svg';
import svgs from 'components/comps/trend/icons/index';
import { num2ThousandOrDecimal } from 'utils/index';

const IndexStyled = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
`;

interface TrendProps extends Trend {
  data: string | number;
  textColor: string;
  marginRight: number;
}

const Index: React.FC<TrendProps> = (props) => {
  const { icon, color, number, size, data, textColor, marginRight } = props;
  const value = Number(data);
  const base = number.base;
  let iconColor = '';

  if (value > base) {
    iconColor = color.up;
  } else if (value < base) {
    iconColor = color.down;
  } else {
    iconColor = color.equal;
  }

  return (
    <IndexStyled>
      {icon ? (
        <>
          <ReactSVG
            src={base === value ? svgs['./icon11.svg'] : svgs[icon]}
            className="icon"
            wrapper="span"
            beforeInjection={(svg) => {
              svg.style.width = size + 'px';
              svg.style.height = size + 'px';
              svg.style.fill = iconColor;
              svg.style.stroke = iconColor;
              if (value < base) {
                svg.style.transform = `scale(1, -1)`;
              }
            }}
          />
          <span
            style={{
              marginLeft: marginRight + 'px',
              color: number.isIconColor ? iconColor : textColor,
            }}
          >
            {num2ThousandOrDecimal(value, number.isThousands) + number.suffix}
          </span>
        </>
      ) : null}
    </IndexStyled>
  );
};

export default Index;
