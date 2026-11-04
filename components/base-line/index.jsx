const React = require('react');
const MountChart = require('../lib/mountChart.jsx');
const Unavailable = require('../lib/unavailable.jsx');
const { formatTime, dataStatus } = require('../lib/format.jsx');

function BaseLine({ compData, sourceData }) {
  const title = (compData.config && compData.config.title) || '折线图';
  const attr = compData.attr || {};
  if (dataStatus(sourceData) === 'error') {
    return React.createElement(Unavailable, null);
  }
  const rows = (Array.isArray(sourceData) ? sourceData : [])
    .map((row) => ({ x: row.x, y: Number(row.y) }))
    .filter((row) => row.x != null && row.x !== '')
    .sort((a, b) => String(a.x).localeCompare(String(b.x)));
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
      data: rows.map((row) => formatTime(row.x)),
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
        type: 'line',
        smooth: true,
        data: rows.map((row) => row.y),
        symbol: 'circle',
        symbolSize: 8,
        itemStyle: { color: '#3dd6c6' },
        lineStyle: { color: '#3dd6c6', width: 2 },
        areaStyle: { color: 'rgba(61,214,198,0.18)' },
      },
    ],
  };

  return React.createElement(MountChart, { option, width: attr.width, height: attr.height });
}

module.exports = BaseLine;
