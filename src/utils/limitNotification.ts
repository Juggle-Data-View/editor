export type SigleSideInterval = 'over' | 'less' | 'noMoreThan' | 'noLessThan' | 'equle';

export type DoubleSideInterval = 'close' | 'open' | 'rightOpen' | 'leftOpen';

export type IntervalType = SigleSideInterval | DoubleSideInterval;

export interface TriggerCondition {
  intervalType: IntervalType;
  left: number;
  right: number;
  isTrigger: boolean;
  conditionCode: string;
  color: string;
}

const intervalFormat = (value: number[], type: IntervalType): number[] => {
  const [left, right] = value;

  if (type === 'equle') {
    return value;
  }
  if (type === 'leftOpen') {
    return [left + 0.00001, right];
  }
  if (type === 'less') {
    return [left, right - 0.0001];
  }
  if (type === 'over') {
    return [left + 0.00001, right];
  }
  if (type === 'noLessThan') {
    return value;
  }
  if (type === 'noMoreThan') {
    return value;
  }
  if (type === 'open') {
    return [left + 0.00001, right - 0.00001];
  }
  if (type === 'rightOpen') {
    return [left, right - 0.00001];
  }
  return value.length > 1 ? value : [value[0], value[0]];
};

export const sigleSideInterval: SigleSideInterval[] = ['over', 'less', 'noMoreThan', 'noLessThan', 'equle'];

export const getRealValue = (value: number[], type: IntervalType) => {
  if (type === 'equle') {
    return [value[0], value[0]];
  } else if (sigleSideInterval.includes(type as SigleSideInterval)) {
    //"over", "less", "noMoreThan", "noLessThan"
    if (type === 'over' || type === 'noLessThan') {
      return intervalFormat([value[0], Infinity], type);
    }
    if (type === 'less' || type === 'noMoreThan') {
      // return [-Infinity, value[0]];
      return intervalFormat([-Infinity, value[0]], type);
    }

    return [-Infinity, Infinity];
  } else {
    return intervalFormat(value, type);
  }
};

export const getTriggerCondition = (values: TriggerCondition[], value: number) => {
  const result = values.findIndex((item) => {
    const { left, right, intervalType } = item;
    const valueInterval = [left, right].filter((item) => !(isNaN(item) || item === undefined));
    const realValueInterval = getRealValue(valueInterval, intervalType);
    if (intervalType === 'equle') {
      return value <= realValueInterval[1] && value >= realValueInterval[0];
    } else if (intervalType === 'less') {
      return value < realValueInterval[1] && value > realValueInterval[0];
    } else if (intervalType === 'close') {
      return value <= realValueInterval[1] && value >= realValueInterval[0];
    } else if (intervalType === 'open') {
      return value < realValueInterval[1] && value > realValueInterval[0];
    } else if (intervalType === 'over') {
      return value < realValueInterval[1] && value > realValueInterval[0];
    } else if (intervalType === 'leftOpen') {
      return value < realValueInterval[1] && value >= realValueInterval[0];
    } else if (intervalType === 'noLessThan') {
      return value < realValueInterval[1] && value >= realValueInterval[0];
    } else if (intervalType === 'noMoreThan') {
      return value <= realValueInterval[1] && value > realValueInterval[0];
    } else {
      return value <= realValueInterval[1] && value > realValueInterval[0];
    }
  });
  return result === -1
    ? undefined
    : {
        ...values[result],
        index: result,
      };
};

export const getNotificationContent = (type: IntervalType, left?: number, right?: number) => {
  if (type === 'equle') {
    return `等于,${left}`;
  }
  if (type === 'leftOpen') {
    return `左开右闭,左边界：${left}，右边界：${right}`;
  }
  if (type === 'less') {
    return `小于,${right}`;
  }
  if (type === 'over') {
    return `大于,${left}`;
  }
  if (type === 'noLessThan') {
    return `大于等于,${left}`;
  }
  if (type === 'noMoreThan') {
    return `小于等于,${right}`;
  }
  if (type === 'open') {
    return `开区间,左边界：${left}，右边界：${right}`;
  }
  if (type === 'rightOpen') {
    return `右开左闭,左边界：${left}，右边界：${right}`;
  }
  return `闭区间,左边界：${left}，右边界：${right}`;
};
