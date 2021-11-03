import styled from 'styled-components';

export const HeaderStyled = styled.section`
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 50px;
  padding: 0 20px;
  border-bottom: 1px solid ${(props) => props.theme.gray1};
  background-color: ${(props) => props.theme.gray3};

  .head-left {
    display: flex;
    height: 100%;
    align-items: center;
    .actions {
      display: flex;
      button {
        margin: 0 5px;
      }
    }
  }

  .head-right {
    display: flex;
    align-items: center;

    .import-btn {
      position: relative;
      overflow: hidden;
      > button {
        position: relative;
      }
      .input-file {
        opacity: 0;
        position: absolute;
        left: 0;
        top: 0;
        cursor: pointer;
        width: 100%;
        height: 100%;
      }
    }
  }
`;

export const HeadMenuStyled = styled.div<{ width: number }>`
  position: relative;
  margin-left: 20px;
  width: ${(props) => props.width + 'px'};
  height: 100%;
  cursor: pointer;
  font-size: 12px;

  &:hover {
    background: ${(props) => props.theme.gray1};
  }

  &.--active {
    background: ${(props) => props.theme.gray1};
    .expander {
      display: block;
    }
    .no-state {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      height: 100%;
      color: #999;
      font-size: 18px;
      p {
        margin-top: 10px;
      }
    }
  }

  .block {
    padding: 3px 0 0 0;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    cursor: pointer;
    p {
      margin-top: 2px;
      transform: scale(0.9);
    }
  }

  .expander {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 100000;
    width: 360px; // 展开菜单宽度
    height: 420px;
    transform-origin: 0 0;
    background: ${(props) => props.theme.gray1};
    dl {
      display: flex;
      dt {
        padding: 9px 0 6px 0;
        width: ${(props) => props.width + 'px'};
      }
      dd {
        position: absolute;
        top: 0;
        left: ${(props) => props.width + 'px'};
        right: 0;
        bottom: 0;
        flex: 1;
        overflow-y: auto;
        display: none;
      }

      &.active {
        dt {
          border-left: 2px solid ${(props) => props.theme.gray1};
          border-right: 2px solid transparent;
        }
        dt,
        dd {
          background: ${(props) => props.theme.gray4};
        }
        dd {
          display: block;
        }
      }
    }
  }

  .comps-head {
    position: relative;
    margin-bottom: 1px;
    margin: 0 10px;
    padding: 8px 0;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    .icon {
      position: absolute;
      right: 5px;
      top: 50%;
      transform: translateY(-50%);
      transition: transform 0.2s ease;
      &.--active {
        transform: translateY(-50%) rotate(90deg);
      }
    }
  }

  // 保证组件之间的间隔统一
  .comps-body,
  .comp {
    padding: 5px;
  }

  .comps-body {
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
  }

  .comp {
    margin: 0 0 5px 0;
    width: ${100 / 2}%; // 3列布局，数字可直接更换
    text-align: center;
    .imgbox {
      position: relative;
      display: block;
      padding-bottom: ${(3 / 5) * 100}%; // 16:9  4:3
      > div {
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        img {
          max-width: 100%;
          max-height: 100%;
        }
      }
    }
    > p {
      margin-top: 5px;
      transform: scale(0.9);
    }

    &:hover {
      transform: scale(1.05);
    }
  }

  // 敬请期待
  .coming-soon {
    padding: 10px 0;
    text-align: center;
    color: #999;
  }
`;

export const HistoryStyled = styled.div`
  display: flex;
  align-items: center;
  margin-right: 20px;
`;

export const HeadFavoritesStyled = styled.div<{ width: number; isEmpty: boolean }>`
  position: relative;
  width: ${(props) => props.width + 'px'};
  height: 100%;
  cursor: pointer;
  font-size: 12px;

  &:hover {
    background: ${(props) => props.theme.gray1};
  }

  &.--active {
    background: ${(props) => props.theme.gray1};
    .expander {
      display: block;
    }
    .no-state {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      height: 100%;
      color: #999;
      font-size: 18px;
      p {
        margin-top: 10px;
      }
    }
  }

  .block {
    padding: 3px 0 0 0;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    cursor: pointer;
    p {
      margin-top: 2px;
      transform: scale(0.9);
    }
  }

  .expander {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 4;
    width: 300px; // 展开菜单宽度
    height: 400px;
    transform-origin: 0 0;
    background: ${(props) => props.theme.gray1};
  }

  .bp3-tab-list {
    background: ${(props) => props.theme.gray1};
  }

  .bp3-tab-list > *:not(:last-child) {
    margin-right: 0;
  }

  .bp3-tabs.bp3-vertical > .bp3-tab-list .bp3-tab-indicator-wrapper .bp3-tab-indicator {
    background: rgba(51, 64, 76, 1);
    border-radius: 0;
  }

  .favoritePanelSection {
    height: 400px;
    overflow: auto;
    padding-right: 26px;
  }

  .favoritesComGroup {
    box-shadow: 0px 0px 1px 0px #172026 inset;
    position: relative;
    width: 140px;
    height: 86px;
    background-size: 100% 100%;
    &:hover {
      transform: scale(1.05);
    }
  }
  .favoritesCom {
    height: 30px;
    line-height: 30px;
    display: flex;
    opacity: 0.94;
    background: #172026;
    position: absolute;
    bottom: 0px;
    padding-left: 8px;
    box-sizing: border-box;
    width: 100%;
    p {
      width: 73px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  // 敬请期待
  .coming-soon {
    padding: 10px 0;
    text-align: center;
    color: #999;
  }
`;
