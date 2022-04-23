import { JuggleDV } from '@juggle-data-view/types';
import { baseURL } from 'utils/request';

export const fetchCSVData = async (datasource: JuggleDV.ExeclDatasourceInstance) => {
  return [];
};

const getUrl = (isPost: boolean, url: string, params: JuggleDV.APIDatasourceInstance['dataParams']) => {
  return isPost
    ? url
    : `${url}?${(params as JuggleDV.DataParam[])?.reduce((a, b, index) => {
        return `${a}${index > 0 ? '&' : ''}${b.name}=${b.value}`;
      }, '')}`;
};

const getResponse = async (datasource: JuggleDV.APIDatasourceInstance): Promise<Response> => {
  const { url, isProxy, method, dataParams, header } = datasource;

  const isPost = method === 'POST';

  if (isProxy) {
    const requestURL = getUrl(isPost, baseURL + '/api/proxy', dataParams);
    return await fetch(requestURL, {
      body: JSON.stringify({
        proxyUrl: url,
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
    return await fetch(requestURL, {
      ...params,
      headers: header?.reduce((a, b) => {
        return {
          ...a,
          [b.key]: b.value,
        };
      }, {}),
    });
  }
};
export const fetchAPIData = async (datasource: JuggleDV.APIDatasourceInstance) => {
  const res = await getResponse(datasource);

  if (!res.ok) {
    throw new Error('Request error');
  }

  return await res.json();
};
