import React from 'react';
import { createNextState as produce } from '@reduxjs/toolkit';
import { saveAs } from 'file-saver';
import { Button, ButtonGroup, Tooltip, Position } from '@blueprintjs/core';
import AutoDVIcon from 'components/common/AutoDVIcon';
import { getAutoDV, getOriginDatas, isDev } from 'utils';
import notice from 'utils/notice';
import HistoryButton from './HistoryButton';
import { validApp } from 'helpers/jsonValider';
import QS from 'query-string';
import { ErrorObject } from 'ajv';
import dayjs from 'dayjs';
import history from 'helpers/history';
import { getAllSelectedComps } from 'utils/getAllChildren';
import store from 'store/index';
import { appAction } from 'store/features/appSlice';
import { transContent } from 'helpers/importHelper';

// 导出组件
const exportComps = (isAll: boolean) => {
  try {
    const { app, canvas, compCodes, selectedCompCodes, compDatas } = getAutoDV();
    const originDatas = getOriginDatas();

    if (!compCodes.length) {
      throw new Error('请先添加组件');
    }

    if (!isAll && !selectedCompCodes.length) {
      throw new Error('请先选择组件');
    }

    const codes = isAll ? compCodes : getAllSelectedComps(selectedCompCodes, compDatas, compCodes);
    const comps = codes.map((code) => compDatas[code]);
    const exports = produce(comps, (draft) => {
      draft.forEach(({ code, dataConfig }) => {
        /**
         * 导出组件时将当前组件的数据拷贝一份到 mockData 中，原因：
         * 不同空间的组件在导入时，需要将导入组件的数据源类型置换为静态类型
         */
        if (dataConfig && dataConfig.dataSourceType !== 0) {
          dataConfig.mockData = originDatas[code] || {};
        }
      });
    });

    const createFileName = () => {
      if (isAll) {
        return `AutoDV-${app.name}-all.json`;
      }
      if (codes.length > 1) {
        return `AutoDV-${app.name}-multi.json`;
      }
      return `${exports[0].alias}-${exports[0].title || '无标题'}.json`;
    };

    const exportContent: AutoDV.ExportContent = {
      name: app.name,
      spaceId: app.spaceId,
      components: exports,
      exportTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    };

    if (isAll) {
      exportContent.canvas = {
        backgroundColor: canvas.backgroundColor,
        backgroundImg: canvas.backgroundImg,
        height: canvas.height,
        thumbnail: canvas.thumbnail,
        width: canvas.width,
        zoomType: canvas.zoomType,
      };
    }

    saveAs(
      new Blob([JSON.stringify(exportContent)], {
        type: 'text/plain;charset=utf-8',
      }),
      createFileName()
    );

    notice.toast({
      message: '导出成功',
      intent: 'success',
    });
  } catch (error) {
    notice.toast({
      message: `${error.message}`,
      intent: 'warning',
    });
  }
};

const showError = (title: string, ajvError: Array<ErrorObject>) => {
  const content = (
    <>
      <h3>导入失败</h3>
      <p style={{ marginTop: 5 }}>{title}</p>
      <div style={{ marginTop: 10, lineHeight: 1.5 }}>
        {ajvError.map((err) => (
          <p key={err.message}>{err.message}</p>
        ))}
      </div>
    </>
  );
  notice.alert(content, {
    cancelButtonText: '',
    confirmButtonText: '关闭',
    icon: 'warning-sign',
    intent: 'danger',
  });
};

// 导入组件
const importComps = (file: File) => {
  const reader = new FileReader();
  reader.onload = function (e: any) {
    try {
      const state = getAutoDV();
      const content: AutoDV.ExportContent = JSON.parse(e.target.result);
      const appValider = validApp(content);

      if (appValider.error) {
        showError('整体配置有误，具体信息如下：', appValider.error);
        return;
      }

      if (!content.components || !content.components.length) {
        throw new Error('没有找到组件配置');
      }

      const isSameSpace = !!(content.spaceId === state.app.spaceId);

      const doImport = (content: AutoDV.ExportContent) => {
        store.dispatch(appAction.importJSON({ content: transContent(content) }));
      };

      if (isSameSpace) {
        doImport(content);
      } else {
        notice.alert(<div dangerouslySetInnerHTML={{ __html: `导入文件来自其他空间，确认导入吗？` }} />, {
          icon: 'warning-sign',
          intent: 'warning',
          canEnterKeyConfirm: true,
          onConfirm: () => {
            doImport(content);
          },
        });
      }
    } catch (error) {
      notice.error(`组件导入失败: ${error.message}`);
    }
  };
  reader.onerror = function (err) {
    console.log('reader onerror', err);
    notice.error('文件读取失败！');
  };
  reader.readAsText(file);
};

const handlePreview = () => {
  const { app } = getAutoDV();
  const openURL = QS.stringifyUrl({ url: './view', query: { id: app.id } });
  window.open(openURL, openURL); // 打开新窗口，相同名称时不再打开新窗口
};

const HeadRight: React.FC = () => {
  return (
    <div className="head-right">
      {isDev ? <Button text="DEMO抽屉" style={{ marginRight: 10 }} onClick={() => history.push('/demo')} /> : null}

      <HistoryButton />
      <ButtonGroup>
        <Button icon="export" onClick={() => exportComps(true)}>
          导出全部
        </Button>
        <Tooltip content="导入" position={Position.BOTTOM}>
          <div className="import-btn">
            <Button
              icon="import"
              onClick={() => {
                const o: any = document.getElementById('importInput');
                o.value = '';
                o && o.click();
              }}
            />
            <input
              onChange={(e: any) => importComps(e.target.files[0])}
              type="file"
              id="importInput"
              className="input-file"
              accept=".json"
            />
          </div>
        </Tooltip>
        <Tooltip content="导出" position={Position.BOTTOM}>
          <Button icon="export" onClick={() => exportComps(false)} />
        </Tooltip>
        <Tooltip content="预览" position={Position.BOTTOM}>
          <Button icon="eye-open" onClick={handlePreview} />
        </Tooltip>
        <Tooltip content="上线" position={Position.BOTTOM}>
          <Button icon={<AutoDVIcon size={16} icon="autoDV-publish" />} />
        </Tooltip>
      </ButtonGroup>
    </div>
  );
};

export default HeadRight;
