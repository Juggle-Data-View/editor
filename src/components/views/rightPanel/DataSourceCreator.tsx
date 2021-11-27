/**
 * 新建数据源
 *
 * 包含按钮、对话框组件
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Button, Classes, ControlGroup, Dialog, Menu, MenuItem, Intent, Callout, Colors } from '@blueprintjs/core';
import { Popover2 } from '@blueprintjs/popover2';
import styled from 'styled-components';
import { createNextState as produce } from '@reduxjs/toolkit';
import { Formik, FieldArray, useField } from 'formik';
import * as Api from 'utils/api';
import UploadFile from 'components/common/UploadFile';
import { AutoDVStatus } from 'helpers/intent';
import { Control, Field, FieldLabel, validator } from 'components/form';
import { useRequest, usePrevious } from 'ahooks';
import type * as T from './creatorHelper';
import { DataSourceType, API_TYPE, HttpMethod } from 'config/const';
import * as helper from './creatorHelper';
import notice from 'utils/notice';
import { nanoid } from 'utils';
import { LoadingIcon } from 'components/common/AutoDVIcon';

const Container = styled.div`
  padding: 2px;
  min-height: 200px;
  max-height: 500px;
  overflow-y: auto;
  .item-label {
    width: 25%;
  }
  .item-control {
    max-width: 75%;
  }
`;

interface Props {
  title: string;
  dataSourceType: T.LocalDataSourceType; // 静态类型不在创建面板中
}

const DataSourceCreator: React.FC<Props> = ({ dataSourceType, title }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [error, setError] = useState('');

  return (
    <>
      <Button icon="add" style={{ marginLeft: 5 }} onClick={() => setIsOpen(true)} />
      <Dialog title={`新建 ${title} 数据源`} isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <Formik
          initialValues={
            {
              ...helper.initValues[dataSourceType],
              useHeader: false,
            } as T.Values
          }
          onSubmit={async (values) => {
            try {
              const newValues = helper.filterValues(values);
              await Api.createDataSource(newValues);
              setIsOpen(false);
              notice.toast({
                message: '创建成功',
                intent: 'success',
              });
            } catch (err: any) {
              setError(err.message || '');
            }
          }}
        >
          {(formik) => {
            const { values, handleSubmit } = formik;
            return (
              <>
                <Container className={Classes.DIALOG_BODY}>
                  {error && (
                    <Callout style={{ position: 'relative' }} intent="danger" title="表单提交失败">
                      <Button
                        style={{ position: 'absolute', top: 0, right: 0 }}
                        minimal
                        icon="cross"
                        onClick={() => setError('')}
                      />
                      {error}
                    </Callout>
                  )}
                  <Field.Text
                    label="名称(必填)"
                    name="name"
                    validate={(val) => {
                      return /^[\u4e00-\u9fa5_a-zA-Z0-9_-]{1,32}$/.test(val)
                        ? undefined
                        : '只能包含字母、数字、下划线(_)、中文字符，且长度不超过32个字符';
                    }}
                    bp={{ placeholder: '请输入数据源名称' }}
                  />
                  {values.type === DataSourceType.API && <API formik={formik as T.API_Formik} />}
                  {values.type === DataSourceType.MySQL && <MySQL formik={formik as T.SQL_Formik} />}
                  {values.type === DataSourceType.CSV && <CSV />}
                  {values.type === DataSourceType.EZD && <EZD formik={formik as T.EZD_Formik} />}
                </Container>
                <div className={Classes.DIALOG_FOOTER}>
                  <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                    <Button text="取消" onClick={() => setIsOpen(false)} />
                    <Button intent="primary" text="确定" type="submit" onClick={() => handleSubmit()} />
                  </div>
                </div>
              </>
            );
          }}
        </Formik>
      </Dialog>
    </>
  );
};

export default DataSourceCreator;

function API({ formik }: { formik: T.API_Formik }) {
  const { values, setFieldValue } = formik;
  const prevValues = usePrevious(values);

  useEffect(() => {
    if (!prevValues || !values) return;
    if (values.apiType !== prevValues?.apiType) {
      // 切换条件（如：接口协议、接口方法）时，重置config
      const _config = helper.getConfig(values);
      setFieldValue('config', {
        ...values.config,
        ..._config,
      });
    }
  }, [values, prevValues]); // eslint-disable-line

  return (
    <>
      {values.apiType === API_TYPE.HTTP && (
        <Field.Text label="URL" name="config.url" validate={validator.isURL} bp={{ placeholder: '请输入接口地址' }} />
      )}
      <Field.Select
        label="协议"
        name="apiType"
        options={[
          { label: 'HTTP', value: 1 },
          { label: 'JSF', value: 2 },
        ]}
        popoverProps={{ position: 'bottom-left', minimal: true }}
      />
      {values.apiType === API_TYPE.HTTP && (
        <>
          <Field.Radio label="类型" name="config.method">
            <option value="GET">GET</option>
            <option value="POST">POST</option>
          </Field.Radio>
          {values.config.method === HttpMethod.GET && (
            <Field.MultiText label="参数配置" name="config.params" bp={{ placeholder: '使用回车键添加多个参数' }} />
          )}
          {values.config.method === HttpMethod.POST && (
            <FieldLabel label="参数配置">
              <Control.Formatter name="config.jsonParam" codeType="javascript" />
            </FieldLabel>
          )}
          <FieldLabel label="Header">
            <Control.Switch name="useHeader" />
            {values.useHeader ? (
              <FieldArray name="config.header">
                {({ name, push, remove }) => {
                  return (
                    <>
                      {values.config.header.map((_, index, arr) => {
                        const _name = `${name}.${index}`;
                        return (
                          <ControlGroup style={{ margin: '5px 0', alignItems: 'center' }} key={index} fill={true}>
                            <Control.InputText name={`${_name}.k`} bp={{ placeholder: '参数名' }} />
                            <strong style={{ margin: '0 10px' }}>:</strong>
                            <Control.InputText name={`${_name}.v`} bp={{ placeholder: '参数值' }} />
                            <Button disabled={arr.length <= 1} icon="trash" onClick={() => remove(index)} />
                          </ControlGroup>
                        );
                      })}
                      <Button icon="add" text="添加" onClick={() => push({ k: '', v: '' })} />
                    </>
                  );
                }}
              </FieldArray>
            ) : null}
          </FieldLabel>
          <Field.Switch label="Cookie透传" name="config.transmitCookie" />
        </>
      )}
      {values.apiType === API_TYPE.JSF && (
        <>
          <Field.Text label="接口名" name="config.interfaceName" validate={validator.required} />
          <Field.Text label="方法名" name="config.methodName" validate={validator.required} />
          <Field.Text label="别名" name="config.alias" validate={validator.required} />
          <ButtonCheckJSFAPI formik={formik} />
        </>
      )}
    </>
  );
}

function MySQL({ formik }: { formik: T.SQL_Formik }) {
  const { values } = formik;
  const [status, setStatus] = useState<keyof typeof AutoDVStatus>('none');
  const { run, error, loading } = useRequest(Api.checkDataSourceConnection, {
    manual: true,
    onSuccess() {
      setStatus('success');
    },
    onError() {
      setStatus('danger');
    },
  });

  const msgStyle: React.CSSProperties = {
    color: AutoDVStatus[status].color,
    marginTop: 10,
    minHeight: 30,
    maxHeight: 100,
    overflowY: 'auto',
  };

  const buttonText: Partial<Record<keyof typeof AutoDVStatus, string>> = {
    success: '测试成功',
    danger: '测试失败',
  };

  return (
    <>
      <Field.Text label="域名" name="config.host" validate={validator.required} />
      <Field.Number label="端口号" name="config.port" bp={{ min: 0, buttonPosition: 'none' }} />
      <Field.Text label="数据库名称" name="config.database" validate={validator.required} />
      <Field.Text label="用户名" name="config.user" validate={validator.required} />
      <Field.Radio
        label="密码类型"
        name="config.passwordType"
        options={[
          { label: '明文', value: helper.PasswordType.Public },
          { label: '密文', value: helper.PasswordType.Private },
        ]}
      />
      <Field.Text label="密码" name="config.password" validate={validator.required} />
      <FieldLabel label="">
        <Button
          text={buttonText[status] || '连通性测试'}
          intent={status}
          icon={loading ? <LoadingIcon size={14} /> : AutoDVStatus[status].icon}
          onClick={() => {
            setStatus('none');
            run(values);
          }}
        />
        {error && status === 'danger' ? <div style={msgStyle}>{error.message}</div> : null}
      </FieldLabel>
    </>
  );
}

function CSV() {
  return <FieldUpload name="config.path" />;
}

function EZD({ formik }: { formik: T.EZD_Formik }) {
  const { values, setFieldValue } = formik;
  const prevValues = usePrevious(values);

  useEffect(() => {
    if (!prevValues || !values) return;
    if (values.apiType !== prevValues?.apiType) {
      // 因为不同的config会共享key，当接口协议的值改变时，重置config
      const _config = helper.getConfig(values);
      setFieldValue('config', {
        ...values.config,
        ..._config,
      });
    }
  }, [values, prevValues]); // eslint-disable-line

  return (
    <>
      <Field.Select
        label="协议"
        name="apiType"
        options={[
          { label: 'HTTP', value: 1 },
          { label: 'JSF', value: 2 },
        ]}
        popoverProps={{ position: 'bottom-left', minimal: true }}
      />
      {values.apiType === API_TYPE.HTTP && (
        <>
          <SelectEZDAPIList formik={formik} />
          <Field.Radio label="类型" name="config.method">
            <option value="GET">GET</option>
            <option value="POST">POST</option>
          </Field.Radio>
          {values.config.method === HttpMethod.GET && (
            <Field.MultiText label="参数配置" name="config.params" bp={{ placeholder: '使用回车键添加多个参数' }} />
          )}
          {values.config.method === HttpMethod.POST && (
            <FieldLabel label="参数配置">
              <Control.Formatter name="config.jsonParam" codeType="javascript" />
            </FieldLabel>
          )}
          <FieldLabel label="Header">
            <Control.Switch name="useHeader" />
            {values.useHeader ? (
              <FieldArray name="config.header">
                {({ name, push, remove }) => {
                  return (
                    <>
                      {values.config.header.map((_, index, arr) => {
                        const _name = `${name}.${index}`;
                        return (
                          <ControlGroup style={{ margin: '5px 0', alignItems: 'center' }} key={index} fill={true}>
                            <Control.InputText name={`${_name}.k`} bp={{ placeholder: '参数名' }} />
                            <strong style={{ margin: '0 10px' }}>:</strong>
                            <Control.InputText name={`${_name}.v`} bp={{ placeholder: '参数值' }} />
                            <Button disabled={arr.length <= 1} icon="trash" onClick={() => remove(index)} />
                          </ControlGroup>
                        );
                      })}
                      <Button icon="add" text="添加" onClick={() => push({ k: '', v: '' })} />
                    </>
                  );
                }}
              </FieldArray>
            ) : null}
          </FieldLabel>
          <Field.Switch label="Cookie透传" name="config.transmitCookie" />
        </>
      )}
      {values.apiType === API_TYPE.JSF && (
        <>
          <SelectEZDAPIList formik={formik} />
          <FieldLabel label="参数配置">
            <Control.Formatter name="config.jsonParam" codeType="javascript" />
          </FieldLabel>
        </>
      )}
    </>
  );
}

function ButtonCheckJSFAPI({ formik }: { formik: T.API_Formik }) {
  const { values, setFieldValue } = formik;
  const { data, error, run } = useRequest(Api.checkJSFApi, {
    manual: true,
    onSuccess(data) {
      setFieldValue('config.paramsType', data);
    },
  });
  const status = useMemo<Intent>(() => {
    if (typeof data !== 'undefined') return 'success';
    if (error) return 'danger';
    return 'none';
  }, [data, error]);
  const text: Partial<Record<typeof status, string>> = {
    none: '获取凭证',
    danger: '获取失败',
    success: '获取成功',
  };
  return (
    <FieldLabel label="">
      <Button
        icon={AutoDVStatus[status].icon}
        text={text[status]}
        intent={status}
        onClick={() =>
          run({
            interfaceName: values.config.interfaceName,
            alias: values.config.alias,
            methodName: values.config.methodName,
          })
        }
      />
    </FieldLabel>
  );
}

function SelectEZDAPIList({ formik }: { formik: T.EZD_Formik }) {
  const { values } = formik;
  const { data, error, run, loading } = useRequest<T.EZD_API_LIST>(Api.getEZDApiList, {
    manual: true,
  });
  const [active, setActive] = useState<T.EZD_API_DATA | null>(null);

  const handleConfig = (data: T.EZD_API_DATA) => {
    const _values = produce(values, (draft) => {
      draft.isEzdActiveTask = data.data.isActive ? 1 : 0;
      if (draft.apiType === API_TYPE.HTTP) {
        draft.config.apiName = data.data.methodName;
        draft.config.apiGroupName = data.data.svcName;
      }
      if (draft.apiType === API_TYPE.JSF) {
        const preset = {
          apiName: data.data.methodName,
          apiGroupName: data.data.svcName,
          appToken: '',
          requestId: nanoid(),
          params: '',
        };
        draft.config.jsonParam = JSON.stringify(preset, null, 2);
        draft.config.alias = data.data.tenant;
      }
    });
    formik.setValues(_values);
  };

  return (
    <FieldLabel label="API名称">
      <Popover2
        position="bottom-left"
        minimal
        content={
          data && (
            <Menu style={{ maxHeight: 200, overflow: 'auto' }}>
              {data.map((group) => (
                <MenuItem
                  text={group.title}
                  key={group.key}
                  active={active?.data.svcNameCN === group.title}
                  /**
                   * pointerEvents: 'none' 修复以下问题
                   * issues：https://github.com/palantir/blueprint/issues/4600
                   */
                  style={{ pointerEvents: 'none' }}
                >
                  <div style={{ maxHeight: 200, overflow: 'auto' }}>
                    {group.children.map((item) => (
                      <MenuItem
                        key={item.key}
                        text={item.title}
                        active={active?.data.methodName === item.data.methodName}
                        onClick={() => {
                          setActive(item);
                          handleConfig(item);
                        }}
                      />
                    ))}
                  </div>
                </MenuItem>
              ))}
            </Menu>
          )
        }
      >
        <Button
          text={active ? active.title : 'API名称'}
          rightIcon={loading ? <LoadingIcon size={14} /> : 'double-caret-vertical'}
          onClick={() => {
            if (!data) {
              run();
            }
          }}
        />
      </Popover2>
      {error && <div style={{ marginTop: 5, color: Colors.RED3 }}>{error.message || '接口请求错误'}</div>}
    </FieldLabel>
  );
}

function FieldUpload({ name }: { name: string }) {
  const [, , helpers] = useField(name);
  return (
    <FieldLabel label="上传CSV">
      <UploadFile
        onUploaded={(path) => {
          helpers.setValue(path);
        }}
      />
    </FieldLabel>
  );
}
