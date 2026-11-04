const React = require('react');
const echarts = require('echarts');

/**
 * Host-provided echarts. The bundle must not touch window/document itself;
 * echarts (injected by the editor) owns the DOM node handed to it.
 */
function MountChart({ option, width, height }) {
  const ref = React.useRef(null);

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    const chart = echarts.init(node);
    chart.setOption(option || {}, true);
    chart.resize();
    return () => {
      chart.dispose();
    };
  }, [option, width, height]);

  return React.createElement('div', {
    ref,
    style: { width: '100%', height: '100%' },
  });
}

module.exports = MountChart;
