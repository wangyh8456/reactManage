import './App.css';
import router from './router'
import {useRoutes} from 'react-router-dom'
import zhCN from 'antd/es/locale/zh_CN'; 
import { ConfigProvider } from 'antd';

function App() {
  // return useRoutes(router)
  return (
    <div style={{width:'100%',height:'100%',overflowY:'scroll'}}>
        <ConfigProvider locale={zhCN}>  
            {useRoutes(router)}
        </ConfigProvider>
    </div>
);
}

export default App;
