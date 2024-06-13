import React, { useState } from 'react';
import * as Icons from '@ant-design/icons';
import { Button, List, Pagination, Input, Modal } from 'antd';

const { Search } = Input;

interface ExpAntDesignIconProps {
  onIconSelect: (iconName: string) => void;
}

const ExpAntDesignIcon: React.FC<ExpAntDesignIconProps> = ({ onIconSelect }) => {
  
  // const [visible, setVisible] = useState(false); # 官方废弃
  const [open, setOpen] = useState(true)
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const pageSize = 20; // 每页展示的图标数量

  // 获取所有以 'Outlined' 结尾的图标名称
  const iconNames = Object.keys(Icons).filter(name => name.endsWith('Outlined'));

  // 根据搜索关键字过滤图标
  const filteredIcons = iconNames.filter(iconName =>
    iconName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 分页后的图标数据
  const paginatedIcons = filteredIcons.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // 处理图标选择
  const handleIconClick = (iconName: string) => {
    setSelectedIcon(iconName);
    onIconSelect(iconName);
    setOpen(false); // 选择图标后关闭模态窗口
  };

  // 处理分页变化
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // 处理搜索输入变化
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // 搜索时重置为第一页
  };

  const SelectedIconComponent = selectedIcon ? (Icons as any)[selectedIcon] : null;

  return (
    <div>
      <Button onClick={() => setOpen(true)}>选择图标</Button>
      {SelectedIconComponent && <SelectedIconComponent style={{ fontSize: '24px', marginLeft: '10px' }} />}
      
      <Modal
        title="选择图标"
        // visible={visible}
        open = {open}
        onCancel={() => setOpen(false)}
        footer={null}
        width={800}
      >
        <Search
          placeholder="输入图标名称搜索"
          value={searchTerm}
          onChange={handleSearchChange}
          style={{ marginBottom: '20px' }}
        />
        <List
          grid={{ gutter: 16, column: 4 }}
          dataSource={paginatedIcons}
          renderItem={iconName => {
            const IconComponent = (Icons as any)[iconName];
            return (
              <List.Item onClick={() => handleIconClick(iconName)}>
                <IconComponent style={{ fontSize: '24px', cursor: 'pointer' }} />
                <div>{iconName}</div>
              </List.Item>
            );
          }}
        />
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={filteredIcons.length}
          onChange={handlePageChange}
          style={{ textAlign: 'center', marginTop: '16px' }}
        />
      </Modal>
    </div>
  );
};

export default ExpAntDesignIcon;
