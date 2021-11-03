import React from 'react';
import { IIndex, Img } from './type';
const Index = ({ compData, sourceData }: IIndex) => {
  const { columns, textAlign, writingMode } = compData.config;
  const valueArr = sourceData?.[0] ? Object.values(sourceData?.[0]) : [];

  const textImg = (img: Img) => {
    return (
      <img
        alt="autoDV"
        src={img.imgUrl}
        style={{
          width: `${img.width}px`,
          height: `${img.height}px`,
          marginLeft: `${img.marginLeft}px`,
          marginRight: `${img.marginRight}`,
          marginTop: `${img.marginTop}px`,
        }}
      />
    );
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        wordBreak: 'break-all',
        textAlign: textAlign,
        writingMode: writingMode,
      }}
    >
      {columns.map((item, index) => {
        return (
          <React.Fragment key={item.id || index}>
            {!item.link.url ? (
              <>
                {/* 换行 */}
                {item.isWrap ? <br /> : ''}
                {/* 左侧插入图片 */}
                {item.img.imgUrl && item.img.position === 'left' ? textImg(item.img) : ''}
                <span style={{ ...item.style, marginLeft: item.marginLeft, marginRight: item.marginRight }}>
                  {valueArr?.[index] || item.title}
                </span>
                {item.img.imgUrl && item.img.position === 'right' ? textImg(item.img) : ''}
              </>
            ) : (
              <a href={item.link.url} target={item.link.isBlank ? '_blank' : '_self'} rel="noreferrer">
                {valueArr?.[index] || item.title}
              </a>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default Index;
