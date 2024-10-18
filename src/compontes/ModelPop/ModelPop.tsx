import React from 'react';
import { Button, Modal, Space } from 'antd';

interface ModelPopProps {
    title: string;
    txt: string;
    func: () => Promise<void>; // 接受一个返回 Promise 的函数
}

const ModelPop: React.FC<ModelPopProps> = ({ title, txt, func }) => {
    const handleConfirm = () => {
        Modal.confirm({
            title: title,
            content: txt,
            onOk: async () => {
                try {
                    await func(); // 调用传入的异步函数
                } catch (error) {
                    console.error("执行失败：", error); // 错误处理
                }
            },
            onCancel() {
                console.log('取消操作');
            },
        });
    };

    return (
        <Space>
            <Button type="primary" onClick={handleConfirm}>
                导出账单
            </Button>
        </Space>
    );
};

export default ModelPop;
