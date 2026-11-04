const NETWORKS = {
  'eip155:8453': 'Base',
  'eip155:42161': 'Arbitrum One',
  'eip155:84532': 'Base Sepolia',
};

function networkLabel(value) {
  if (value == null || value === '') return '';
  return NETWORKS[value] || String(value);
}

function formatTime(value) {
  const time = Date.parse(value);
  if (Number.isNaN(time) || String(value).indexOf('T') === -1) {
    return value == null ? '' : String(value);
  }
  return new Date(time).toISOString().slice(5, 16).replace('T', ' ');
}

function formatNumber(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || value === '' || value == null) {
    return value == null ? '' : String(value);
  }
  if (typeof value === 'string' && value.indexOf('.') !== -1) {
    return value;
  }
  return numeric.toLocaleString('en-US');
}

function dataStatus(sourceData) {
  return (sourceData && sourceData.__status) || 'ready';
}

module.exports = {
  networkLabel,
  formatTime,
  formatNumber,
  dataStatus,
};
