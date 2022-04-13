import { JuggleDV } from '@juggle-data-view/types';
export const fetchCSVData = async (code: string, dataConfig: JuggleDV.CompDataConfig) => {
  return [];
};

export const fetchAPIData = async (dataConfig: JuggleDV.CompDataConfig, datasource: JuggleDV.APIDatasourceInstance) => {
  const { url } = datasource;
  const res = await fetch('http://localhost:28791/APISrouce?proxyurl=' + url, {
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error('Request error');
  }

  console.log(res.body);

  return [];
};
