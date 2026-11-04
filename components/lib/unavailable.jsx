const React = require('react');

function Unavailable({ message }) {
  return React.createElement(
    'div',
    {
      'data-data-status': 'unavailable',
      style: {
        boxSizing: 'border-box',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#9bb0c9',
        border: '1px dashed rgba(155,176,201,0.45)',
        background: 'rgba(8, 18, 32, 0.35)',
        fontSize: 16,
      },
    },
    message || 'data unavailable'
  );
}

module.exports = Unavailable;
