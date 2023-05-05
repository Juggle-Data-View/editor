import {BaseQueryFn, createApi} from '@reduxjs/toolkit/query/react'
import notice from '@utils/notice';
import { getUserApps } from './userInfo';
import {queryAppByID,queryAppByIDWithoutUser} from './apps'; 
import {  User } from 'parse';

type BaseQueryError = {
  message: string;
  status: number;
};

function extractError(err: Error): BaseQueryError | PromiseLike<BaseQueryError | undefined> | undefined {
  notice.error(err.message);
  throw new Error('Function not implemented.');
}


const baseQuery: BaseQueryFn<
  Promise<unknown>,
  unknown,
  BaseQueryError,
  unknown,
  Record<string, unknown>
> = async (promise) => {
  // https://redux-toolkit.js.org/rtk-query/usage/customizing-queries#basequery-function-return-value
  try {
    return {data: await promise};
  } catch (err: any) {
    return {error: await extractError(err)};
  }
};

const api = createApi({
  baseQuery,
  reducerPath: 'api',
  tagTypes: ['UserApps','AppInfo','AppInfoWithoutUser'],
  endpoints: (build)=>{return {
    getUserApps: build.query<any, string>({
      query: getUserApps,
      providesTags: (result) => {
   
        const user = User.current();
        if (!user) {
          return [{ type: 'UserApps',id: NaN }];
        }
        return [{ type: 'UserApps', id: user.id + result.length }];
      },  
    }),
    queryAppByID: build.query({
      query: queryAppByID,
      providesTags: (_,__,arg) => {
        return [{ type: 'AppInfo', id: arg }];
      }
    }),
    queryAppByIDWithoutUser: build.query({
      query: queryAppByIDWithoutUser,
      providesTags: (_,__,arg) => {
        return [{ type: 'AppInfoWithoutUser', id: arg }];
      }
    }),
  }}
})

export const {useGetUserAppsQuery,useQueryAppByIDQuery,useQueryAppByIDWithoutUserQuery} =api;

export default api;