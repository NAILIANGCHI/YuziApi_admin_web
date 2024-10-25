import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Typography, InputNumber, Table, message } from 'antd';
// import {startLoading, stopLoading} from "@/store/loadingSlice.ts";
// import {AxiosError, AxiosResponse} from "axios";
// import { exportQuotation} from "@/utils/request/api/apiList.ts";
// import {useDispatch} from "react-redux";

const { Title } = Typography;

// 定义表单数据的类型
interface DynamicRow {
    index: number;
    transitTime: string;
    freightUnitPrice: number;
    packingFee: number;
    palletFee: number;
    crateFee: number;
    totalCost: number;
}

interface FormData {
    customerCode: string;
    trackingNumber: string;
    itemName: string;
    destination: string;
    productCategory: string;
    quantity: number;
    weight: number;
    volume: number;
    density: number;
    value: number;
    insuranceFee: number;
    pickupFee: number;
    shelvingUnitPrice: number;
    shelvingFee: number;
    dynamicRows: DynamicRow[];
}

// interface ErrorData {
//     message: string;
// }

const FreightCalculator: React.FC = () => {
    // const dispatch = useDispatch();
    const [messageApi, contextHolder] = message.useMessage();
    const [formData, setFormData] = useState<FormData>({
        customerCode: '',
        trackingNumber: '',
        itemName: '',
        destination: '',
        productCategory: '',
        quantity: 0,
        weight: 0,
        volume: 0,
        density: 0,
        value: 0,
        insuranceFee: 0,
        pickupFee: 0,
        shelvingUnitPrice: 0,
        shelvingFee: 0,
        dynamicRows: [{ index: 0, transitTime: '', freightUnitPrice: 0, packingFee: 0, palletFee: 0, crateFee: 0, totalCost: 0 }],
    });

    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({}); // 存储表单错误信息

    useEffect(() => {
        errorWindows("功能开发中...")
        const newDensity = calculateDensity();
        const newShelvingFee = calculateShelvingFee(formData.shelvingUnitPrice, formData.weight);
        setFormData(prevState => ({
            ...prevState,
            density: newDensity,
            shelvingFee: newShelvingFee,
        }));
    }, [formData.weight, formData.volume, formData.shelvingUnitPrice]); // 依赖于重量、体积和上架费单价

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleNumberChange = (name: keyof FormData, value: number | null) => {
        setFormData({
            ...formData,
            [name]: value !== null ? value : 0, // 处理 null 的情况
        });
    };

    const calculateShelvingFee = (unitPrice: number, weight: number) => {
        return unitPrice * weight; // 直接返回数字
    };

    const calculateDensity = () => {
        const { weight, volume } = formData;
        return volume > 0 ? weight / volume : 0;
    };

    const addDynamicRow = () => {
        if (formData.dynamicRows.length < 3) {
            const newIndex = formData.dynamicRows.length;
            setFormData({
                ...formData,
                dynamicRows: [...formData.dynamicRows, {
                    index: newIndex,
                    transitTime: '',
                    freightUnitPrice: 0,
                    packingFee: 0,
                    palletFee: 0,
                    crateFee: 0,
                    totalCost: 0
                }],
            });
        } else {
            message.warning('最多只能添加三个动态列！');
        }
    };

    const removeDynamicRow = (index: number) => {
        if (formData.dynamicRows.length > 1) {
            const newDynamicRows = formData.dynamicRows.filter(row => row.index !== index);
            setFormData({
                ...formData,
                dynamicRows: newDynamicRows.map((row, idx) => ({ ...row, index: idx })), // 更新索引
            });
        } else {
            message.warning('至少需要保留一个动态列！');
        }
    };

    const handleDynamicChange = (index: number, name: keyof DynamicRow, value: any) => {
        const newDynamicRows = formData.dynamicRows.map((row, i) => {
            if (i === index) {
                return { ...row, [name]: value };
            }
            return row;
        });
        setFormData({
            ...formData,
            dynamicRows: newDynamicRows,
        });
    };

    const calculateFixedCost = () => {
        return (
            Number(formData.insuranceFee) +
            Number(formData.pickupFee) +
            Number(formData.shelvingFee) // 使用计算后的上架费
        );
    };
    const calculateDynamicTotal = (row: DynamicRow) => {
        const totalFixedCost = calculateFixedCost();
        const dynamicCost = (Number(row.freightUnitPrice) * formData.weight) + Number(row.packingFee) + Number(row.palletFee) + Number(row.crateFee);
        console.log("我是总费用所调用的函数")

        return totalFixedCost + dynamicCost; // 将固定列费用和动态列费用相加
    };


    const validateForm = () => {
        const errors: { [key: string]: string } = {};
        if (!formData.customerCode) errors.customerCode = '客户代码为必填项';
        if (!formData.trackingNumber) errors.trackingNumber = '运单号为必填项';
        if (!formData.itemName) errors.itemName = '品名为必填项';
        if (!formData.destination) errors.destination = '目的地为必填项';
        if (!formData.productCategory) errors.productCategory = '产品分类为必填项';
        if (formData.quantity <= 0) errors.quantity = '件数为必填项';
        if (formData.weight <= 0) errors.weight = '重量kg为必填项';
        if (formData.volume <= 0) errors.volume = '体积m³为必填项';

        formData.dynamicRows.forEach((row, index) => {
            if (!row.transitTime) errors[`transitTime_${index}`] = '时效为必填项';
            if (row.freightUnitPrice <= 0) errors[`freightUnitPrice_${index}`] = '运费单价为必填项';
            if (row.packingFee < 0) errors[`packingFee_${index}`] = '打包费为必填项';
            if (row.palletFee < 0) errors[`palletFee_${index}`] = '木架木托费用为必填项';
            if (row.crateFee < 0) errors[`crateFee_${index}`] = '木箱费为必填项';
        });

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            message.error('请填写所有必填项！');
            return
        }
        // const updatedDynamicRows = formData.dynamicRows.map(row => {
        //     const totalFixedCost = calculateFixedCost();
        //     const dynamicCost = (Number(row.freightUnitPrice) * formData.weight) + Number(row.packingFee) + Number(row.palletFee) + Number(row.crateFee);
        //     const totalCost = totalFixedCost + dynamicCost;
        //
        //     return {
        //         ...row,
        //         totalCost: totalCost, // 计算并加入 totalCost
        //     };
        // });
        //
        // const payload = {
        //     ...formData,
        //     density: calculateDensity(),
        //     shelvingFee: calculateShelvingFee(formData.shelvingUnitPrice, formData.weight), // 计算上架费
        //     totalFixedCost: calculateFixedCost(),
        //     dynamicRows: updatedDynamicRows, // 更新的 dynamicRows 包含 totalCost
        // };
        // // 这里可以添加发送请求到后端的逻辑
        // dispatch(startLoading());
        // try {
        //     const response: AxiosResponse = await exportQuotation(payload);
        //     const responseData = response.data;
        //     console.log(responseData)
        //     if (responseData.code !== '200') {
        //         errorWindows(responseData.message);
        //     } else if (responseData.message == "success") {
        //         successWindows("ok");
        //     }
        // } catch (error) {
        //     if (error instanceof AxiosError) {
        //         const errorData: ErrorData = error.response?.data || {message: error.message};
        //         errorWindows(errorData.message);
        //     } else {
        //         errorWindows("发生意外错误");
        //     }
        // } finally {
        //     dispatch(stopLoading());
        // }
    };

    const errorWindows = (msg: string) => {
        messageApi.open({
            type: 'error',
            content: msg,
        });
    };

    // const successWindows = (msg: string) => {
    //     messageApi.open({
    //         type: 'success',
    //         content: msg,
    //     });
    // };

    const columns = [
        {
            title: '时效',
            dataIndex: 'transitTime',
            render: (text: string, record: DynamicRow) => (
                <Input
                    value={text}
                    onChange={(e) => handleDynamicChange(record.index, 'transitTime', e.target.value)}
                    required
                    style={{ borderColor: formErrors[`transitTime_${record.index}`] ? 'red' : '' }}
                />
            ),
        },
        {
            title: '运费单价',
            dataIndex: 'freightUnitPrice',
            render: (text: number, record: DynamicRow) => (
                <InputNumber
                    value={text}
                    onChange={(value) => handleDynamicChange(record.index, 'freightUnitPrice', value)}
                    required
                    style={{ borderColor: formErrors[`freightUnitPrice_${record.index}`] ? 'red' : '' }}
                />
            ),
        },
        {
            title: '打包费',
            dataIndex: 'packingFee',
            render: (text: number, record: DynamicRow) => (
                <InputNumber
                    value={text}
                    onChange={(value) => handleDynamicChange(record.index, 'packingFee', value)}
                    required
                    style={{ borderColor: formErrors[`packingFee_${record.index}`] ? 'red' : '' }}
                />
            ),
        },
        {
            title: '木架木托费用',
            dataIndex: 'palletFee',
            render: (text: number, record: DynamicRow) => (
                <InputNumber
                    value={text}
                    onChange={(value) => handleDynamicChange(record.index, 'palletFee', value)}
                    required
                    style={{ borderColor: formErrors[`palletFee_${record.index}`] ? 'red' : '' }}
                />
            ),
        },
        {
            title: '木箱费',
            dataIndex: 'crateFee',
            render: (text: number, record: DynamicRow) => (
                <InputNumber
                    value={text}
                    onChange={(value) => handleDynamicChange(record.index, 'crateFee', value)}
                    required
                    style={{ borderColor: formErrors[`crateFee_${record.index}`] ? 'red' : '' }}
                />
            ),
        },
        {
            title: '总费用',
            render: (_text: string, record: DynamicRow) => {
                const totalCost = calculateDynamicTotal(record);
                return <span>{totalCost.toFixed(2)} 元</span>;
            },
        },
        {
            title: '操作',
            render: (_text: string, record: DynamicRow) => (
                <Button onClick={() => removeDynamicRow(record.index)} type="link" danger>
                    删除
                </Button>
            ),
        },
    ];

    return (
        <div style={{
            maxWidth: 1000,
            margin: '0 auto',
            border: '1px solid #d9d9d9',
            borderRadius: '8px',
            padding: '24px',
            backgroundColor: '#fff',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        }}>
            {contextHolder}
            <Title level={2} style={{ textAlign: 'center' }}>报价单制作</Title>
            <Form layout="vertical" onFinish={handleSubmit}>
                <Form.Item label="客户代码" required>
                    <Input name="customerCode" value={formData.customerCode} onChange={handleChange} />
                </Form.Item>
                <Form.Item label="运单号" required>
                    <Input name="trackingNumber" value={formData.trackingNumber} onChange={handleChange} />
                </Form.Item>
                <Form.Item label="品名" required>
                    <Input name="itemName" value={formData.itemName} onChange={handleChange} />
                </Form.Item>
                <Form.Item label="目的地" required>
                    <Input name="destination" value={formData.destination} onChange={handleChange} />
                </Form.Item>
                <Form.Item label="产品分类" required>
                    <Input name="productCategory" value={formData.productCategory} onChange={handleChange} />
                </Form.Item>
                <Form.Item label="件数" required>
                    <InputNumber
                        min={1}
                        value={formData.quantity}
                        onChange={(value) => handleNumberChange('quantity', value)}
                    />
                </Form.Item>
                <Form.Item label="重量kg" required>
                    <InputNumber
                        min={1}
                        value={formData.weight}
                        onChange={(value) => handleNumberChange('weight', value)}
                    />
                </Form.Item>
                <Form.Item label="体积m³" required>
                    <InputNumber
                        min={0}
                        value={formData.volume}
                        onChange={(value) => handleNumberChange('volume', value)}
                    />
                </Form.Item>
                <Form.Item label="密度" required>
                    <Input style={{width: "100px"}} value={formData.density.toFixed(2)} readOnly />
                </Form.Item>
                <Form.Item label="货值" required>
                    <InputNumber
                        min={0}
                        value={formData.value}
                        onChange={(value) => handleNumberChange('value', value)}
                    />
                </Form.Item>
                <Form.Item label="保险费" required>
                    <InputNumber
                        min={0}
                        value={formData.insuranceFee}
                        onChange={(value) => handleNumberChange('insuranceFee', value)}
                    />
                </Form.Item>
                <Form.Item label="提货费" required>
                    <InputNumber
                        min={0}
                        value={formData.pickupFee}
                        onChange={(value) => handleNumberChange('pickupFee', value)}
                    />
                </Form.Item>
                <Form.Item label="上架费单价" required>
                    <InputNumber
                        min={0}
                        value={formData.shelvingUnitPrice}
                        onChange={(value) => handleNumberChange('shelvingUnitPrice', value)}
                    />
                </Form.Item>
                <Form.Item label="上架费" required>
                    <Input style={{width: "100px"}} value={formData.shelvingFee.toFixed(2)} readOnly />
                </Form.Item>

                <Title level={4} style={{ textAlign: 'center' }}>新增时效<span style={{fontSize: '15px', color: "red"}}>功能开发中...</span></Title>
                <Button type="dashed" onClick={addDynamicRow} style={{ marginBottom: 16 }}>
                    添加动态列
                </Button>
                <Table
                    dataSource={formData.dynamicRows}
                    columns={columns}
                    pagination={false}
                    rowKey="index"
                    style={{ marginBottom: 24 }}
                />

                <Form.Item>
                    <Button type="primary" htmlType="submit" style={{ width: '100%' }} >
                        提交
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};
export default FreightCalculator;
