import React, { useEffect, useState } from 'react';
import { getWeiboHot } from '@/utils/request/api/apiList';
import { message } from 'antd';
import { stopLoading, startLoading } from '@/store/loadingSlice';
import { useDispatch } from 'react-redux';
import { AxiosResponse, AxiosError } from 'axios';

import { Typography, Divider, Collapse } from 'antd';

const { Text } = Typography;
const { Panel } = Collapse;

interface WeiboItem {
  rank: string;
  title: string;
  type: string;
  hot: string;
  time: string;
}

const WeiboHot: React.FC = () => {
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const [dataSource, setDataSource] = useState<WeiboItem[]>([]);

  const errorWindows = (message: string) => {
    messageApi.open({
      type: 'error',
      content: message,
    });
  };

  interface ErrorData {
    message: string;
  }

  const getWeiboHotList = async () => {
    dispatch(startLoading());

    try {
      const response: AxiosResponse = await getWeiboHot();
      const responseData = response.data;
      if (responseData.code !== '200') {
        console.log(responseData.code);
        errorWindows(responseData.message);
      } else if (responseData.data.length === 0) {
        errorWindows("服务器获取失败");
      } else {
        setDataSource(responseData.data);
        console.log(responseData.data);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorData: ErrorData = error.response?.data || { message: error.message };
        errorWindows(errorData.message);
      } else {
        errorWindows("发生意外错误");
      }
    } finally {
        dispatch(stopLoading())
    }
  }

  useEffect(() => {
    getWeiboHotList();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      {contextHolder}
      {/* <Title level={2} style={{ textAlign: 'center' }}>微博热搜</Title> */}
      <Divider />
      <Collapse defaultActiveKey={['0']} ghost>
        {dataSource.map((item) => (
          <Panel header={`${item.rank}: ${item.title}`} key={item.rank} style={{paddingLeft: '20px'}}>
            <Text><strong>类型:</strong> {item.type}</Text><br />
            <Text><strong>热度:</strong> {item.hot}</Text><br />
            <Text><strong>时间:</strong> {item.time}</Text>
          </Panel>
        ))}
      </Collapse>
    </div>
  );
};

export default WeiboHot;
