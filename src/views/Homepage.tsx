import React from 'react';
import { Card } from 'antd';
import WeiboHot from '@/compontes/WeiboHot/WeiboHot';

const Homepage: React.FC = () => {
  return (
    <div style={{ padding: '24px', minHeight: '100vh' }}>
      <Card title="热门微博" style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
        <WeiboHot />
      </Card>
    </div>
  );
};

export default Homepage;
