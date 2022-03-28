import React from 'react'
import {Form,Input,Button,message,Switch,Select} from 'antd'
import * as api from '../../api'
import './index.module.scss'

export default function Usermodal(props) {
    const [modalform]=Form.useForm();
    const {current}=props;
    const isUpdate=current?.id;

    React.useEffect(()=>{
        initForm();
    },[]) // eslint-disable-line react-hooks/exhaustive-deps
    
    async function submit(val){
        const initdata={
            username:val.username,
            name:val.name,
            phone:val.phone,
            roles:JSON.stringify(val.roles)
        }
        let data,result;
        if(isUpdate){
            data={...initdata,status:val.status?1:0,id:current.id}
            result=await api.updateUser(data);
        }else{
            data={...initdata,password:val.password}
            result=await api.addUser(data);
        }
        if(result.status===200){
            message.success({content:result.message,duration:2});
            props.close();
            props.getList();
        }else{
            message.error({content:result.message,duration:2});
        }
    }
    function initForm(){
        if(current?.id){
            modalform.setFieldsValue({
                name:current.name,
                username:current.username,
                phone:current.phone,
                status:current.status,
            })
            if(current.roles){
                let temp=JSON.parse(current.roles);
                temp=temp.filter(item=>{
                    return props.roleList.find(i=>i.value===item)
                })
                modalform.setFieldsValue({
                    roles:temp
                })
            }
        }
    }

    return (
        <Form layout="vertical" form={modalform} name="modalform" onFinish={submit} onFinishFailed={(val)=>{console.log(val)}}>
            <Form.Item  name='username' label="用户名"
                rules={[
                    {
                        required: true,
                        message: '请输入用户名!',
                    },
                    {
                        type:'string',
                        max:16,
                        message:'用户名为不超过16位的字符串'
                    }
                ]}
                hasFeedback
            >
                <Input />
            </Form.Item>
            <Form.Item name='password' label="密码"
                hidden={isUpdate}
                rules={isUpdate?[]:[
                    {
                        required: true,
                        message: '请输入密码!',
                    },
                    {
                        type:'string',
                        max:16,
                        message:'密码为不超过16位的字符串'
                    }
                ]}
                hasFeedback
            >
                <Input.Password />
            </Form.Item>
            <Form.Item name='repassword' label="确认密码" dependencies={['password']}
                hasFeedback
                hidden={isUpdate}
                rules={isUpdate?[]:[
                  {
                    required: true,
                    message: '请再次输入密码!',
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('两次密码输入不一致!'));
                    },
                  }),
                ]}
            >
                <Input.Password />
            </Form.Item>
            <Form.Item name='name' label="姓名"
                rules={[
                    {
                        required: true,
                        message: '请输入姓名!',
                    },
                ]}
                hasFeedback
            >
                <Input />
            </Form.Item>
            <Form.Item name='phone' label="电话"
                rules={[
                    {
                        required: true,
                        message: '请输入电话!',
                    },
                    {
                        pattern:/^1[345789]\d{9}$/,
                        message: '请输入正确的手机号!',
                    },
                ]}
                hasFeedback
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="roles"
                label="角色"
            >
                <Select mode="multiple" placeholder="-请选择-" options={props.roleList}>
                </Select>
            </Form.Item>
            <Form.Item name='status' label="帐号状态" valuePropName="checked" hidden={!isUpdate}>
                <Switch/>
            </Form.Item>
            <Form.Item style={{textAlign:'center'}}>
                <Button style={{marginRight:'30px'}} onClick={()=>{modalform.resetFields()}}>重置</Button>
                <Button type="primary" htmlType="submit">确认</Button>
            </Form.Item>
        </Form>
    )
}
