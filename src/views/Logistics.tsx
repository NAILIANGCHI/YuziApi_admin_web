import React, { useEffect, useState } from 'react';
import { message, Table, Divider, Button, Modal, Descriptions } from 'antd';
import { getWpsAllData } from '@/utils/request/api/apiList'; // 假设这是获取数据的 API
import { useDispatch } from 'react-redux';
import { startLoading, stopLoading } from '@/store/loadingSlice';
import { AxiosResponse, AxiosError } from 'axios';
import Draggable from 'react-draggable'; // 引入 Draggable

interface WpsAllDataResponse {
    serialNumber: number;
    sellerShipmentDate: string;
    customerDeliveryTrackingNumber: string;
    carrierTrackingNumber: string;
    transferWarehouseInDate: string;
    transferDispatchDate: string;
    moscowPickupDate: string;
    overseasWarehouseInDate: string;
    orderStatus: string;
    customerCode: string;
    customerType: string;
    customerName: string;
    logisticsMode: string;
    warehousingNumber: string;
    productName: string;
    category: string;
    value: string;
    skuTotalCount: number;
    boxCount: number;
    customerPackagingTotalWeight: string;
    customerPackagingTotalVolume: string;
    originalWeightAfterWrapping: string;
    originalVolumeAfterWrapping: string;
    densityAfterWrapping: string;
    customerUnitPrice: string;
    customerFreight: string;
    customerShelvingFee: string;
    customerMiscellaneousFees: string;
    insuranceFee: string;
    remarks: string;
    customerInitialBillingTotal: string;
    customerPaymentDate: string;
}

const Logistics: React.FC = () => {
    const dispatch = useDispatch();
    const [messageApi, contextHolder] = message.useMessage();
    const [dataSource, setDataSource] = useState<WpsAllDataResponse[]>([]);
    const [selectedItem, setSelectedItem] = useState<WpsAllDataResponse | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);
    const [isModalVisible, setIsModalVisible] = useState(false); // 用于控制 Modal 可见性
    const [disabled, setDisabled] = useState(true); // 控制拖拽开关
    const [bounds, setBounds] = useState({ left: 0, top: 0, bottom: 0, right: 0 });

    const errorWindows = (message: string) => {
        messageApi.open({
            type: 'error',
            content: message,
        });
    };

    interface ErrorData {
        message: string;
    }

    const fetchData = async () => {
        dispatch(startLoading());

        try {
            const response: AxiosResponse = await getWpsAllData();
            const responseData = response.data;

            if (responseData.code !== '200') {
                errorWindows(responseData.message);
            } else if (responseData.data.length === 0) {
                errorWindows("没有数据");
            } else {
                setDataSource(responseData.data);
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

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpenDetail = (item: WpsAllDataResponse) => {
        setSelectedItem(item);
        setIsModalVisible(true); // 打开 Modal
    };

    const handleCloseDetail = () => {
        setSelectedItem(null);
        setIsModalVisible(false); // 关闭 Modal
    };

    const formatNumber = (num: string) => {
        return Number(num).toFixed(2);
    };

    const columns = [
        {
            title: '序号',
            dataIndex: 'serialNumber',
            key: 'serialNumber',
        },
        {
            title: '客户代码',
            dataIndex: 'customerCode',
            key: 'customerCode',
        },
        {
            title: '入库单号',
            dataIndex: 'warehousingNumber',
            key: 'warehousingNumber',
        },
        {
            title: '箱数',
            dataIndex: 'boxCount',
            key: 'boxCount',
        },
        {
            title: '物流模式',
            dataIndex: 'logisticsMode',
            key: 'logisticsMode',
        },
        {
            title: '承运商物流单号',
            dataIndex: 'carrierTrackingNumber',
            key: 'carrierTrackingNumber',
        },
        {
            title: '发货时间',
            dataIndex: 'sellerShipmentDate',
            key: 'sellerShipmentDate',
        },
        {
            title: '头程费用合计',
            dataIndex: 'customerInitialBillingTotal',
            key: 'customerInitialBillingTotal',
            render: (text: string) => <span>{formatNumber(text)}</span>,
        },
        {
            title: '操作',
            key: 'action',
            render: (_text: string, record: WpsAllDataResponse) => (
                <Button type="link" onClick={() => handleOpenDetail(record)}>查看详情</Button>
            ),
        },
    ];

    const onStart = (event: any, uiData: any) => {
        // eslint-disable-next-line no-unsafe-optional-chaining
        const { clientWidth, clientHeight } = window?.document?.documentElement;
        const targetRect = (event?.target as HTMLElement).getBoundingClientRect();
        setBounds({
            left: -targetRect.left + uiData.x,
            right: clientWidth - (targetRect.right - uiData.x),
            top: -targetRect.top + uiData.y,
            bottom: clientHeight - (targetRect.bottom - uiData.y),
        });
    };

    return (
        <div>
            {contextHolder}
            <Divider />
            <Table
                dataSource={dataSource}
                columns={columns}
                rowKey="serialNumber"
                pagination={{
                    current: currentPage,
                    pageSize,
                    onChange: (page) => setCurrentPage(page),
                    total: dataSource.length,
                }}
            />
            {selectedItem && (
                <Modal
                    title={
                        <div
                            style={{ width: '100%', cursor: 'move' }}
                            onMouseOver={() => setDisabled(false)}
                            onMouseOut={() => setDisabled(true)}
                        >
                            详细信息
                        </div>
                    }
                    visible={isModalVisible}
                    onCancel={handleCloseDetail}
                    footer={null}
                    modalRender={(modal) => (
                        <Draggable
                            disabled={disabled}
                            bounds={bounds}
                            onStart={(event, uiData) => onStart(event, uiData)}
                        >
                            <div>{modal}</div>
                        </Draggable>
                    )}
                    bodyStyle={{
                        maxHeight: '650px', // 限制弹窗内容区域的最大高度
                        overflowY: 'auto', // 启用滚动条
                    }}
                >
                    <Descriptions bordered column={1}>
                        <Descriptions.Item label="序号">{selectedItem.serialNumber}</Descriptions.Item>
                        <Descriptions.Item label="卖家发货日期">{selectedItem.sellerShipmentDate}</Descriptions.Item>
                        <Descriptions.Item label="客户交货物流单号">{selectedItem.customerDeliveryTrackingNumber}</Descriptions.Item>
                        <Descriptions.Item label="承运商物流单号">{selectedItem.carrierTrackingNumber}</Descriptions.Item>
                        <Descriptions.Item label="中转仓入库日期">{selectedItem.transferWarehouseInDate}</Descriptions.Item>
                        <Descriptions.Item label="中转发运日期">{selectedItem.transferDispatchDate}</Descriptions.Item>
                        <Descriptions.Item label="莫斯科提货日期">{selectedItem.moscowPickupDate}</Descriptions.Item>
                        <Descriptions.Item label="海外仓入库日期">{selectedItem.overseasWarehouseInDate}</Descriptions.Item>
                        <Descriptions.Item label="订单状态">{selectedItem.orderStatus}</Descriptions.Item>
                        <Descriptions.Item label="客户类型">{selectedItem.customerType}</Descriptions.Item>
                        <Descriptions.Item label="客户名称">{selectedItem.customerName}</Descriptions.Item>
                        <Descriptions.Item label="物流模式">{selectedItem.logisticsMode}</Descriptions.Item>
                        <Descriptions.Item label="入库单号">{selectedItem.warehousingNumber}</Descriptions.Item>
                        <Descriptions.Item label="商品名称">{selectedItem.productName}</Descriptions.Item>
                        <Descriptions.Item label="品类">{selectedItem.category}</Descriptions.Item>
                        <Descriptions.Item label="货值">{formatNumber(selectedItem.value)}</Descriptions.Item>
                        <Descriptions.Item label="SKU总数">{selectedItem.skuTotalCount}</Descriptions.Item>
                        <Descriptions.Item label="箱数">{selectedItem.boxCount}</Descriptions.Item>
                        <Descriptions.Item label="客户包装总重量">{formatNumber(selectedItem.customerPackagingTotalWeight)}</Descriptions.Item>
                        <Descriptions.Item label="客户包装总方数">{formatNumber(selectedItem.customerPackagingTotalVolume)}</Descriptions.Item>
                        <Descriptions.Item label="原缠后总重量">{formatNumber(selectedItem.originalWeightAfterWrapping)}</Descriptions.Item>
                        <Descriptions.Item label="原缠后总方数">{formatNumber(selectedItem.originalVolumeAfterWrapping)}</Descriptions.Item>
                        <Descriptions.Item label="密度（原缠后）">{formatNumber(selectedItem.densityAfterWrapping)}</Descriptions.Item>
                        <Descriptions.Item label="客户单价">{formatNumber(selectedItem.customerUnitPrice)}</Descriptions.Item>
                        <Descriptions.Item label="客户运费">{formatNumber(selectedItem.customerFreight)}</Descriptions.Item>
                        <Descriptions.Item label="客户上架费">{formatNumber(selectedItem.customerShelvingFee)}</Descriptions.Item>
                        <Descriptions.Item label="客户杂费">{formatNumber(selectedItem.customerMiscellaneousFees)}</Descriptions.Item>
                        <Descriptions.Item label="保险费">{formatNumber(selectedItem.insuranceFee)}</Descriptions.Item>
                        <Descriptions.Item label="备注说明">{selectedItem.remarks}</Descriptions.Item>
                        <Descriptions.Item label="客户头程账单合计">{formatNumber(selectedItem.customerInitialBillingTotal)}</Descriptions.Item>
                        <Descriptions.Item label="客户付款日期">{selectedItem.customerPaymentDate}</Descriptions.Item>
                    </Descriptions>
                </Modal>
            )}
        </div>
    );
};

export default Logistics;
