import { timeAxisHandle } from './timeLine';

const getAxisData = (sourceData: any[], axis: any[]) => {
  return axis
    ? axis.map((axisItem) => {
        const { timeStamp } = axisItem;
        const tempData = sourceData.map((item: any) => {
          return {
            value: item[axisItem.fieldName || axisItem.name],
          };
        });

        const data = timeAxisHandle(axisItem, tempData);
        return timeStamp ? data : tempData;
      })
    : [];
};
export default getAxisData;
