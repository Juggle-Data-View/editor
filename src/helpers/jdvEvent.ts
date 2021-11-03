/**
 * 交互变量
 */

import { debounce } from 'lodash';
import emitter, { eventName } from 'utils/events';
import { createNextState as produce } from '@reduxjs/toolkit';
import { TriggerType } from 'config/const';
import { isRelease } from 'utils';

const UPDATE = Symbol('update');

export type Condition = {
  code: string;
  name: string;
  type: TriggerType;
};

export class AutoDVEvent {
  // 交互触发者
  triggers: AutoDV.Triggers = Object.create(null);

  // ⚠️ 注意：
  // recivers最终会在组件之间传递。所以使用immer减少rerender
  recivers: AutoDV.Recivers = Object.create(null);

  /**
   * 判断 trigger type 的类型是否为 URL 类型
   * @param triggerType
   */
  static isURLTrigger(triggerType: TriggerType) {
    return triggerType === 'global_url_params';
  }

  private delete_triggers: string[] = [];

  addTrigger(varName: string, trigger: AutoDV.Trigger, condition?: Condition) {
    // 如果 varName 是一个带冒号的变量，就不触发 addTriggers
    if (this.isEventVar(varName)) {
      return;
    }
    // 添加 varName 到 triggers 之前，先使用深度比较删除之前添加的 varName
    if (condition) {
      for (const k in this.triggers) {
        if (this.deepEqual(k, condition)) {
          delete this.triggers[k];
        }
      }
    }
    this.triggers[varName] = trigger;
    this[UPDATE]();
  }

  removeTrigger(varName: string) {
    this.delete_triggers.push(varName);
    this[UPDATE]();
  }

  removeTriggerByCode(code: string) {
    Object.keys(this.triggers).forEach((varName) => {
      const trigger = this.triggers[varName];
      if (trigger.code === code) {
        this.removeTrigger(varName);
      }
    });
  }

  /**
   * 设置变量的值
   * @param varName 变量名称 or 携带:（冒号）的变量名称
   * @param value 变量值
   */
  setTriggerValue(varName: string, value: any) {
    if (typeof varName !== 'string' || !varName) {
      return;
    }
    const _varName = this.isEventVar(varName) ? varName.slice(1) : varName;
    if (this.hasTrigger(_varName)) {
      this.triggers[_varName].value = value;
      this[UPDATE]();
    } else {
      console.warn('setTriggerValue failed: 变量名称不存在');
    }
  }

  /**
   * 获取所有的交互变量名称
   */
  getTiggersName(): string[] {
    return Object.keys(this.triggers);
  }

  addReciver(code: string, reciver: AutoDV.Reciver[]) {
    this.recivers = produce(this.recivers, (draft) => {
      draft[code] = reciver;
    });
    this[UPDATE]();
  }

  /**
   * 根据trigger生成对应的reciver
   * 使用 Symbol 创建私有方法
   */
  [UPDATE] = debounce(() => {
    this.recivers = produce(this.recivers, (draft) => {
      Object.keys(draft).forEach((code) => {
        draft[code].forEach((field: AutoDV.Reciver) => {
          const trigger = this.triggers[field.triggerValue];
          if (trigger) {
            field.value = trigger.value;
            field.triggerName = trigger.name;
            if (!trigger.recivers.includes(code)) {
              trigger.recivers.push(code);
            }
          }
          if (this.delete_triggers.includes(field.triggerValue)) {
            field.value = '';
            field.triggerName = '';
          }
        });
      });
    });

    this.delete_triggers.forEach((varName) => delete this.triggers[varName]);
    this.delete_triggers = [];

    if (!isRelease) {
      console.log(this);
    }

    emitter.emit(eventName.autoDVEventUpdate, this.recivers);
  }, 50);

  /** utils */

  /**
   * 判断变量名是否存在
   * @param varName 变量名称
   * @param condition [可选]，深度比较，使用组件实例code、事件类型、交互变量字段名称三个条件比较
   */
  hasTrigger(varName: string, condition?: Condition) {
    if (condition) {
      return this.deepEqual(varName, condition);
    }
    return varName in this.triggers;
  }

  /**
   * 深度比较，这个条件可以判断全局变量的唯一性。
   * @param varName
   * @param condition
   */
  deepEqual(varName: string, condition: Condition) {
    const { code, type, name } = condition;
    const t = this.triggers[varName];
    return t && t.code === code && t.type === type && t.name === name;
  }

  /**
   * 判断传入的名称是不是变量类型（以英文冒号开头）
   * @param name 名称
   */
  isEventVar(name: string) {
    return typeof name === 'string' && name.indexOf(':') === 0;
  }

  isTriggerVar(varName: string) {
    return this.isEventVar(varName) && this.hasTrigger(varName.slice(1));
  }
}

export default new AutoDVEvent();
