import { JuggleDV } from '@juggle-data-view/types';
import { baseURL } from '@utils/request';

export const fetchCSVData = async (datasource: JuggleDV.ExeclDatasourceInstance) => {
  return [];
};

const getUrl = (isPost: boolean, url: string, params: JuggleDV.APIDatasourceInstance['dataParams']) => {
  return isPost
    ? url
    : `${url}?${(params as JuggleDV.DataParam[])?.reduce((a, b, index) => {
        if (b.name) {
          return `${a}${index > 0 ? '&' : ''}${b.name}=${b.value}`;
        } else return a;
      }, '')}`;
};

const getResponse = async (datasource: JuggleDV.APIDatasourceInstance): Promise<Response> => {
  const { url, isProxy, method, dataParams, header } = datasource;

  const isPost = method === 'POST';

  if (isProxy) {
    return fetch(baseURL + 'api/proxy', {
      body: JSON.stringify({
        proxyUrl: getUrl(isPost, url, dataParams),
      }),
      credentials: 'include',
      method: 'post',
      headers: {
        'Content-type': 'application/json;charset=UTF-8',
      },
    });
  } else {
    const requestURL = getUrl(isPost, url, dataParams);
    const params: any = isPost ? { body: dataParams as string } : {};
    const option = {
      ...params,
      method,
      headers: header?.reduce(
        (a, b) => {
          if (b.key) {
            return {
              ...a,
              [b.key]: b.value,
            };
          } else {
            return a;
          }
        },
        { 'Content-type': 'application/json;charset=UTF-8' }
      ),
    };
    return fetch(requestURL, option);
  }
};
export const fetchAPIData = async (datasource: JuggleDV.APIDatasourceInstance) => {
  const res = await getResponse(datasource);

  if (!res.ok) {
    throw new Error('Request error');
  }

  return await res.json();
};
