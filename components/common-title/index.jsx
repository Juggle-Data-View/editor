const React = require('react');

/**
 * Vendored from Juggle-Data-View/componetsStore commonTitle (the store's only
 * sample). Same props contract: compData.config.{style,title,link} and
 * sourceData.getSourceDataValue('value', title).
 */
function CommonTitle({ compData, sourceData }) {
  const config = compData.config || {};
  const style = config.style || {};
  const link = config.link || {};
  const title = config.title;
  const value =
    sourceData && typeof sourceData.getSourceDataValue === 'function'
      ? sourceData.getSourceDataValue('value', title)
      : title;

  const text = link.url
    ? React.createElement(
        'a',
        {
          href: link.url,
          target: link.isBlank ? '_blank' : '_self',
          rel: 'noreferrer',
          style: { color: 'inherit', textDecoration: 'none' },
        },
        value
      )
    : value;

  return React.createElement(
    'div',
    {
      style: {
        display: style.display || 'flex',
        width: '100%',
        height: '100%',
        wordBreak: 'break-all',
        color: style.color,
        fontSize: style.fontSize,
        lineHeight: style.lineHeight,
        fontWeight: style.fontWeight,
        letterSpacing: style.letterSpacing,
        justifyContent: style.justifyContent,
        alignItems: style.alignItems,
        textAlign: style.textAlign,
      },
    },
    text
  );
}

module.exports = CommonTitle;
