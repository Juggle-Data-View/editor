const universalGrid = (grid: any, echarts: any) => {
  const width = 40;
  if (echarts.yAxis && echarts.yAxis[0].showWay !== 'sigle' && echarts.yAxis[0].showWay) {
    return Array.from(['', '', '']).map((item, index) => {
      const result: any = {
        top: grid.top,
        bottom: grid.bottom,
        containLabel: true,
      };
      if (index === 0) {
        result.right = grid.right;
        result.width = `${width + 5}%`;
      }
      if (index === 1) {
        result.left = `${grid.left + 30}%`;
        result.width = '0%';
      }
      if (index === 2) {
        result.left = grid.left;
        result.width = `${width + 5}%`;
      }
      return result;
    });
  } else {
    return grid;
  }
};

export default universalGrid;
