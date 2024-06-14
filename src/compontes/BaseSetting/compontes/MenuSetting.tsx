import { useState } from 'react';
import * as Icons from '@ant-design/icons';
import ExpAntDesignIcon from '@/compontes/ExpAntDesingIcon/ExpAntDesignIcon';
import { Form, Input, Button, message, Table } from 'antd';
import type { TableColumnsType } from 'antd';
import { addMenu } from '@/utils/request/api/apiList';
import { AxiosResponse, AxiosError } from 'axios';



interface DataType {
    key: React.Key;
    name: string;
    age: number;
    address: string;
  }

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

  
export default function MenuSetting() {
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
      name: '/' + values.menuPath,
      icon: values.menuIcon,
    };

    try {
      const response: AxiosResponse = await addMenu(data);
      const responseData = response.data;
      if (responseData.code !== '200') {
        console.log(responseData.code);
        errorWindows(responseData.message);
      } else {
        success('添加成功');
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

  
const columns: TableColumnsType<DataType> = [
    {
      title: '菜单名',
      width: 100,
      dataIndex: 'name',
      key: 'name',
      fixed: 'left',
    },
    {
      title: '创建时间',
      width: 100,
      dataIndex: 'age',
      key: 'age',
      fixed: 'left',
    },
    {
      title: '更新时间',
      dataIndex: 'address',
      key: '1',
      width: 100,
    },
    {
      title: '路径名',
      dataIndex: 'address',
      key: '1',
      width: 100,
    },
    {
        title: 'Icon图标',
        dataIndex: 'address',
        key: '1',
        width: 100,
    },
    // { title: 'Column 8', dataIndex: 'address', key: '8' },
    {
      title: '操作',
      key: 'operation',
      fixed: 'right',
      width: 100,
      render: () => <div><a>修改</a> | <a>删除</a></div>
    },
  ];

  const data: DataType[] = [];
  for (let i = 0; i < 15; i++) {
    data.push({
      key: i,
      name: `Edward ${i}`,
      age: 32,
      address: `London Park no. ${i}`,
    });
  }
  return (
    <div>
        {contextHolder}
        <Form form={form} name="menu-settings" onFinish={onFinishMenu} layout="inline">
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
            <Table columns={columns} dataSource={data} scroll={{ x: 1500, y: 500 }} style={{marginTop: '30px'}}/>
        </Form>
    </div>
  )
}