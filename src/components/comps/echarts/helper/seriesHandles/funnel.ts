export default function funnel(seriesItem: any, sourceData: any[]) {
  const min = Math.min(...(sourceData.map((item) => Number(item[seriesItem.FieldName])) as any));
  const minLength = (min + '').length;
  seriesItem.max = Math.max(...(sourceData.map((item) => Number(item[seriesItem.FieldName])) as any));
  seriesItem.min =
    Math.min(...(sourceData.map((item) => Number(item[seriesItem.FieldName])) as any)) + -10 * (minLength - 1);
  seriesItem.data = sourceData.map((item: any) => {
    return {
      name: item.name,
      value: item[seriesItem.FieldName],
    };
  });
}
