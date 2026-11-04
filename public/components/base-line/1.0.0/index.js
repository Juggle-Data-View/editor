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

// components/lib/unavailable.jsx
var require_unavailable = __commonJS({
  "components/lib/unavailable.jsx"(exports2, module2) {
    "use strict";
    var React2 = require("react");
    function Unavailable2({ message }) {
      return React2.createElement(
        "div",
        {
          "data-data-status": "unavailable",
          style: {
            boxSizing: "border-box",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#9bb0c9",
            border: "1px dashed rgba(155,176,201,0.45)",
            background: "rgba(8, 18, 32, 0.35)",
            fontSize: 16
          }
        },
        message || "data unavailable"
      );
    }
    module2.exports = Unavailable2;
  }
});

// components/lib/format.jsx
var require_format = __commonJS({
  "components/lib/format.jsx"(exports2, module2) {
    "use strict";
    var NETWORKS = {
      "eip155:8453": "Base",
      "eip155:42161": "Arbitrum One",
      "eip155:84532": "Base Sepolia"
    };
    function networkLabel(value) {
      if (value == null || value === "") return "";
      return NETWORKS[value] || String(value);
    }
    function formatTime2(value) {
      const time = Date.parse(value);
      if (Number.isNaN(time) || String(value).indexOf("T") === -1) {
        return value == null ? "" : String(value);
      }
      return new Date(time).toISOString().slice(5, 16).replace("T", " ");
    }
    function formatNumber(value) {
      const numeric = Number(value);
      if (!Number.isFinite(numeric) || value === "" || value == null) {
        return value == null ? "" : String(value);
      }
      if (typeof value === "string" && value.indexOf(".") !== -1) {
        return value;
      }
      return numeric.toLocaleString("en-US");
    }
    function dataStatus2(sourceData) {
      return sourceData && sourceData.__status || "ready";
    }
    module2.exports = {
      networkLabel,
      formatTime: formatTime2,
      formatNumber,
      dataStatus: dataStatus2
    };
  }
});

// components/base-line/index.jsx
var React = require("react");
var MountChart = require_mountChart();
var Unavailable = require_unavailable();
var { formatTime, dataStatus } = require_format();
function BaseLine({ compData, sourceData }) {
  const title = compData.config && compData.config.title || "\u6298\u7EBF\u56FE";
  const attr = compData.attr || {};
  if (dataStatus(sourceData) === "error") {
    return React.createElement(Unavailable, null);
  }
  const rows = (Array.isArray(sourceData) ? sourceData : []).map((row) => ({ x: row.x, y: Number(row.y) })).filter((row) => row.x != null && row.x !== "").sort((a, b) => String(a.x).localeCompare(String(b.x)));
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
      data: rows.map((row) => formatTime(row.x)),
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
