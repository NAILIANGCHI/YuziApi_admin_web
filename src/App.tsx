import { useRoutes } from "react-router-dom";
import routers from "./router/routerPage";
import { Provider, useSelector, useDispatch } from 'react-redux';
import store, { RootState } from './store';
import { Spin } from "antd";
import React, { useEffect } from 'react';
import { stopLoading, startLoading } from './store/loadingSlice';

const App = () => {
  const outlet = useRoutes(routers);

  return (
    <Provider store={store}>
      <AppContent outlet={outlet} />
    </Provider>
  );
};

const AppContent = ({ outlet }: { outlet: React.ReactNode }) => {
  const loading = useSelector((state: RootState) => state.loading.loading);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(startLoading())
    // Simulate data loading
    setTimeout(() => {
      dispatch(stopLoading());
    }, 2000); // 假设2秒后加载完成
  }, [dispatch]);

  return (
    <Spin spinning={loading}>
      <div>
        {outlet}
      </div>
    </Spin>
  );
};

export default App;
