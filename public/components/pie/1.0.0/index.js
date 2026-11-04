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

// components/pie/index.jsx
var React = require("react");
var MountChart = require_mountChart();
var palette = ["#4c8dff", "#3dd6c6", "#f5a623", "#f26b8a", "#b388ff", "#7bd389"];
function PieChart({ compData, sourceData }) {
  const title = compData.config && compData.config.title || "\u997C\u56FE";
  const rows = Array.isArray(sourceData) ? sourceData : [];
  const attr = compData.attr || {};
  const option = {
    backgroundColor: "transparent",
    color: palette,
    title: {
      text: title,
      left: "center",
      textStyle: { color: "#d6e4ff", fontSize: 16, fontWeight: 500 }
    },
    tooltip: { trigger: "item" },
    legend: {
      bottom: 0,
      textStyle: { color: "#9bb0c9" }
    },
    series: [
      {
        type: "pie",
        radius: ["42%", "68%"],
        center: ["50%", "48%"],
        data: rows.map((row) => ({ name: row.name, value: row.value })),
        label: { color: "#d6e4ff" }
      }
    ]
  };
  return React.createElement(MountChart, { option, width: attr.width, height: attr.height });
}
module.exports = PieChart;
