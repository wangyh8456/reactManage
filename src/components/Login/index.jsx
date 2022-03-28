import React from 'react'
import { Form, Input, Button, message } from 'antd';
import index from'./index.module.scss'
import {useNavigate} from 'react-router-dom'
import * as api from '../../api'

export default function Login() {
  const navigate=useNavigate();
  const onFinish =async (values) => {
    console.log('Success:', values);
    const data={username:values.username,password:values.password};
    const result =await api.Login(data);
    if(result.status===200){
      localStorage.setItem('userToken',result.data.token);
      localStorage.setItem('userInfo',JSON.stringify(result.data));
      message.success({content:result.message,duration:2});
      navigate('/user');
    }else{
      message.error({content:result.message,duration:2});
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className={index.form}>
    <h2 style={{color:'white',fontSize:'30px',marginBottom:'20px'}}>网上商城管理平台</h2>
    <Form
      name="basic"
      wrapperCol={{
        span: 24,
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      style={{width:'20%'}}
    >
      <Form.Item
        name="username"
      >
        <Input placeholder="用户名"/>
      </Form.Item>

      <Form.Item
        name="password"
      >
        <Input.Password placeholder="密码"/>
      </Form.Item>
      <Form.Item
        wrapperCol={{
          span: 24,
        }}
      >
        <Button type="primary" htmlType="submit" style={{width:'100%'}}>
          登录
        </Button>
      </Form.Item>
    </Form>
    </div>
  );

}
