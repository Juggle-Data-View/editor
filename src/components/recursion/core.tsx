import React, { useEffect, useMemo, useCallback, Fragment, useRef } from 'react';
import { Formik, useFormikContext, FieldArray } from 'formik';
import { FieldLabel, validateMerge } from 'components/form';
import { INodeProps, INodeCompProps, INodeParams, IFormikStatus, IGenerator, INodeLabel, ChildProps } from './types';
import { c2n, resolveName } from './utils';
import { get, has, isFunction } from 'lodash';
import { nodeMapping } from './fields';
import { useDebounce } from 'ahooks';
import ErrorBoundary from 'components/base/ErrorBoundary';

/**
 * 表单触发修改时自动提交表单
 */
export const AutoSubmit = () => {
  const { values, submitForm, setSubmitting, dirty } = useFormikContext();
  const debounceValues = useDebounce(values, { wait: 300 });

  useEffect(() => {
    if (!dirty) {
      return;
    }
    /**
     * ⚠️ 注意：
     * 表单提交是异步操作，频繁触发`setFieldValue`时，需要将`isSubmitting`作为`useEffect`的依赖传入，
     * 否则会出现`setFieldValue`失效的问题。
     */
    submitForm().then(() => {
      setSubmitting(false);
    });
  }, [debounceValues]); // eslint-disable-line

  return null;
};

const NodeLabel: React.FC<INodeLabel> = (props) => {
  const { node, params, i18n } = props;
  const label = isFunction(node.label) ? node.label(params) : node.label;
  if (!label) {
    return <>{props.children}</>;
  }
  if (typeof node === 'object' && 'en' in node && i18n) {
    return <>{node[i18n]}</>;
  }
  return (
    <FieldLabel {...node.labelProps} label={<>{label}</>}>
      {props.children}
    </FieldLabel>
  );
};

/**
 * 渲染子节点
 * @param node 当前节点，要渲染的子节点来自当前节点的`children`
 * @param parentName 当前节点`name`全称
 */
const renderChildren = (props: INodeProps) => {
  const { node, parentName } = props;
  const { children, labelProps } = node;
  if (!children) return null;
  return children.map((child, index) => {
    const passLabelProps = children && labelProps;
    return (
      <Node
        key={child.name + child.label + index}
        // labelProps：符合传递条件时，就把当前节点的`labelProps`传递给子节点
        node={{ labelProps: passLabelProps ? labelProps : child.labelProps, ...child }}
        parentName={parentName}
      />
    );
  });
};

const Node: React.FC<INodeProps> = (props) => {
  const { parentName } = props;
  // node节点数据不会随组件更新而改变，直接缓存下来
  const node = useMemo(() => props.node, []); // eslint-disable-line
  const formik = useFormikContext();
  const { values, status, setFieldValue } = formik;
  const fullyName = resolveName(parentName, node.name); // 当前节点的完整name
  const isArrayNode = /\[\]$/g.test(node.name); // 当前节点是数组节点
  const comps = useMemo(() => ({ ...nodeMapping, ...status.mapping }), [status.mapping]);
  // 关于 submitting：这个阶段是验证完毕 & 准备提交阶段
  const submitting = formik.isSubmitting && !formik.isValidating;

  const validSubmitting = formik.isValid && submitting;

  const { nodeValue, shouldRender } = useMemo(() => {
    return {
      nodeValue: get(values, fullyName),
      shouldRender: !fullyName || has(values, fullyName),
    };
  }, [fullyName, values]);

  const oldValue = useRef(nodeValue);

  const getValue = useCallback(
    (name, path) => {
      const _name = resolveName(name, path || '');
      return _name ? get(values, _name) : values;
    },
    [values]
  );

  const params = useMemo<INodeParams>(() => {
    return {
      name: fullyName,
      parentName,
      value: nodeValue,
      parentValue: getValue(fullyName, '../'),
      rootValue: getValue(fullyName, '#'),
      oldValue: oldValue.current,
      getValue,
      setValue: setFieldValue,
    };
  }, [fullyName, getValue, nodeValue, parentName, setFieldValue]);

  const nodeProps = useMemo(() => {
    const _props: INodeCompProps = {
      name: fullyName,
      defaultValues: status.defaultValues,
      ...(isFunction(node.props) ? node.props(params) : node.props),
    };

    if (isFunction(node.validate)) {
      _props.validate = (value) => (isFunction(node.validate) ? node.validate(value, params) : undefined);
    } else {
      if (Array.isArray(node.validate)) {
        _props.validate = validateMerge(node.validate);
      }
    }
    return _props;
  }, [fullyName, node, params, status.defaultValues]);

  const C = comps[node.type];

  useEffect(() => {
    if (validSubmitting && oldValue.current !== nodeValue) {
      node.onChange && node.onChange(params);
      oldValue.current = nodeValue;
    }
  }, [nodeValue, params, node, validSubmitting]);

  // 配置项与数据结构不一致 或 设置了 show 配置，就不渲染当前节点及子节点
  if (!shouldRender || (node.show && !node.show(params))) {
    return null;
  }

  return (
    <NodeLabel node={node} params={params}>
      <ErrorBoundary errorMessage={`type=${node.type}的组件发生了错误`}>
        {!isArrayNode ? (
          <C {...nodeProps}>{node.children ? renderChildren({ node, parentName: fullyName }) : null}</C>
        ) : (
          <FieldArray name={fullyName}>
            {(arrayHelpers) => (
              <C {...nodeProps} arrayHelpers={arrayHelpers}>
                {nodeValue.map((item: any, index: number) => (
                  <Fragment key={index}>
                    {renderChildren({
                      node,
                      parentName: `${fullyName}[${index}]`,
                    })}
                  </Fragment>
                ))}
              </C>
            )}
          </FieldArray>
        )}
      </ErrorBoundary>
    </NodeLabel>
  );
};

export const Generator: React.FC<IGenerator> = (props) => {
  const { autoSubmit = true, children, parentName, i18n } = props;
  return (
    <Formik
      enableReinitialize
      {...props.formikProps}
      initialValues={props.values}
      initialStatus={
        {
          defaultValues: props.defaultValues,
          mapping: props.mapping || {},
          submitSuccess: false,
        } as IFormikStatus
      }
      onSubmit={props.onSubmit}
    >
      {(formik) => {
        const _props: ChildProps = {
          render: () => (
            <>
              {autoSubmit ? <AutoSubmit /> : null}
              <Node i18n={i18n} parentName={parentName || ''} node={c2n(props.config)} />
            </>
          ),
          formik,
        };
        return children && typeof children === 'function' ? children(_props) : _props.render;
      }}
    </Formik>
  );
};
