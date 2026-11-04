const React = require('react');
const { formatNumber, dataStatus } = require('../lib/format.jsx');

function KPI({ compData, sourceData }) {
  const config = (compData && compData.config) || {};
  const status = dataStatus(sourceData);
  let value = '…';
  if (status === 'error') {
    value = 'data unavailable';
  } else if (status === 'ready') {
    const raw =
      sourceData && sourceData.getSourceDataValue
        ? sourceData.getSourceDataValue('value', '—')
        : '—';
    value = `${config.prefix || ''}${formatNumber(raw)}${config.suffix || ''}`;
  }

  return React.createElement(
    'div',
    {
      'data-kpi': config.label || '',
      'data-data-status': status,
      style: {
        boxSizing: 'border-box',
        width: '100%',
        height: '100%',
        padding: '16px 18px',
        borderRadius: 12,
        background: 'rgba(16, 36, 58, 0.92)',
        border: '1px solid rgba(125, 168, 214, 0.28)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      },
    },
    React.createElement(
      'div',
      { style: { color: '#9bb0c9', fontSize: 14, letterSpacing: 0.2 } },
      config.label || ''
    ),
    React.createElement(
      'div',
      {
        style: {
          color: status === 'error' ? '#f0c36a' : '#f4f8ff',
          fontSize: status === 'error' ? 18 : 32,
          fontWeight: 650,
          lineHeight: 1.15,
        },
      },
      value
    )
  );
}

module.exports = KPI;
