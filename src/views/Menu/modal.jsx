import React from 'react'
import {Form,Input,Button,message,Select} from 'antd'
import * as api from '../../api'
import './index.module.scss'

export default function Menumodal(props) {
    const [modalform]=Form.useForm();
    const {current}=props;
    const isUpdate=current?.id;

    React.useEffect(()=>{
        initForm();
    },[]) // eslint-disable-line react-hooks/exhaustive-deps
    
    async function submit(val){
        const initdata={
            name:val.name,
            sort:val.sort||0
        }
        if(val.pid){
            const pos=props.allmenu.findIndex(e=>e.value===val.pid);
            initdata.level=Number(props.allmenu[pos].level)+1;
            initdata.pid=val.pid;
        }else{
            initdata.level=1;
            initdata.pid=null;
        }
        let data,result;
        if(isUpdate){
            data={...initdata,id:current.id}
            result=await api.updateMenu(data);
        }else{
            data={...initdata}
            result=await api.addMenu(data);
        }
        if(result.status===200){
            message.success({content:result.message,duration:2});
            props.close();
            props.getList();
            props.getAllList();
        }else{
            message.error({content:result.message,duration:2});
        }
    }
    function initForm(){
        if(current?.id){
            modalform.setFieldsValue({
                name:current.name,
                sort:current.sort
            })
            if(current?.pid&&Number(current?.pid)>=0){
                modalform.setFieldsValue({
                    pid:Number(current.pid),
                })
            }
        }
    }

    return (
        <Form layout="vertical" form={modalform} name="modalform" onFinish={submit} onFinishFailed={(val)=>{console.log(val)}}>
            <Form.Item name='name' label="名称"
                rules={[
                    {
                        required: true,
                        message: '请输入路由名称!',
                    },
                ]}
                hasFeedback
            >
                <Input />
            </Form.Item>
            <Form.Item name='sort' label="排序">
                <Input />
            </Form.Item>
            <Form.Item
                name="pid"
                label="上级节点"
            >
                <Select placeholder="-请选择-" options={props.allmenu} allowClear>
                </Select>
            </Form.Item>
            <Form.Item style={{textAlign:'center'}}>
                <Button style={{marginRight:'30px'}} onClick={()=>{modalform.resetFields()}}>重置</Button>
                <Button type="primary" htmlType="submit">确认</Button>
            </Form.Item>
        </Form>
    )
}
