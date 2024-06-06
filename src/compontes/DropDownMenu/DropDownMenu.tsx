
import { DownOutlined, SmileOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Dropdown, Space, message } from 'antd';
import {SettingFilled} from '@ant-design/icons'
import { useNavigate } from "react-router-dom";
import { removeToken } from "@/utils/request/function";



export default function DropDownMenu() {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

  
    const successWindeos = (msg: string) => {
      messageApi.open({
        type: 'success',
        content: msg,
      });
    };

    const unLogin = () => {
        // 删除token
        removeToken()
        successWindeos("退出登录成功")
    }

    const goToLogin = () => {
        navigate('/login')
    }

    const goOut = () => {
        unLogin();
        setTimeout(goToLogin, 2000);
    }

    const items: MenuProps['items'] = [
        {
          key: '1',
          label: (
            <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
              1st menu item
            </a>
          ),
        },
        {
          key: '2',
          label: (
            <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
              2nd menu item (disabled)
            </a>
          ),
          icon: <SmileOutlined />,
          disabled: true,
        },
        {
          key: '3',
          label: (
            <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
              3rd menu item (disabled)
            </a>
          ),
          disabled: true,
        },
        {
          key: '4',
          danger: true,
          label: (
              <p onClick={goOut}>退出登录</p>
          ),
        },
      ];

  return (
    <>
    {contextHolder}
    <Dropdown menu={{ items }}>
    <a onClick={(e) => e.preventDefault()}>
      <Space>
        <SettingFilled style={{fontSize: '20px'}}/>
        <DownOutlined />
      </Space>
    </a>
  </Dropdown> 
    </>
 )
}
