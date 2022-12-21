export default function radar(seriesItem: any, sourceData: any[], echartOption: any) {
  echartOption.radar.indicator = echartOption.radar.indicator.map((item: any) => {
    item.max = echartOption.radar.max;
    item.min = echartOption.radar.min;
    return item;
  });
  if (!echartOption.legend.data) {
    echartOption.legend.data = [];
  }
  echartOption.legend.data = Array.from(new Set([...echartOption.legend.data, seriesItem.name || '']));
  const value: { name: string; value: string | number }[] = [];
  sourceData.forEach((item) => {
    value.push(item[seriesItem.FieldName]);
    if (seriesItem.data) {
      seriesItem.data.push({
        name: seriesItem.FieldName,
        value: value,
      });
    } else {
      seriesItem.data = [
        {
          name: seriesItem.FieldName,
          value: value,
        },
      ];
    }
  });
}
