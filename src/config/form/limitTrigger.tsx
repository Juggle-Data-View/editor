import { INodeCompProps, INodeConfig, INodeParams } from 'components/recursion';
import { FieldValidator } from 'formik';
import React, { useEffect, useState } from 'react';
import { Button, Dialog, InputGroup, Menu, MenuItem, Position } from '@blueprintjs/core';
import { Popover2 } from '@blueprintjs/popover2';
import { Control, FieldLabel } from 'components/form';
import global from 'utils/global';
import { nanocode } from 'utils';
import {
  addAndUpdateLimitCondition,
  addNotificationUsers,
  deleteNotificationUsers,
  getNotificationUserList,
} from 'utils/api';
import notice from 'utils/notice';
import AutoDVTable, { ColumnsType } from 'components/common/AutoDVTable';
import styled from 'styled-components';
import { getRealValue, IntervalType, sigleSideInterval } from 'utils/limitNotification';

export interface LimitTrigger {
  isShow: boolean; // 阈值控制
  limitTrigger: {
    conditionCode: string;
    intervalType: IntervalType;
    left: number;
    right: number;
    color: string;
    isTrigger: boolean;
    time: number;
    timeUnit: 'sec' | 'min';
  }[];
}

const Cell = styled.div`
  min-height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  .fc-head {
    width: 100%;
    text-align: left;
  }
  .field-collapse {
    width: 100%;
  }
  .item-label {
    text-align: left;
  }
  .timeOffset {
    display: flex;
  }
  .timeOffsetLabel {
    flex: 1;
  }
  .timeOffsetList {
    display: flex;
    flex: 4;
    flex-wrap: wrap;
    .bp3-control-group {
      margin: 2px;
      margin-left: 0px;
      margin-right: 5px;
      flex: 1;
    }
  }
`;

interface IntervalOptionsType {
  value: IntervalType;
  label: string;
}

interface ValidtorData {
  value: number[];
  index: number;
  intervalType: IntervalType;
}

interface ValidtorFunc {
  (val: any, props: INodeParams, flag: 'left' | 'right' | 'both', type?: IntervalType): ReturnType<FieldValidator>;
}

interface NotificationUserTableData {
  erp: string;
  name: string;
}

// const limitTypeCache: { [key: string]: IntervalType } = {};

export const IntervalOptions: IntervalOptionsType[] = [
  {
    value: 'close',
    label: '闭区间',
  },
  {
    value: 'equle',
    label: '等于',
  },
  {
    value: 'leftOpen',
    label: '左开右闭',
  },
  {
    value: 'rightOpen',
    label: '右开左闭',
  },
  {
    value: 'noMoreThan',
    label: '小于等于',
  },
  {
    value: 'noLessThan',
    label: '大于等于',
  },
  {
    value: 'less',
    label: '小于',
  },
  {
    value: 'over',
    label: '大于',
  },
  {
    value: 'open',
    label: '开区间',
  },
];

export const condition = (values: Omit<ValidtorData, 'index'>[], newItem: ValidtorData) => {
  const { value: newValue, intervalType: tempNewType, index: newIndex } = newItem;
  const [start, end] = getRealValue(newValue, tempNewType);

  return values.map((item, index) => {
    const { value, intervalType } = item;
    const [sStart, sEnd] = getRealValue(value, intervalType);

    if (newIndex === index) {
      // 更新项和与当前项相等，恒定为真
      return {
        index,
        condition: true,
      };
    }

    if (end < sStart) {
      return {
        index,
        condition: true,
      };
    }

    if (start > sEnd) {
      return {
        index,
        condition: true,
      };
    }

    return {
      index,
      condition: false,
    };
  });
};

const validator: ValidtorFunc = (val, { name, getValue, parentValue }, flag, type) => {
  const allValues: any[] = getValue(name, '../../');
  const intervalType = type || parentValue.intervalType;
  // const currentPath = resolveName(name, '../').split('.');
  const rightValue = parentValue.right;
  const leftValue = parentValue.left;
  const code = parentValue.conditionCode;
  const currentIndex = allValues.findIndex((item) => item.conditionCode === code);
  // const activeIndex = oldValue !== val ? currentIndex : -1;

  const values = (flag: 'left' | 'right' | 'both') => {
    //构造合法的区间值
    if (flag === 'left') {
      if (!isNaN(rightValue)) {
        return [val, rightValue];
      } else {
        return [val, Infinity];
      }
    } else if (flag === 'right') {
      if (!isNaN(leftValue)) {
        return [leftValue, val];
      } else {
        return [-Infinity, val];
      }
    } else {
      return val;
    }
  };
  if (!sigleSideInterval.includes(intervalType)) {
    if (flag === 'left') {
      if (val > rightValue) return '区间左边界不能大于右边界';
    } else {
      if (val < leftValue) return '区间右边界不能小于左边界';
    }
  }

  const newData: ValidtorData = {
    value: values(flag),
    index: currentIndex,
    intervalType,
  };

  const value = allValues.map((item: any) => ({
    value: [item.left, item.right],
    intervalType: item.intervalType,
  }));
  // debugger;
  const limitConiditon = condition(value, newData);

  const error = limitConiditon.map((item, index) => (!item.condition ? index + 1 : NaN)).filter((item) => !isNaN(item));

  if (error.length < 1) {
    return;
  } else {
    return `与第${error.join(',')}条件冲突`;
  }
};

const labelIsShow = ({ parentValue }: INodeParams): boolean => {
  const { intervalType } = parentValue;
  return !sigleSideInterval.includes(intervalType);
};

const UserList: React.FC<{
  isOpen: boolean;
  setOpen(param: boolean): void;
  option: {
    appId: number;
    canvasId: number;
    instCode: string;
    conditionCode: string;
  };
}> = (props) => {
  const [userList, setUserList] = useState<
    {
      accountName: string;
      id: number;
      loginAccount: string;
    }[]
  >([]);
  const [renderList, setRenderList] = useState<
    {
      accountName: string;
      id: number;
      loginAccount: string;
    }[]
  >([]);
  // const [pageSize, setPageSize] = useState<number>(0);
  // const [pageNo, setPageNo] = useState<number>(0);
  const [activePage, setActivePage] = useState<number>(0);

  const [userName, setUsernam] = useState<string>('');

  const { option, setOpen, isOpen } = props;

  useEffect(() => {
    getNotification();
  }, []); //eslint-disable-line

  const getNotification = async () => {
    try {
      const res = await getNotificationUserList({
        ...option,
        pageNo: 1,
        pageSize: 500,
      });

      setUserList(res.content);
      setRenderList(res.content.slice(0, 10));
      // setPageNo(value.pageNo);
      // setPageSize(value.pageSize);
    } catch (error) {
      notice.error(error.message);
    }
  };

  const handleAdd = async (loginAccount: string) => {
    try {
      await addNotificationUsers({
        ...option,
        users: [loginAccount],
      });
      await getNotification();
    } catch (error) {
      notice.error(error.message);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteNotificationUsers({
        ...option,
        warningUserIds: [id],
      });
      await getNotification();
    } catch (error) {
      notice.error(error.message);
    }
  };

  const column: ColumnsType = [
    {
      title: 'erp',
      key: 'erp',
      render: (val, data) => {
        return <Cell>{data['erp']}</Cell>;
      },
    },
    {
      title: '姓名',
      key: 'name',
      render: (val, data) => {
        return <Cell>{data['name']}</Cell>;
      },
    },
    {
      title: '操作',
      key: 'operation',
      render: (vak, record, index) => (
        <Cell>
          <Button onClick={() => handleDelete(userList[index].id)}>删除</Button>
        </Cell>
      ),
    },
  ];

  const tableData: NotificationUserTableData[] = renderList.map((item) => ({
    erp: item.loginAccount,
    name: item.accountName,
  }));
  const len = userList.length || 0;

  return (
    <Dialog isOpen={isOpen} onClose={() => setOpen(false)} title="用户管理">
      <div>
        <FieldLabel label="用户名称">
          <div style={{ display: 'flex' }}>
            <InputGroup onBlur={(e) => setUsernam(e.target.value)} placeholder="请输入erp" />
            <Button onClick={() => handleAdd(userName)}>添加</Button>
          </div>
        </FieldLabel>
      </div>
      <div>
        <AutoDVTable<NotificationUserTableData> columns={column} dataSource={tableData} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: '10px 10px 0px 0px' }}>
        <Popover2
          position={Position.BOTTOM}
          disabled={userList.length < 2}
          content={
            <Menu style={{ maxHeight: 240, overflow: 'auto' }}>
              {len !== 0 ? (
                new Array(Math.floor(len / 10) + 1).fill('').map((item, index) => (
                  <MenuItem
                    key={index}
                    text={`第${index + 1}页`}
                    active={index === activePage}
                    onClick={() => {
                      setActivePage(index);
                      setRenderList(userList.slice(index * 10, (index + 1) * 10));
                    }}
                  />
                ))
              ) : (
                <MenuItem text={'无用户数据'} />
              )}
            </Menu>
          }
        >
          <Button
            alignText="left"
            rightIcon="double-caret-vertical"
            disabled={len < 2}
            text={`第${activePage + 1}页`}
          />
        </Popover2>
        <div style={{ marginLeft: '10px', marginRight: '8' }}>共{userList.length}人</div>
      </div>
    </Dialog>
  );
};

interface TriggerSwitchType extends INodeParams {
  switchProps: INodeCompProps;
}

const TriggerSwitch: React.FC<TriggerSwitchType> = (node) => {
  const { switchProps: props, value, getValue, rootValue, name } = node;
  const code = rootValue.code;
  const conditionCode = getValue(name, '../conditionCode');
  const time = getValue(name, '../time');
  const timeUnit = getValue(name, '../timeUnit');
  const [isOpen, setOpen] = useState(false);
  useEffect(() => {
    addAndUpdateLimitCondition({
      appId: global.appId as number,
      canvasId: global.canvasId as number,
      instCode: code,
      conditionCode,
      status: value ? 1 : 0,
      intervalTime: time,
      timeUnit: timeUnit,
    }).catch((err) => {
      console.log(err);

      // notice.error(err);
    });
  }, [value, code, conditionCode, timeUnit, time]);

  const handleClick = () => {
    setOpen(!isOpen);
  };

  return (
    <>
      <div style={{ display: 'flex' }}>
        <Control.Switch {...props} />
        {value ? <Button onClick={handleClick}>修改通知用户</Button> : null}
      </div>
      {isOpen ? (
        <UserList
          isOpen={isOpen}
          setOpen={setOpen}
          option={{
            appId: global.appId as number,
            canvasId: global.canvasId as number,
            instCode: code,
            conditionCode,
          }}
        />
      ) : null}
    </>
  );
};

const dictionary: INodeConfig[] = [
  {
    name: 'isShow',
    label: '显示阈值标识',
    type: 'switch',
  },
  {
    name: 'limitTrigger[]',
    type: 'array',
    show: ({ parentValue }) => {
      return parentValue.isShow;
    },
    props: ({ rootValue }) => {
      return {
        itemTitle: (item, index) => {
          return `阈值条件-${index}`;
        },
        limit: 5,
        label: '指标阈值设置',
        labelProps: {
          width: '42%',
        },
        actions: ['delete'],
        onBeforeAdd: (item) => {
          const code = rootValue.code;
          return {
            ...item,
            conditionCode: nanocode(code),
            left: null,
            right: null,
          };
        },
      };
    },
    children: [
      {
        name: 'intervalType',
        type: 'select',
        label: '区间类型',
        props: {
          options: IntervalOptions,
          useFastField: false,
        },
        validate: (val, param) => {
          const needValid = param.getValue(param.name, '../../../isShow');
          if (!needValid) {
            return;
          }
          if (sigleSideInterval.includes(val)) {
            return validator([param.parentValue.left], param, 'both', val);
          } else {
            return validator([param.parentValue.left, param.parentValue.right], param, 'both', val);
          }
        },
      },
      {
        name: 'left',
        type: 'number',
        label: (param) => {
          const isShow = labelIsShow(param);

          return isShow
            ? '左边界'
            : IntervalOptions.find((item) => item.value === param.parentValue.intervalType)?.label;
        },
        validate: (val, param) => {
          const needValid = param.getValue(param.name, '../../../isShow');

          if (needValid) {
            return validator(val, param, 'left');
          }
        },
        props: {
          useFastField: false,
        },
      },
      {
        name: 'right',
        type: 'number',
        label: '右边界',
        validate: (val, param) => {
          const needValid = param.getValue(param.name, '../../../isShow');
          if (needValid) return validator(val, param, 'right');
        },
        show: labelIsShow,
        props: {
          useFastField: false,
        },
      },
      {
        name: 'color',
        type: 'color',
        label: '阈值标识颜色',
        labelProps: {
          width: '42%',
        },
      },
      {
        name: 'isTrigger',
        type: 'component',
        label: '咚咚信息推送',
        labelProps: {
          width: '42%',
        },
        props: (node) => {
          return {
            render: (props) => <TriggerSwitch {...node} switchProps={props} />,
          };
        },
      },
      {
        name: 'time',
        type: 'number',
        label: '推送时间间隔',
        labelProps: {
          width: '42%',
          help: <div style={{ width: 100 }}>单元格在推送时间间隔内多次命中阈值条件，仅推送一次咚咚信息</div>,
        },
        props: {
          bp: {
            min: 0,
          },
        },
        show: (props) => props.parentValue.isTrigger,
      },
      {
        name: 'timeUnit',
        type: 'select',
        label: '推送时间单位',
        labelProps: {
          width: '42%',
        },
        props: {
          options: [
            {
              label: '分钟',
              value: 'min',
            },
            {
              label: '秒',
              value: 'sec',
            },
          ],
        },
        show: (props) => props.parentValue.isTrigger,
      },
    ],
  },
];

export default dictionary;
