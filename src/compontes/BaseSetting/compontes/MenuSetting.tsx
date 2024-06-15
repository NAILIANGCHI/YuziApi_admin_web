import { useEffect, useState } from 'react';
import * as Icons from '@ant-design/icons';
import ExpAntDesignIcon from '@/compontes/ExpAntDesingIcon/ExpAntDesignIcon';
import { Form, Input, Button, message, Table, Switch } from 'antd';
import type { TableColumnsType } from 'antd';
import { addMenu, getMenuList as requestMenuList, updateMenuStatus } from '@/utils/request/api/apiList';
import { stopLoading, startLoading } from '@/store/loadingSlice';
import { useDispatch } from 'react-redux';
import { AxiosResponse, AxiosError } from 'axios';

interface DataType {
    key: React.Key;
    displayName: string;
    createTime: string;
    updateTime: string;
    name: string;
    icon: string;
    isStart: boolean;
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
                <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center' }}>
                    <SelectedIconComponent style={{ fontSize: '24px' }} />
                </div>
            )}
        </div>
    );
};

export default function MenuSetting() {
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const dispatch = useDispatch();
    const [menuListData, setMenuListData] = useState<DataType[]>([]);

    const success = (msg: string) => {
        messageApi.open({
            type: 'success',
            content: msg,
        });
    };

    const errorWindows = (msg: string) => {
        messageApi.open({
            type: 'error',
            content: msg,
        });
    };

    const onFinishMenu = async (values: any) => {
        dispatch(startLoading());
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
                dispatch(stopLoading());
                errorWindows(responseData.message);
            } else {
                dispatch(stopLoading());
                success('添加成功');
                // 重新获取菜单列表
                getMenuList();
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                const errorData: ErrorData = error.response?.data || { message: error.message };
                dispatch(stopLoading());
                errorWindows(errorData.message);
            } else {
                dispatch(stopLoading());
                errorWindows("发生意外错误");
            }
        }
    };

    // 更新状态
    const handleStatusChange = async (key: React.Key) => {
        dispatch(startLoading());
        try {
            console.log(key)
            const response: AxiosResponse = await updateMenuStatus(key);
            const responseData = response.data;
            if (responseData.code === '200') {
                success('状态更新成功');
                getMenuList();
            } else {
                errorWindows(responseData.message);
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                const errorData: ErrorData = error.response?.data || { message: error.message };
                errorWindows(errorData.message);
            } else {
                errorWindows("发生意外错误");
            }
        } finally {
            dispatch(stopLoading());
        }
    };

    const columns: TableColumnsType<DataType> = [
        {
            title: '菜单名',
            width: 100,
            dataIndex: 'displayName',
            key: 'displayName',
            fixed: 'left',
        },
        {
            title: '创建时间',
            width: 100,
            dataIndex: 'createTime',
            key: 'createTime',
            fixed: 'left',
        },
        {
            title: '更新时间',
            dataIndex: 'updateTime',
            key: 'updateTime',
            width: 100,
        },
        {
            title: '路径名',
            dataIndex: 'name',
            key: 'name',
            width: 100,
        },
        {
            title: 'Icon图标',
            dataIndex: 'icon',
            key: 'icon',
            width: 100,
            render: (icon: string) => {
                const IconComponent = (Icons as any)[icon];
                return IconComponent ? <IconComponent style={{ fontSize: '24px' }} /> : null;
            },
        },
        {
            title: '启用',
            dataIndex: 'isStart',
            key: 'isStart',
            width: 100,
            render: (isStart: boolean, record) => (
                <Switch checkedChildren="开启" unCheckedChildren="关闭" defaultChecked
                    checked={isStart}
                    onChange={() => handleStatusChange(record.key)} // 这里确保传递了正确的 key
                />
            ),
        },
        {
            title: '操作',
            key: 'operation',
            fixed: 'right',
            width: 100,
            render: (_ , record) => (
                <div key={record.key}>
                    <a>修改</a> | <a>管理</a> | <a>删除</a>
                </div>
            ),
        },
    ];

    const getMenuList = async () => {
        dispatch(startLoading());
        try {
            const response: AxiosResponse = await requestMenuList();
            const responseData = response.data;
            if (responseData.code !== '200') {
                console.log(responseData.code);
                dispatch(stopLoading());
                errorWindows(responseData.message);
            } else if (responseData.data.length === 0) {
                dispatch(stopLoading());
                errorWindows("服务器获取失败");
            } else {
                const formattedData: DataType[] = responseData.data.map((item: any) => ({
                    key: item.id,  // 使用唯一标识符作为 key
                    displayName: item.displayName,
                    createTime: item.createTime,
                    updateTime: item.updateTime,
                    name: item.name,
                    icon: item.icon,
                    isStart: item.isStart, // 假设你的 API 返回 isStart 字段
                }));
                dispatch(stopLoading());
                setMenuListData(formattedData);
                console.log(formattedData);
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                const errorData: ErrorData = error.response?.data || { message: error.message };
                dispatch(stopLoading());
                errorWindows(errorData.message);
            } else {
                dispatch(stopLoading());
                errorWindows("发生意外错误");
            }
        }
    };

    useEffect(() => {
        getMenuList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
            </Form>
            <Table columns={columns} dataSource={menuListData} scroll={{ x: 1500, y: 500 }} style={{ marginTop: '30px' }} />
        </div>
    );
}
