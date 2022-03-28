import React,{useState} from 'react'
import {Form,Input,Button,message,Switch,TreeSelect} from 'antd'
import * as api from '../../api'
import './index.module.scss'

export default function Rolemodal(props) {
    const [modalform]=Form.useForm();
    const {current}=props;
    const isUpdate=current?.id;
    const [menus,setMenus] =useState([]); //菜单列表

    React.useEffect(()=>{
        getMenuList();
        initForm();
    },[]) // eslint-disable-line react-hooks/exhaustive-deps
    
    async function submit(val){
        const initdata={
            name:val.name,
            pageperms:val.pageperms.join(',')
        }
        let data,result;
        if(isUpdate){
            data={...initdata,status:val.status?1:0,id:current.id}
            result=await api.updateRole(data);
        }else{
            data={...initdata}
            result=await api.addRole(data);
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
                status:current.status,
                pageperms:current.pageperms?current.pageperms.split(',').map(e=>Number(e)):[]
            })
        }
    }
    async function getMenuList(){
        const result=await api.getMenuList();
        setMenus(result.data);
    }

    return (
        <Form layout="vertical" form={modalform} name="modalform" onFinish={submit} onFinishFailed={(val)=>{console.log(val)}}>
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
            <Form.Item name='pageperms' label="页面权限">
                <TreeSelect treeData={menus} treeCheckable={true} placeholder='-请选择-' style={{width:'100%'}}
                fieldNames={{ label: 'name', value: 'id', children: 'children' }}/>
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
