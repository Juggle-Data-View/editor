const React = require('react');
const MountChart = require('../lib/mountChart.jsx');

const palette = ['#4c8dff', '#3dd6c6', '#f5a623', '#f26b8a', '#b388ff', '#7bd389'];

function PieChart({ compData, sourceData }) {
  const title = (compData.config && compData.config.title) || '饼图';
  const rows = Array.isArray(sourceData) ? sourceData : [];
  const attr = compData.attr || {};
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
        data: rows.map((row) => ({ name: row.name, value: row.value })),
        label: { color: '#d6e4ff' },
      },
    ],
  };

  return React.createElement(MountChart, { option, width: attr.width, height: attr.height });
}

module.exports = PieChart;
