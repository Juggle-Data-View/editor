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
    function formatTime(value) {
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
      formatTime,
      formatNumber,
      dataStatus: dataStatus2
    };
  }
});

// components/pie/index.jsx
var React = require("react");
var MountChart = require_mountChart();
var Unavailable = require_unavailable();
var { dataStatus } = require_format();
var palette = ["#4c8dff", "#3dd6c6", "#f5a623", "#f26b8a", "#b388ff", "#7bd389"];
function pieData(config, sourceData) {
  const slices = config && config.slices;
  if (Array.isArray(slices) && slices.length) {
    const row = sourceData && sourceData[0] || {};
    return slices.map((slice) => ({
      name: slice.name,
      value: Number(row[slice.field]) || 0
    }));
  }
  const rows = Array.isArray(sourceData) ? sourceData : [];
  return rows.map((row) => ({ name: row.name, value: Number(row.value) || 0 }));
}
function PieChart({ compData, sourceData }) {
  const config = compData && compData.config || {};
  const title = config.title || "\u997C\u56FE";
  const attr = compData.attr || {};
  if (dataStatus(sourceData) === "error") {
    return React.createElement(Unavailable, null);
  }
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
        data: pieData(config, sourceData),
        label: { color: "#d6e4ff" }
      }
    ]
  };
  return React.createElement(MountChart, { option, width: attr.width, height: attr.height });
}
module.exports = PieChart;
