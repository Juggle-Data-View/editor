export default function pie(seriesItem: any, sourceData: any[]) {
  seriesItem.radius[0] = seriesItem.radius[0] + '%';
  seriesItem.radius[1] = seriesItem.radius[1] + '%';
  seriesItem.data = sourceData.map((item: any) => {
    return {
      name: item.name,
      value: item.value,
    };
  });
}
