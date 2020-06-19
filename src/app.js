import { createApp, request, IAppConfig } from 'ice';
import React from 'react';
// const rootUrl = 'http://localhost:3000' 
//腾讯云服务地址
const rootUrl = 'http://49.234.40.20:3000'  
const appConfig = {
  app: {
    rootId: 'ice-container',
    ErrorBoundaryFallback: <div>页面出错</div>,
    request: [
      {
        baseURL: rootUrl,
        // ...RequestConfig 其他参数
      }
    ]
  //   getInitialData: async () => {
  //     // 模拟服务端返回的数据
  //     const data = await request(`${rootUrl}/api/auth`);
  //     const { role, starPermission, followPermission } = data;

  //     // 约定权限必须返回一个 auth 对象
  //     // 返回的每个值对应一条权限
  //     return {
  //       auth: {
  //         admin: role === 'admin',
  //         guest: role === 'guest',
  //         starRepo: starPermission,
  //         followRepo: followPermission
  //       }
  //     }
  //   },
  // },
  // auth: {
  //   // 可选的，设置无权限时的展示组件，默，设置无权限时的展示组件，默认为 null
  //   NoAuthFallback: <span>没有权限...</span>,
  }
};
createApp(appConfig);
