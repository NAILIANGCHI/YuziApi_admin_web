import { useState } from 'react';
import * as Icons from '@ant-design/icons';
import ExpAntDesignIcon from '@/compontes/ExpAntDesingIcon/ExpAntDesignIcon';


export default function Page1() {
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);

  // 处理图标选择
  const handleIconSelect = (iconName: string) => {
    setSelectedIcon(iconName);
    console.log('Selected Icon:', iconName);
  };

  const SelectedIconComponent = selectedIcon ? (Icons as any)[selectedIcon] : null;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Select an Ant Design Icon</h1>
      <ExpAntDesignIcon onIconSelect={handleIconSelect} />
      {SelectedIconComponent && (
        <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center' }}>
          <span style={{ marginRight: '10px' }}>Selected Icon:</span>
          <SelectedIconComponent style={{ fontSize: '24px' }} />
        </div>
      )}
    </div>
  );
}
