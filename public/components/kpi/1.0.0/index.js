/* Juggle remote component. require() is injected by the editor sandbox. */
"use strict";
var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

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
    function formatNumber2(value) {
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
      formatNumber: formatNumber2,
      dataStatus: dataStatus2
    };
  }
});

// components/kpi/index.jsx
var React = require("react");
var { formatNumber, dataStatus } = require_format();
function KPI({ compData, sourceData }) {
  const config = compData && compData.config || {};
  const status = dataStatus(sourceData);
  let value = "\u2026";
  if (status === "error") {
    value = "data unavailable";
  } else if (status === "ready") {
    const raw = sourceData && sourceData.getSourceDataValue ? sourceData.getSourceDataValue("value", "\u2014") : "\u2014";
    value = `${config.prefix || ""}${formatNumber(raw)}${config.suffix || ""}`;
  }
  return React.createElement(
    "div",
    {
      "data-kpi": config.label || "",
      "data-data-status": status,
      style: {
        boxSizing: "border-box",
        width: "100%",
        height: "100%",
        padding: "16px 18px",
        borderRadius: 12,
        background: "rgba(16, 36, 58, 0.92)",
        border: "1px solid rgba(125, 168, 214, 0.28)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between"
      }
    },
    React.createElement(
      "div",
      { style: { color: "#9bb0c9", fontSize: 14, letterSpacing: 0.2 } },
      config.label || ""
    ),
    React.createElement(
      "div",
      {
        style: {
          color: status === "error" ? "#f0c36a" : "#f4f8ff",
          fontSize: status === "error" ? 18 : 32,
          fontWeight: 650,
          lineHeight: 1.15
        }
      },
      value
    )
  );
}
module.exports = KPI;
