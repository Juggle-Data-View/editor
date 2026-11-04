import { JuggleDV } from '@juggle-data-view/types';
import { baseURL } from '@utils/request';

export const fetchCSVData = async (datasource: JuggleDV.ExeclDatasourceInstance) => {
  return [];
};

const getUrl = (isPost: boolean, url: string, params: JuggleDV.APIDatasourceInstance['dataParams']) => {
  if (isPost) {
    return url;
  }
  const query = ((params as JuggleDV.DataParam[]) || []).reduce((acc, item, index) => {
    if (!item.name) {
      return acc;
    }
    return `${acc}${index > 0 && acc ? '&' : ''}${item.name}=${item.value}`;
  }, '');
  return query ? `${url}?${query}` : url;
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
    const headers = header?.reduce(
      (acc, item) => {
        if (item.key) {
          return { ...acc, [item.key]: item.value };
        }
        return acc;
      },
      isPost ? { 'Content-type': 'application/json;charset=UTF-8' } : {}
    );
    const option = {
      ...params,
      method,
      headers,
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
