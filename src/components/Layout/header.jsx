import React from 'react'
import { Avatar,Menu,Dropdown,Modal } from 'antd';
import { UserOutlined,DownOutlined } from '@ant-design/icons';
import Pwdmodal from './pwdmodal';
import * as api from '../../api'

export default function Userinfo() {
    const userInfo=localStorage.getItem('userInfo')?JSON.parse(localStorage.getItem('userInfo')):{};
    const [user,setUser]=React.useState(userInfo);
    const [isModalVisible,setIsModalVisible]=React.useState(false);
    const avatarRef=React.useRef();
    React.useEffect(()=>{
       
    })
    const themenu=(
        <Menu style={{padding:'10 20px'}}>
          <Menu.Item key="1" onClick={()=>{setIsModalVisible(true)}}>修改密码</Menu.Item>
          <Menu.Divider></Menu.Divider>
          <Menu.Item key="2" onClick={logout}>退出登录</Menu.Item>
        </Menu>
    );
    function logout(){
        localStorage.removeItem('userInfo');
        localStorage.removeItem('userToken');
        window.history.replaceState(null, null, '/login');
        window.location.reload();
    }
    async function uploadfile(val){
        console.log(val.target.files)
        const formdata=new FormData();
        formdata.append('file',val.target.files[0]);
        const result = await api.changeAvatar(formdata);
        setUser(result.data);
        localStorage.setItem('userInfo',JSON.stringify(result.data));
        avatarRef.current.value='';
    }
    return (
        <div style={{float:'right',padding:'0 40px'}}>
            <div style={{display:'inline-block',position:'relative'}}> 
                <Avatar src={user.avatar} icon={<UserOutlined />} size={40}/>
                <input type="file"  onChange={(val)=>{uploadfile(val)}} ref={avatarRef}
                       style={{width:'100%',height:'100%',opacity:'0',position:'absolute',top:'0',left:'0'}}/>
            </div>
            <Dropdown overlay={themenu} trigger={['click']}>
                <span className="ant-dropdown-link" onClick={e => e.preventDefault()} style={{cursor:'pointer',marginLeft:'5px'}}>
                    {user.username} <DownOutlined />
                </span>
            </Dropdown>
            <Modal title="修改密码" visible={isModalVisible} onCancel={()=>{setIsModalVisible(false)}}
                bodyStyle={{maxHeight:'700px',overflowY:'auto'}}
                footer={null}
                style={{top:'50px'}}
                destroyOnClose={true}
            >
                <Pwdmodal close={()=>{setIsModalVisible(false);logout();}} id={user.id}></Pwdmodal>
            </Modal>
        </div>
    )
}
