// import dayjs from 'dayjs';
// import dayjs from 'dayjs';
import { EChartOption } from 'echarts';

interface ExtensionAxis extends EChartOption.XAxis {
  isFixedTimeRange?: boolean;
  timeRangeType?: 'custom' | 'fixedStart' | 'today';
  timeStamp: '1m' | '5m' | '1h' | '3h' | '1d' | '1w' | number;
  timeStack: string;
  timeStart: string;
  timeEnd: string;
}

const getOffsetTime = (step: ExtensionAxis['timeStamp']) => {
  switch (step) {
    case '1d':
      return 1000 * 60 * 60 * 24;
    case '1h':
      return 1000 * 60 * 60;
    case '1m':
      return 1000 * 60;
    case '1w':
      return 1000 * 60 * 60 * 24 * 7;
    case '3h':
      return 1000 * 60 * 60 * 3;
    case '5m':
      return 1000 * 60 * 5;
    default:
      return step;
  }
};

const calcOffsetTime = (stamp: number | string) => {
  if (typeof stamp === 'number') {
    return stamp;
  } else {
    const stampMatch = stamp.match(/d|h|m|w/);
    const countMatch = stamp.match(/\d+/);
    if (!stampMatch || !countMatch) {
      return Number(stamp);
    }
    const count = Number(countMatch[0]);
    const unit = stampMatch && stampMatch[0];

    switch (unit) {
      case 'd':
        return 1000 * 60 * 60 * 24 * count;
      case 'h':
        return 1000 * 60 * 60 * 24 * count;
      case 'm':
        return 1000 * 60 * count;
      case 'w':
        return 1000 * 60 * 60 * 24 * 7 * count;

      default:
        return Number(stamp);
    }
  }
};

const getTimeRange = (
  data: {
    value: number | '';
  }[],
  start: number,
  step: ExtensionAxis['timeStamp'],
  end: number
) => {
  const offsetTime = getOffsetTime(step);
  const timeGap = end - start;
  const isValid = data[0] && timeGap / offsetTime >= 1 && Number(end) > Number(data[0].value);

  // const numOfTimePoint = isValid ? 1 : timeGap / offsetTime;
  // const
  const result: {
    value: number | '';
  }[] = [];
  if (isValid) {
    const formatData = data.filter((item) => {
      const val = Number(item.value);
      return Number(start) <= val && Number(end) >= val;
    });
    let tempTimeNode: {
      value: number | '';
    } = { value: formatData[0] && formatData[0].value };
    for (let index = 0; index < formatData.length; index++) {
      const item = formatData[index];
      if (index === 0) {
        // tempTimeNode = item;
        result.push(item);
        continue;
      }
      if (Number(item.value) >= Number(tempTimeNode.value) + offsetTime) {
        tempTimeNode = item;
        result.push(item);
      } else {
        if (index !== 0) {
          item.value = '';
        }
        // result.push(item);
      }
    }
  }

  return result;
};

const formatDate = (data: { value: number | '' }[]) => {
  return data.map((item) => {
    return {
      value: item.value,
    };
  });
};

export const timeAxisHandle = (
  axis: ExtensionAxis,
  data: {
    value: number | '';
  }[]
) => {
  const { isFixedTimeRange, timeRangeType, timeStamp, timeEnd, timeStart, timeStack } = axis;
  if (!timeStamp || !timeRangeType || isFixedTimeRange === undefined) {
    // 非时间轴，不需要特殊处理
    return formatDate(data);
  }
  const start = new Date(timeStart).getTime();

  if (isFixedTimeRange) {
    const end = timeRangeType === 'custom' ? new Date(timeEnd).getTime() : start + calcOffsetTime(timeStack);

    return formatDate(getTimeRange(data, start, timeStamp, end));
  } else {
    return formatDate(
      getTimeRange(data, start, timeStamp, data[data.length - 1] && Number(data[data.length - 1].value))
    );
  }
};
