const React = require('react');
const { networkLabel, formatTime, dataStatus } = require('../lib/format.jsx');
const Unavailable = require('../lib/unavailable.jsx');

function cellValue(row, column) {
  if (column.format === 'price') {
    const fields = column.fields || ['priceCall', 'priceLocal', 'priceGlobal'];
    for (let i = 0; i < fields.length; i += 1) {
      if (row[fields[i]]) return row[fields[i]];
    }
    return '—';
  }
  const raw = row[column.field];
  if (column.format === 'network') return networkLabel(raw);
  if (column.format === 'time') return formatTime(raw);
  if (column.format === 'short') {
    const text = raw == null ? '' : String(raw);
    return text.length > 14 ? `${text.slice(0, 8)}…${text.slice(-4)}` : text;
  }
  if (raw == null || raw === '') return '—';
  return String(raw);
}

function DataTable({ compData, sourceData }) {
  const config = (compData && compData.config) || {};
  const status = dataStatus(sourceData);
  const columns = config.columns || [];
  const rows = Array.isArray(sourceData) ? sourceData : [];

  if (status === 'error') {
    return React.createElement(Unavailable, null);
  }

  const header = React.createElement(
    'div',
    {
      style: {
        display: 'grid',
        gridTemplateColumns: `repeat(${columns.length || 1}, minmax(0, 1fr))`,
        gap: 8,
        color: '#8eabc8',
        fontSize: 12,
        letterSpacing: 0.4,
        textTransform: 'uppercase',
        padding: '0 8px 8px',
      },
    },
    columns.map((column) => React.createElement('div', { key: column.label }, column.label))
  );

  const body = rows.map((row, index) =>
    React.createElement(
      'div',
      {
        key: index,
        style: {
          display: 'grid',
          gridTemplateColumns: `repeat(${columns.length || 1}, minmax(0, 1fr))`,
          gap: 8,
          padding: '8px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          color: '#e8f1ff',
          fontSize: 13,
          alignItems: 'center',
        },
      },
      columns.map((column) => {
        const text = cellValue(row, column);
        if (column.format === 'synthetic') {
          const synthetic = row[column.field] === true || row[column.field] === 'true';
          return React.createElement(
            'div',
            { key: column.label },
            React.createElement(
              'span',
              {
                style: {
                  display: 'inline-block',
                  padding: '2px 8px',
                  borderRadius: 999,
                  background: synthetic ? 'rgba(245,166,35,0.2)' : 'rgba(61,214,198,0.15)',
                  color: synthetic ? '#f5c16c' : '#8ee0d4',
                  fontSize: 12,
                },
              },
              synthetic ? 'synthetic' : 'live corpus'
            )
          );
        }
        if (column.linkField && row[column.linkField]) {
          return React.createElement(
            'a',
            {
              key: column.label,
              href: row[column.linkField],
              target: '_blank',
              rel: 'noreferrer',
              style: { color: '#8eb7ff', textDecoration: 'none' },
            },
            text
          );
        }
        return React.createElement('div', { key: column.label }, text);
      })
    )
  );

  return React.createElement(
    'div',
    {
      'data-table': config.title || '',
      style: {
        boxSizing: 'border-box',
        width: '100%',
        height: '100%',
        padding: 16,
        borderRadius: 12,
        background: 'rgba(16, 36, 58, 0.92)',
        border: '1px solid rgba(125, 168, 214, 0.28)',
        overflow: 'auto',
        color: '#e8f1ff',
      },
    },
    React.createElement(
      'div',
      { style: { fontSize: 16, marginBottom: 12, color: '#d6e4ff' } },
      config.title || ''
    ),
    status === 'loading'
      ? React.createElement('div', { style: { color: '#9bb0c9' } }, '…')
      : rows.length
        ? React.createElement('div', null, header, body)
        : React.createElement('div', { style: { color: '#9bb0c9' } }, 'No rows')
  );
}

module.exports = DataTable;
