/* Juggle remote component. require() is injected by the editor sandbox. */
"use strict";
var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// components/lib/mountChart.jsx
var require_mountChart = __commonJS({
  "components/lib/mountChart.jsx"(exports2, module2) {
    "use strict";
    var React2 = require("react");
    var echarts = require("echarts");
    function MountChart2({ option, width, height }) {
      const ref = React2.useRef(null);
      React2.useEffect(() => {
        const node = ref.current;
        if (!node) return void 0;
        const chart = echarts.init(node);
        chart.setOption(option || {}, true);
        chart.resize();
        return () => {
          chart.dispose();
        };
      }, [option, width, height]);
      return React2.createElement("div", {
        ref,
        style: { width: "100%", height: "100%" }
      });
    }
    module2.exports = MountChart2;
  }
});

// components/base-line/index.jsx
var React = require("react");
var MountChart = require_mountChart();
function BaseLine({ compData, sourceData }) {
  const title = compData.config && compData.config.title || "\u6298\u7EBF\u56FE";
  const rows = Array.isArray(sourceData) ? sourceData : [];
  const attr = compData.attr || {};
  const option = {
    backgroundColor: "transparent",
    title: {
      text: title,
      left: "center",
      textStyle: { color: "#d6e4ff", fontSize: 16, fontWeight: 500 }
    },
    tooltip: { trigger: "axis" },
    grid: { left: 48, right: 16, top: 48, bottom: 32 },
    xAxis: {
      type: "category",
      data: rows.map((row) => row.x),
      axisLabel: { color: "#9bb0c9" },
      axisLine: { lineStyle: { color: "#3d5a80" } }
    },
    yAxis: {
      type: "value",
      axisLabel: { color: "#9bb0c9" },
      splitLine: { lineStyle: { color: "rgba(255,255,255,0.08)" } }
    },
    series: [
      {
        type: "line",
        smooth: true,
        data: rows.map((row) => row.y),
        symbol: "circle",
        symbolSize: 8,
        itemStyle: { color: "#3dd6c6" },
        lineStyle: { color: "#3dd6c6", width: 2 },
        areaStyle: { color: "rgba(61,214,198,0.18)" }
      }
    ]
  };
  return React.createElement(MountChart, { option, width: attr.width, height: attr.height });
}
module.exports = BaseLine;
