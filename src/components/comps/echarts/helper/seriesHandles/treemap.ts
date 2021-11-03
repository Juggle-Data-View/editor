export default function treemap(seriesItem: any, sourceData: any[]) {
  seriesItem.data = sourceData.map((item: any) => {
    return {
      name: item.name,
      value: item[seriesItem.FieldName],
    };
  });
}
