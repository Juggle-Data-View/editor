const React = require('react');
const MountChart = require('../lib/mountChart.jsx');
const Unavailable = require('../lib/unavailable.jsx');
const { dataStatus } = require('../lib/format.jsx');

const palette = ['#4c8dff', '#3dd6c6', '#f5a623', '#f26b8a', '#b388ff', '#7bd389'];

function pieData(config, sourceData) {
  const slices = config && config.slices;
  if (Array.isArray(slices) && slices.length) {
    const row = (sourceData && sourceData[0]) || {};
    return slices.map((slice) => ({
      name: slice.name,
      value: Number(row[slice.field]) || 0,
    }));
  }
  const rows = Array.isArray(sourceData) ? sourceData : [];
  return rows.map((row) => ({ name: row.name, value: Number(row.value) || 0 }));
}

function PieChart({ compData, sourceData }) {
  const config = (compData && compData.config) || {};
  const title = config.title || '饼图';
  const attr = compData.attr || {};
  if (dataStatus(sourceData) === 'error') {
    return React.createElement(Unavailable, null);
  }
  const option = {
    backgroundColor: 'transparent',
    color: palette,
    title: {
      text: title,
      left: 'center',
      textStyle: { color: '#d6e4ff', fontSize: 16, fontWeight: 500 },
    },
    tooltip: { trigger: 'item' },
    legend: {
      bottom: 0,
      textStyle: { color: '#9bb0c9' },
    },
    series: [
      {
        type: 'pie',
        radius: ['42%', '68%'],
        center: ['50%', '48%'],
        data: pieData(config, sourceData),
        label: { color: '#d6e4ff' },
      },
    ],
  };

  return React.createElement(MountChart, { option, width: attr.width, height: attr.height });
}

module.exports = PieChart;
