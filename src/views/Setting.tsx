import { useState } from 'react';
import * as Icons from '@ant-design/icons';
import ExpAntDesignIcon from '@/compontes/ExpAntDesingIcon/ExpAntDesignIcon';
import { Tabs, Form, Input, Button, Checkbox, message } from 'antd';
import { addMenu } from '@/utils/request/api/apiList';
import { AxiosResponse, AxiosError } from 'axios';

const { TabPane } = Tabs;

interface IconSelectorProps {
  value?: string;
  onChange?: (value: string) => void;
}

interface AddmenuInterFace {
  displayName: string;
  name: string;
  icon: string;
}

interface ErrorData {
  message: string;
}

// 自定义图标选择组件
const IconSelector: React.FC<IconSelectorProps> = ({ value, onChange }) => {
  const [selectedIcon, setSelectedIcon] = useState<string | null>(value || null);

  const handleIconSelect = (iconName: string) => {
    setSelectedIcon(iconName);
    if (onChange) {
      onChange(iconName);
    }
  };

  const SelectedIconComponent = selectedIcon ? (Icons as any)[selectedIcon] : null;

  return (
    <div>
      <ExpAntDesignIcon onIconSelect={handleIconSelect} />
      {SelectedIconComponent && (
        <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center' }} />
      )}
    </div>
  );
};

export default function Setting() {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const success = (message: string) => {
    messageApi.open({
      type: 'success',
      content: message,
    });
  };

  const errorWindows = (message: string) => {
    messageApi.open({
      type: 'error',
      content: message,
    });
  };

  const onFinishMenu = async (values: any) => {
    const formData = { ...values, icon: values.menuIcon };
    console.log('菜单设置表单值:', formData);
    const data: AddmenuInterFace = {
      displayName: values.menuName,
      name: values.menuPath,
      icon: values.menuIcon,
    };

    try {
      const response: AxiosResponse = await addMenu(data);
      const responseData = response.data;
      if (responseData.code !== '200') {
        console.log(responseData.code);
        errorWindows(responseData.message);
      } else {
        success('提交成功');
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorData: ErrorData = error.response?.data || { message: error.message };
        errorWindows(errorData.message);
      } else {
        errorWindows("发生意外错误");
      }
    }
  };

  const onFinishOther = async (values: any) => {
    console.log('其他设置表单值:', values);
    // try {
    //   const response = await axios.post('/api/other-settings', values);
    //   console.log('服务器响应:', response.data);
    //   message.success('设置保存成功');
    // } catch (error) {
    //   console.error('提交表单失败:', error);
    //   message.error('设置保存失败');
    // }
  };

  return (
    <div>
      {contextHolder}
      <Tabs defaultActiveKey="1">
        <TabPane tab="添加菜单" key="1">
          <Form form={form} name="menu-settings" onFinish={onFinishMenu}>
            <Form.Item
              label="菜单名称"
              name="menuName"
              rules={[{ required: true, message: '请输入菜单名称!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="菜单路径"
              name="menuPath"
              rules={[{ required: true, message: '请输入菜单路径!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="菜单图标"
              name="menuIcon"
              rules={[{ required: true, message: '请选择一个菜单图标!' }]}
              valuePropName="value"
              getValueFromEvent={(value) => value}
            >
              <IconSelector />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                添加
              </Button>
            </Form.Item>
          </Form>
        </TabPane>
        <TabPane tab="其他设置" key="2">
          <Form name="other-settings" onFinish={onFinishOther}>
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
