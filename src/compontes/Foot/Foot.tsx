import { Layout } from 'antd';
const { Footer } = Layout;

const Foot = () => {

    return (
      <Footer id='footer'>
        <p>YuZiApi ©{new Date().getFullYear()} by ❤ by Naraci</p>
      </Footer>
    )

}
export default Foot
