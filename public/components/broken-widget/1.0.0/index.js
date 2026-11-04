/* Juggle remote component. require() is injected by the editor sandbox. */
"use strict";

// components/broken-widget/index.jsx
function BrokenWidget() {
  throw new Error("deliberately broken component: render failed");
}
module.exports = BrokenWidget;
