export default function general(seriesItem: any, sourceData: any[], axisDatas: any[][]) {
  const seriesIndex = seriesItem.seriesIndex === undefined ? 0 : seriesItem.seriesIndex;
  const axisData = axisDatas[seriesIndex];

  seriesItem.data = sourceData.map((item: any, index) => {
    return {
      name: axisData[index],
      value: item[seriesItem.FieldName],
    };
  });
}
