const React = require('react');
const MountChart = require('../lib/mountChart.jsx');

function BaseBar({ compData, sourceData }) {
  const title = (compData.config && compData.config.title) || '柱状图';
  const rows = Array.isArray(sourceData) ? sourceData : [];
  const attr = compData.attr || {};
  const option = {
    backgroundColor: 'transparent',
    title: {
      text: title,
      left: 'center',
      textStyle: { color: '#d6e4ff', fontSize: 16, fontWeight: 500 },
    },
    tooltip: { trigger: 'axis' },
    grid: { left: 48, right: 16, top: 48, bottom: 32 },
    xAxis: {
      type: 'category',
      data: rows.map((row) => row.x),
      axisLabel: { color: '#9bb0c9' },
      axisLine: { lineStyle: { color: '#3d5a80' } },
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#9bb0c9' },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.08)' } },
    },
    series: [
      {
        type: 'bar',
        data: rows.map((row) => row.y),
        itemStyle: { color: '#4c8dff', barBorderRadius: [6, 6, 0, 0] },
        barWidth: '46%',
      },
    ],
  };

  return React.createElement(MountChart, { option, width: attr.width, height: attr.height });
}

module.exports = BaseBar;
