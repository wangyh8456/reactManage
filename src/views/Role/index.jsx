import React,{useEffect,useState} from 'react'
import * as api from '../../api'
import {Table,Tag,Pagination,Space,Input,Select,Button,Form,Modal,Spin,message} from 'antd'
import {
    PlusOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons';
import Rolemodal from './modal'
const {confirm}=Modal;

export default function Role() {
    const [roles,setRoles] =useState([]); //角色列表
    const [pageSize,setPageSize]=useState(5);
    const [pageNum,setPageNum]=useState(1);
    const [total,setTotal]=useState(0);
    const [loading,setLoading]=useState(false);
    const [status,setStatus]=useState('');
    const [name,setName]=useState('');
    const [isModalVisible,setIsModalVisible]=useState(false);
    const [current,setCurrent]=useState({});//现在在新增或编辑的角色
    const [modaltitle,setModalTitle]=useState('新建角色');

    const columns=[
        {
            title: '角色ID',
            dataIndex: 'id',
            key: 'id',
            render: text => <>{text}</>,
        },
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render:el=>
                {
                        let color='volcano',text='停用';
                        if(el===1){
                            color='green';
                            text='正常'
                        }
                        return (
                            <Tag color={color} key={el}>
                              {text}
                            </Tag>
                          );
                }
             
        },
        {
            title: '操作',
            key: 'action',
            render: (text, record) => (
              <Space size="small">
                <Button onClick={()=>{updateRole(record)}} type="primary" >编辑</Button>
                <Button onClick={()=>{deleteRole(record.id)}} type="danger" >删除</Button>
              </Space>
            ),
          },
    ]

    const [form]=Form.useForm();

    useEffect(()=>{
        getList();
    },[pageSize,pageNum,name,status]) // eslint-disable-line react-hooks/exhaustive-deps

    function changePage(val){
        setPageNum(val);
    }
    function deleteRole(id){
        confirm({
            title: '删除角色',
            icon: <ExclamationCircleOutlined />,
            content: '确认要删除该角色吗？',
            async onOk() {
                const result=await api.deleteRole(id);
                if(result.status===200){
                    message.success({content:result.message,duration:2});
                    getList();
                }else{
                    message.error({content:result.message,duration:2});
                }
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }
    function onShowSizeChange(current,size){
        setPageNum(current);
        setPageSize(size);
    }
    async function getList(){
        setLoading(true);
        const data={
            name,
            status,
            pageSize,
            pageNum
        }
        const result=await api.getRoleList(data);
        setRoles(result.data.list);
        setTotal(result.data.total);
        setLoading(false);
    }
    async function submitForm(val){
        setName(val.name);
        setStatus(val.status);
        setPageNum(1);
    }
    function addNew(){
        setCurrent({});
        setModalTitle('新建角色');
        setIsModalVisible(true);
    }
    function updateRole(val){
        setCurrent(val);
        setModalTitle('编辑角色');
        setIsModalVisible(true);
    }

    return (
        <Spin spinning={loading} size="large" tip="加载中......">
            <div className="clearfix">
                <Space size={[8,16]} wrap style={{marginBottom:'20px'}}>
                    <Button icon={<PlusOutlined />} type="primary" onClick={()=>{addNew()}}>新增角色</Button>
                </Space>
                <Modal title={modaltitle} visible={isModalVisible} onCancel={()=>{setIsModalVisible(false)}}
                    bodyStyle={{maxHeight:'700px',overflowY:'auto'}}
                    footer={null}
                    style={{top:'50px'}}
                    destroyOnClose={true}
                >
                    <Rolemodal close={()=>{setIsModalVisible(false)}} getList={()=>{getList()}} current={current}></Rolemodal>
                </Modal>
                <Form
                    layout="inline"
                    form={form}
                    onFinish={submitForm}
                    >
                    <Form.Item name='name'>
                        <Input placeholder="姓名"/>
                    </Form.Item>
                    <Form.Item name='status'>
                        <Select placeholder="帐号状态" style={{width:'100px'}} 
                                options={[{label:'正常',value:1},{label:'停用',value:0}]}
                                allowClear>
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button onClick={()=>{form.resetFields()}}>重置</Button>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">搜索</Button>
                    </Form.Item>
                </Form>
                <Table columns={columns} dataSource={roles} rowKey="id" pagination={false}/>
                <Pagination
                    total={total}
                    showTotal={ total => `共${total}条`}
                    pageSize={pageSize}
                    current={pageNum}
                    pageSizeOptions={[5,10,20]}
                    showSizeChanger={true}
                    showQuickJumper={false}
                    onChange={changePage}
                    onShowSizeChange={onShowSizeChange}
                    style={{float:'right',marginTop:'20px'}}
                />
            </div>
        </Spin>
    )
}
