import { saveAs } from 'file-saver';
import { ButtonGroup, Tooltip, Button } from '@mui/material';
import { getAutoDV } from 'utils';
import { AutoDV } from 'auto-dv-type';
import notice from 'utils/notice';
import HistoryButton from './HistoryButton';
import { validApp } from 'helpers/jsonValider';
import QS from 'query-string';
import { ErrorObject } from 'ajv';
import dayjs from 'dayjs';
import { getAllSelectedComps } from 'utils/getAllChildren';
import store from 'store/index';
import { appAction } from 'store/features/appSlice';
import { transContent } from 'helpers/importHelper';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import GetAppIcon from '@mui/icons-material/GetApp';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { Settings } from '@mui/icons-material';
import { editorAction } from 'store/features/editorSlice';
import { useDispatch, useSelector } from 'react-redux';
import { selectRightPannelType } from 'store/selectors';
import useLang from 'components/base/useLang';

const exportComps = (isAll: boolean) => {
  try {
    const { app, canvas, compCodes, selectedCompCodes, compDatas } = getAutoDV();

    if (!compCodes.length) {
      throw new Error('请先添加组件');
    }

    if (!isAll && !selectedCompCodes.length) {
      throw new Error('请先选择组件');
    }

    const codes = isAll ? compCodes : getAllSelectedComps(selectedCompCodes, compDatas, compCodes);

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

    notice.success('导出成功');
  } catch (error: any) {
    notice.warn(`${error.message}`);
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
    intent: 'error',
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
    } catch (error: any) {
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
  window.open(openURL, openURL);
};

const HeadRight: React.FC = () => {
  const rightPannelType = useSelector(selectRightPannelType);
  const dispatch = useDispatch();
  const handleSetting = () => {
    if (rightPannelType === 'global') {
      dispatch(editorAction.setRightPannelType('hidden'));
    } else {
      dispatch(editorAction.setRightPannelType('global'));
    }
  };

  const lang = useLang();

  return (
    <div className="head-right">
      <HistoryButton />
      <ButtonGroup>
        <Button color="primary" onClick={() => exportComps(true)}>
          {lang.exportAll}
        </Button>
        <Button color="primary">
          <Tooltip title={lang.import} placement="bottom">
            <div className="import-btn">
              <GetAppIcon />
              <input
                onChange={(e: any) => importComps(e.target.files[0])}
                type="file"
                id="importInput"
                className="input-file"
                accept=".json"
              />
            </div>
          </Tooltip>
        </Button>
        <Button color="primary" onClick={() => exportComps(false)}>
          <Tooltip title={lang.export} placement="bottom">
            <FileUploadIcon />
          </Tooltip>
        </Button>
        <Button color="primary" onClick={handlePreview}>
          <Tooltip title={lang.preview} placement="bottom">
            <RemoveRedEyeIcon />
          </Tooltip>
        </Button>
        <Button
          color="primary"
          onClick={handleSetting}
          variant={rightPannelType === 'global' ? 'contained' : 'outlined'}
        >
          <Tooltip title={lang.globalSetting} placement="bottom">
            <Settings />
          </Tooltip>
        </Button>
      </ButtonGroup>
    </div>
  );
};

export default HeadRight;
