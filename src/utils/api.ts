import * as API_URL from '@utils/api-url';
import request from '@utils/request';
import {
  // qs,
  getParentURL,
} from 'utils';
import { HttpMethod } from '@configurableComponents/const';
import { JuggleDV } from '@juggle-data-view/types';

// const { release } = qs.query;
// const RELEASE_CODE = typeof release === 'string' && release ? release : '';

/**
 * Load app config
 */
export const fetchAppConfig = (id: number) => {
  return request<JuggleDV.AppConfig>({
    url: API_URL.APP_CONFIG,
    credentials: 'include',
    params: { app: id },
    headers: {
      'X-Referer': getParentURL(),
    },
  });
};

/**
 * load released app config
 * @param releaseCode string
 */
export const fetchReleaseAppConfig = (releaseCode: string) => {
  return request<JuggleDV.AppConfig>({
    url: API_URL.RELEASE_APP_CONFIG,
    credentials: 'include',
    params: { release: releaseCode },
    headers: {
      'X-Referer': getParentURL(),
    },
  });
};

/**
 * create canvas
 * @param payload default canvas configurion
 */
export const createCanvas = (payload: JuggleDV.Canvas) => {
  return request<number>({
    url: API_URL.CANVAS,
    method: HttpMethod.POST,
    credentials: 'include',
    data: payload,
  });
};
