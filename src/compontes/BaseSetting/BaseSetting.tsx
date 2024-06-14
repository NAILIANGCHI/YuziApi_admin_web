import { Tabs, Form, Button, Checkbox } from 'antd';
import MenuSetting from './compontes/MenuSetting';
const { TabPane } = Tabs;

export default function BaseSetting() {
  
  return (
    <div>
      <Tabs defaultActiveKey="1">
        <TabPane tab="添加菜单" key="1">
        {/* 菜单管理组件 */}
          <MenuSetting />
        </TabPane>
        <TabPane tab="其他设置" key="2">
          <Form name="other-settings">
            <Form.Item
              label="设置项1"
              name="setting1"
              valuePropName="checked"
            >
              <Checkbox>启用设置项1</Checkbox>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                保存
              </Button>
            </Form.Item>
          </Form>
        </TabPane>
      </Tabs>
    </div>
  );
}
