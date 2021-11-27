import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import * as Api from 'utils/api';
import notice from 'utils/notice';
import { Icon, Colors } from '@blueprintjs/core';
import { qs, getViewStatus, isDev, qsDynamic } from 'utils';
import PasswordMask from 'components/common/PasswordMask';
import Canvas from 'components/views/center/Canvas';
import fetchAppConfig from 'helpers/fetchAppConfig';
import styled from 'styled-components';
import PageLoading from 'components/common/PageLoading';
import { appAction } from 'store/features/appSlice';

const StyledCloseVersion = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 100%;
  background-color: #000;
  line-height: 1.5;
  .title {
    margin-top: 20px;
    font-size: 20px;
  }
  .desc {
    margin-top: 5px;
    font-size: 14px;
    text-align: center;
  }
`;

const asyncCheckAuthority = async (url?: string) => {
  try {
    // 判读是在编辑系统还是内嵌iframe
    const { release, sign, time } = url ? qsDynamic(url).query : qs.query;
    if (typeof release === 'string' && sign) {
      if (!time) {
        throw new Error('使用签名需要传入时间戳');
      }
      // 触发主动鉴权
      await Api.checkReleaseAuthority();
    }
  } catch (error) {
    throw error;
  }
};

/**
 * ----------------------------
 * View
 * ----------------------------
 */

const View = (props: { url?: string }) => {
  const { url } = props;
  const [canvas, setCanvas] = useState<AutoDV.AppConfig['canvas']>();
  const [visiblePwMask, setVisiblePwMask] = useState<boolean>(false);
  const [isClose, setIsClose] = useState(false);
  const dispatch = useDispatch();

  const setApp = async () => {
    try {
      // 判断是编排系统还是内嵌iframe
      const app = await fetchAppConfig(url);
      dispatch(appAction.init({ app }));
      // 如果是iframe，则跟需要根据app.name去取fakeIFrameVars里边的参数
      const passed = await asyncCheckCloseVersion(url ? app.name : '');
      if (!passed) {
        setIsClose(true);
      } else {
        setCanvas(app.canvas);
      }
    } catch (error) {
      throw error;
    }
  };

  const mount = async () => {
    try {
      await asyncCheckAuthority(url);
      await setApp();
    } catch (error: any) {
      // if (error instanceof Error)
      if (error.code && error.code === 490002) {
        setVisiblePwMask(true);
      } else {
        notice.error(`${error.message}(${error.code})`);
      }
    }
  };

  useEffect(() => {
    mount();
  }, []); // eslint-disable-line

  if (visiblePwMask) {
    return (
      <PasswordMask
        visible={visiblePwMask}
        onSubmit={async (value) => {
          try {
            await Api.checkReleaseAuthority({
              password: value,
            });
            await setApp();
            setVisiblePwMask(false);
          } catch (error: any) {
            console.error(error);
            notice.error(error.message);
          }
        }}
      />
    );
  }

  if (isClose) {
    return (
      <StyledCloseVersion>
        <Icon icon="info-sign" iconSize={96} style={{ color: Colors.ORANGE3 }} />
        <div className="title">系统已封版</div>
        <div className="desc">
          为保障大促期间系统稳定，暂不支持预览
          <br />
          如有需求请联系 <code>liping254</code>
        </div>
      </StyledCloseVersion>
    );
  }

  return (
    <>
      {canvas && canvas.compInsts ? (
        <Canvas canvas={canvas} comps={canvas.compInsts} isInEditor={false} />
      ) : (
        <PageLoading />
      )}
    </>
  );
};

export default View;

/**
 * 校验封板状态，true时显示页面、false显示封版信息
 * @return {boolean}
 */
const asyncCheckCloseVersion = async (fakeIFrameCode?: string) => {
  if (isDev) return true; // 开发环境不受封版影响，页面可以始终显示
  try {
    const { isPreview } = getViewStatus();
    if (isPreview) {
      // 获取封板状态，已封板 or 未封板
      const closeData = await Api.closeVersion();
      if (+closeData.cfgValue === 1) {
        // 已封板
        const res = await Api.checkInWhiteList(fakeIFrameCode);
        return res.inWhiteListFlag;
      }
    }
    return true;
  } catch (error) {
    throw error;
  }
};
