/** Valid bundle whose render throws. The editor error boundary must catch it. */
function BrokenWidget() {
  throw new Error('deliberately broken component: render failed');
}

module.exports = BrokenWidget;
