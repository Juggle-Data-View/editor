/**
 * 可视化组件外壳，处理组件的样式、事件。
 */

import React, { useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import cx from 'classnames';
import { useMount } from 'ahooks';
import { CompStyled } from './style';
import emitter, { eventName } from 'utils/events';
import { showContextMenu } from 'helpers/contextMenu';
import { appAction } from 'store/features/appSlice';
import { editorAction } from 'store/features/editorSlice';
import { RootState } from 'store';

interface Props {
  compData: AutoDV.Comp;
  index: number;
  isInEditor: boolean;
  isSelected?: boolean;
  children: React.ReactNode;
}

type CommonProps = {
  commonProps: React.HTMLAttributes<Element>;
};

const WrapperInEditor = (props: Props & CommonProps) => {
  const { compData, isSelected, index, commonProps } = props;
  const { compCode, code, hided, locked, config } = compData;
  const hoverIndex = useSelector((state: RootState) => state.editor.hoverIndex);
  const isSelecto = useSelector((state: RootState) => state.editor.isSelecto);
  const ref = useRef<any>();
  const dispatch = useDispatch();

  const handleHover = (index: number) => {
    return (e: React.MouseEvent<Element>) => {
      e.preventDefault();
      if (isSelected || isSelecto || locked) {
        return;
      }
      dispatch(editorAction.compHover([index]));
    };
  };

  const attrs: React.HTMLAttributes<Element> & {
    'data-selecto'?: string;
  } = {
    className: cx([compCode], {
      '--selected': isSelected,
      '--locked': locked,
      '--hover': hoverIndex.includes(index),
      '--none': config.groupCode,
    }),
    onClick: (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation(); // 阻止冒泡，防止多选时触发上层的 取消选中
      dispatch(appAction.selectComp({ code }));
    },

    /**
     * 右键是触发组件选中，真实的右键功能冒泡到上层CanvasWrappper实现
     * 原因是：这里只能触发单个组件的右键，组件多选时无效
     */
    onContextMenu: (e: React.MouseEvent) => {
      e.preventDefault();
      if (!isSelected) {
        dispatch(appAction.selectComp({ code }));
        showContextMenu(e);
      }
    },
    onMouseEnter: handleHover(index),
    onMouseLeave: handleHover(-1),
  };

  // 判断框选目标：只有元素没有子分组时才会被框选（分组时只框选祖先组件）
  if (typeof compData.config.groupCode === 'undefined' && !locked && !hided) {
    attrs['data-selecto'] = '1';
  }

  useMount(() => {
    if (ref.current) {
      emitter.emit(eventName.notifyCompMounted, code, Date.now());
    }
  });

  return (
    <CompStyled {...commonProps} ref={ref} {...attrs}>
      {props.children}
    </CompStyled>
  );
};

const WrapperInView = (props: Props & CommonProps) => {
  const { compData, commonProps } = props;
  return (
    <CompStyled className={compData.compCode} {...commonProps}>
      {props.children}
    </CompStyled>
  );
};

export default function CompWrapper(props: Props) {
  const { compData, isInEditor } = props;
  const { code, attr } = compData;

  if (compData.hided) {
    return null;
  }

  const createStyle = () => {
    const style: React.CSSProperties = {
      width: attr.width,
      height: attr.height,
      transform: `translate(${attr.left}px, ${attr.top}px)`,
    };
    if (typeof attr.angle !== 'undefined' && attr.scale) {
      style.transform += ` rotate(${attr.angle}deg) scale(${attr.scale[0]}, ${attr.scale[1]})`;
    }
    if (typeof attr.opacity !== 'undefined') {
      style.opacity = attr.opacity;
    }
    return style;
  };

  const commonProps = {
    id: code,
    style: createStyle(),
  };

  // 拆成两个组件的原因：减少预览时因为数据更新导致的rerender
  return isInEditor ? (
    <WrapperInEditor commonProps={commonProps} {...props} />
  ) : (
    <WrapperInView commonProps={commonProps} {...props} />
  );
}
