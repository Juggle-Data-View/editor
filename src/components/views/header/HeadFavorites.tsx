import React, { useState, useEffect, SyntheticEvent, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Icon, Tabs, Tab, Button, Dialog, Classes, Tooltip, Position, Colors } from '@blueprintjs/core';
import { HeadFavoritesStyled } from './style';
import notice from 'utils/notice';
import { nanocode, getAutoDV } from 'utils';
import ReactDOM from 'react-dom';
import {
  addFavoritesComToGroup,
  deleteFavoritesComponent,
  getFavorites,
  getFavoritesComponent,
  modifyFavoritesComponent,
} from 'utils/api';
import { Formik, ErrorMessage } from 'formik';
import { Field, FieldLabel } from 'components/form';
import { ErrorObject } from 'ajv';
import { selectAutoDV } from 'store/selectors';
import { appAction } from 'store/features/appSlice';
import { useClickAway } from 'ahooks';
import DropZone from 'components/common/DropZone';
import { validator } from 'components/form/fieldValidator';

interface FavoritesCom {
  background: string;
  componentName: string;
  createTime: string;
  createUser: string;
  favoritesId: number;
  id: number;
  spaceId: number;
  getFavoritesList: () => void;
}

// 收藏和修改
const CreateFavoritesForm: React.FC<any> = () => {
  const [visibleModal, setVisibleModal] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectComArr, setSelectComArr] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<any>([]);
  const { app, selectedCompCodes, compDatas } = getAutoDV();

  // 获取收藏夹
  const getFavoritesList = () => {
    getFavorites()
      .then((res) => {
        setFavorites(res);
      })
      .catch((err) => {
        notice.error(JSON.stringify(err));
      });
  };

  useEffect(() => {
    getFavoritesList();
    const tempArr: any = [];
    Object.keys(compDatas).forEach((key) => {
      if (selectedCompCodes.includes(key)) {
        tempArr.push(compDatas[key]);
      }
    });
    setSelectComArr(tempArr);
  }, []); // eslint-disable-line

  // 新增收藏组件
  const addFavoritesCom = (data: any) => {
    if (!data.componentName) {
      notice.warn('请输入组件名称！');
      return;
    }
    if (!data.favoritesId && data.favoritesId !== 0) {
      notice.warn('请选择收藏夹！');
      return;
    }
    if (!data.background) {
      notice.warn('请上传封面图！');
      return;
    }
    setIsLoading(true);
    const params = {
      favoritesId: data.favoritesId,
      componentName: data.componentName,
      spaceId: app.spaceId,
      components: JSON.stringify(selectComArr),
      background: data.background,
    };
    addFavoritesComToGroup(params)
      .then((res: any) => {
        notice.toast({ message: '收藏成功！', intent: 'success' });
      })
      .catch((err) => {
        notice.error(JSON.stringify(err));
      });
    setIsLoading(false);
    setVisibleModal(false);
  };

  const createForm = () => {
    return (
      <Formik
        initialValues={{ componentName: '', background: '', favoritesId: 0 }}
        enableReinitialize
        onSubmit={(values) => {
          addFavoritesCom(values);
        }}
      >
        {(formik) => {
          const { handleSubmit } = formik;

          return (
            <div className={Classes.DIALOG_BODY}>
              <Field.Text
                label="名称:"
                name="componentName"
                labelProps={{ width: '14%' }}
                validate={(val) =>
                  /^[\u4e00-\u9fa5_a-zA-Z0-9_]{1,32}$/.test(val)
                    ? undefined
                    : '只能包含字母、数字、下划线(_)、中文字符，且长度不超过32个字符'
                }
              />

              <FieldLabel label="封面:" width="14%">
                <DropZone name="background" validate={validator.required} />
                <ErrorMessage
                  name="background"
                  render={(msg) => <p style={{ marginTop: 5, color: Colors.RED3 }}>{msg}</p>}
                />
              </FieldLabel>
              <Field.Select label="分组" name="favoritesId" labelProps={{ width: '14%' }}>
                {favorites.map((item: any) => {
                  return (
                    <option value={item.id} key={item.id} label={item.favoritesName}>
                      {item.favoritesName}
                    </option>
                  );
                })}
              </Field.Select>
              <div className={Classes.DIALOG_FOOTER}>
                <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                  <Button text="取消" onClick={() => setVisibleModal(false)} />
                  <Button
                    loading={isLoading}
                    intent="primary"
                    text="确定"
                    type="submit"
                    onClick={() => handleSubmit()}
                  />
                </div>
              </div>
            </div>
          );
        }}
      </Formik>
    );
  };

  return (
    <Dialog
      style={{ width: '400px' }}
      title="收藏组件"
      isOpen={visibleModal}
      canOutsideClickClose={true}
      onClose={() => {
        setVisibleModal(!visibleModal);
      }}
    >
      {favorites.length > 0 ? createForm() : ''}
    </Dialog>
  );
};

export const createFavorites = (formData: any) => {
  const tempDiv: HTMLElement = document.createElement('div');
  tempDiv.id = `alert-${+new Date()}`;
  document.body.appendChild(tempDiv);
  ReactDOM.render(<CreateFavoritesForm />, tempDiv);
};

// 编辑收藏组件
const editFavoritesCom = (com: FavoritesCom) => {
  const tempDiv: HTMLElement = document.createElement('div');
  tempDiv.id = `alert-${+new Date()}`;
  document.body.appendChild(tempDiv);
  ReactDOM.render(<RenameFavoritesComponent {...com} />, tempDiv);
};

const RenameFavoritesComponent: React.FC<FavoritesCom> = (props) => {
  const { favoritesId, id, componentName, getFavoritesList } = props;
  const [visibleModal, setVisibleModal] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 修改收藏组件
  const modifyFavoritesCom = (data: any) => {
    setIsLoading(true);
    const params = {
      favoritesId: favoritesId,
      componentName: data.componentName,
      id: id,
    };
    modifyFavoritesComponent(params)
      .then((res: any) => {
        getFavoritesList();
        notice.toast({ message: '修改成功！', intent: 'success' });
      })
      .catch((err) => {
        notice.error(JSON.stringify(err));
      });
    setIsLoading(false);
    setVisibleModal(false);
  };

  return (
    <div onClick={(e: React.SyntheticEvent) => e.stopPropagation()}>
      <Dialog
        style={{ width: '400px' }}
        title={'修改组件名称'}
        isOpen={visibleModal}
        canOutsideClickClose={false}
        onClose={() => {
          setVisibleModal(!visibleModal);
        }}
      >
        <Formik
          initialValues={{ componentName: componentName || undefined }}
          enableReinitialize
          onSubmit={(values) => {
            modifyFavoritesCom(values);
          }}
        >
          {(formik) => {
            const { handleSubmit } = formik;
            return (
              <div className={Classes.DIALOG_BODY}>
                <Field.Text
                  label="名称"
                  name="componentName"
                  validate={(val) =>
                    /^[\u4e00-\u9fa5_a-zA-Z0-9_]{1,32}$/.test(val)
                      ? undefined
                      : '只能包含字母、数字、下划线(_)、中文字符，且长度不超过32个字符'
                  }
                />
                <div className={Classes.DIALOG_FOOTER}>
                  <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                    <Button text="取消" onClick={() => setVisibleModal(false)} />
                    <Button
                      loading={isLoading}
                      intent="primary"
                      text="确定"
                      type="submit"
                      onClick={() => handleSubmit()}
                    />
                  </div>
                </div>
              </div>
            );
          }}
        </Formik>
      </Dialog>
    </div>
  );
};

// 收藏菜单
const FavoritestMenu = () => {
  const [currIndex, setCurrIndex] = useState<number>(-999);
  const [visible, setVisible] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<any>([]);
  const { app } = useSelector(selectAutoDV);
  const dispatch = useDispatch();

  const handleTabChange = (e: any) => {
    setCurrIndex(e);
  };

  // 获取收藏夹
  const getFavoritesList = () => {
    getFavorites()
      .then((res: any) => {
        const allFavCom = createAllFavoritesCom(res);
        res.unshift(allFavCom);
        setFavorites(res);
      })
      .catch((err) => {
        notice.error(JSON.stringify(err));
      });
  };

  const createAllFavoritesCom = (res: any) => {
    const allItem: any = {
      createTime: '',
      createUser: '',
      delFlag: 0,
      favoritesComponentInfoDTO: [],
      favoritesName: '全部收藏',
      id: -999,
    };
    for (let i = 0; i < res.length; i++) {
      allItem['createTime'] = res[0]['createTime'];
      allItem['createUser'] = res[0]['createUser'];
      allItem['delFlag'] = res[0]['delFlag'];
      allItem['createTime'] = res[0]['createTime'];

      for (let j = 0; j < res[i].favoritesComponentInfoDTO.length; j++) {
        allItem['favoritesComponentInfoDTO'].push(res[i]['favoritesComponentInfoDTO'][j]);
      }
    }
    return allItem;
  };

  // 删除收藏组件
  const deleteFavoritesCom = (com: any) => {
    const url = `/${com.favoritesId}/${com.id}`;
    notice.alert(
      <div
        onClick={(e: SyntheticEvent) => e.stopPropagation()}
        dangerouslySetInnerHTML={{
          __html: `是否要删除收藏的组件-<b style="color: rgba(206, 84, 78, 1)"> ${com.componentName} </b>？`,
        }}
      />,
      {
        icon: 'trash',
        intent: 'danger',
        canEnterKeyConfirm: true,
        onConfirm: () => {
          deleteFavoritesComponent(url)
            .then((res: any) => {
              getFavoritesList();
              notice.toast({ message: '删除成功！', intent: 'success' });
            })
            .catch((err: any) => {
              notice.error(JSON.stringify(err));
            });
        },
      }
    );
  };

  // 获取收藏组件
  const getFavoritesCom = (com: any) => {
    const url = `/${com.favoritesId}/${com.id}`;
    getFavoritesComponent(url)
      .then((res: any) => {
        if (!res || !res.componentsList) {
          throw new Error('组件信息缺失');
        }
        setVisible(false);
        const components = res.componentsList.map((item: AutoDV.Comp) => {
          // 避免多次引用收藏，导致code重复
          return {
            ...item,
            code: nanocode(item.compCode),
          };
        });
        // 引入组件
        const data = {
          name: res.componentName,
          spaceId: res.spaceId,
          components: components,
          exportTime: res.createTime,
        };
        importComps(data);
      })
      .catch((err) => {
        const msg = err && err.message;
        notice.error(msg || JSON.stringify(err));
      });
  };

  // 导入组件
  const importComps = (content: any) => {
    const isSameSpace = !!(content.spaceId === app.spaceId);
    const doImport = (content: AutoDV.ExportContent) => {
      const { components } = content;
      const ajvError: Array<ErrorObject> | null = null;
      content.components = components.map((comp) => {
        // 如果导入的配置不是相同的空间，需要修改数据源类型为静态数据类型
        if (!isSameSpace && comp.dataConfig) {
          comp.dataConfig.dataSourceType = 0;
          comp.dataConfig.dataSourceId = null;
        }
        return comp;
      });
      if (ajvError) {
        showError('组件配置有误，具体信息如下：', ajvError);
      } else {
        dispatch(appAction.importJSON({ content }));
      }
    };

    if (isSameSpace) {
      doImport(content);
    } else {
      notice.alert(<div dangerouslySetInnerHTML={{ __html: `收藏组件来自其他空间，确认导入吗？` }} />, {
        icon: 'warning-sign',
        intent: 'warning',
        canEnterKeyConfirm: true,
        onConfirm: () => {
          doImport(content);
        },
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

  const ref = useRef<any>();

  useClickAway(() => {
    setVisible(false);
  }, ref);

  return (
    <HeadFavoritesStyled
      className={visible ? '--active' : ''}
      width={64}
      isEmpty={favorites.length ? false : true}
      ref={ref}
      // onClick={(e: React.SyntheticEvent) => e.stopPropagation()}
    >
      <div
        className="block"
        onClick={() => {
          setVisible(!visible);
          getFavoritesList();
        }}
      >
        <Icon icon="star" />
        <p>收藏</p>
      </div>
      <div className="expander">
        <section className="bp3-card" style={{ height: '100%', boxSizing: 'content-box', padding: '0' }}>
          {favorites.length ? (
            <Tabs vertical={true} onChange={handleTabChange} selectedTabId={currIndex}>
              {favorites.map((item: any) => {
                return (
                  <Tab
                    key={item.id}
                    id={item.id}
                    title={item.favoritesName}
                    style={{
                      width: '105px',
                      fontSize: '10px',
                      color: 'white',
                      boxSizing: 'border-box',
                      borderRadius: '0px',
                      background: 'rgba(51,64,76,1)',
                      borderBottom: '1px solid rgba(0, 0, 0 ,0.4)',
                    }}
                    panel={
                      <section className="favoritePanelSection">
                        {item.favoritesComponentInfoDTO.map((com: FavoritesCom) => {
                          return (
                            <section key={com.id} onClick={() => getFavoritesCom(com)} style={{ marginTop: '12px' }}>
                              <section
                                className="favoritesComGroup"
                                style={{ backgroundImage: `url(${com.background})` }}
                              >
                                <div className="favoritesCom">
                                  <Tooltip content={com.componentName} position={Position.TOP}>
                                    <p>{com.componentName}</p>
                                  </Tooltip>
                                  <Tooltip content="编辑" position={Position.TOP}>
                                    <Button
                                      minimal={true}
                                      icon="edit"
                                      onClick={(e: any) => {
                                        e.stopPropagation();
                                        editFavoritesCom({ ...com, getFavoritesList });
                                      }}
                                    />
                                  </Tooltip>
                                  <Tooltip content="删除" position={Position.TOP}>
                                    <Button
                                      minimal={true}
                                      icon="trash"
                                      onClick={(e: any) => {
                                        e.stopPropagation();
                                        deleteFavoritesCom(com);
                                      }}
                                    />
                                  </Tooltip>
                                </div>
                              </section>
                            </section>
                          );
                        })}
                      </section>
                    }
                  />
                );
              })}
            </Tabs>
          ) : (
            <div className="no-state">
              <Icon icon="error" iconSize={54} />
              <p>没有数据</p>
            </div>
          )}
        </section>
      </div>
    </HeadFavoritesStyled>
  );
};

export default FavoritestMenu;
