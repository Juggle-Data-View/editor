const isHandleFunctionString = (fnString: string) => {
  return fnString.includes('function');
};

const generalTooltip = (toolTip: any) => {
  // toolTip.className = ''

  if (toolTip.formatter && isHandleFunctionString(toolTip.formatter)) {
    toolTip.formatter = new Function(`return ${toolTip.formatter}`)(); //eslint-disable-line
  }
  return toolTip;
};

export default generalTooltip;
