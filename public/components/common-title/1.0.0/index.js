/* Juggle remote component. require() is injected by the editor sandbox. */
"use strict";

// components/common-title/index.jsx
var React = require("react");
function boundText(config, sourceData, title) {
  const status = sourceData && sourceData.__status || "ready";
  if (!config.prefix && !config.fallback) {
    return sourceData && typeof sourceData.getSourceDataValue === "function" ? sourceData.getSourceDataValue("value", title) : title;
  }
  if (status === "loading") return `${config.prefix || ""}\u2026`;
  if (status === "error") return config.fallback || "data unavailable";
  const raw = sourceData && typeof sourceData.getSourceDataValue === "function" ? sourceData.getSourceDataValue("value", "") : "";
  if (raw === "" || raw == null) return config.fallback || title;
  return `${config.prefix || ""}${raw}${config.suffix || ""}`;
}
function CommonTitle({ compData, sourceData }) {
  const config = compData.config || {};
  const style = config.style || {};
  const link = config.link || {};
  const title = config.title;
  const value = boundText(config, sourceData, title);
  const text = link.url ? React.createElement(
    "a",
    {
      href: link.url,
      target: link.isBlank ? "_blank" : "_self",
      rel: "noreferrer",
      style: { color: "inherit", textDecoration: "none" }
    },
    value
  ) : value;
  return React.createElement(
    "div",
    {
      style: {
        display: style.display || "flex",
        width: "100%",
        height: "100%",
        wordBreak: "break-all",
        color: style.color,
        fontSize: style.fontSize,
        lineHeight: style.lineHeight,
        fontWeight: style.fontWeight,
        letterSpacing: style.letterSpacing,
        justifyContent: style.justifyContent,
        alignItems: style.alignItems,
        textAlign: style.textAlign
      }
    },
    text
  );
}
module.exports = CommonTitle;
