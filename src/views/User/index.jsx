import React,{useEffect,useState} from 'react'
import * as api from '../../api'
import {Table,Tag,Pagination,Space,Input,Select,Button,Form,Modal,Spin,message} from 'antd'
import {
    PlusOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons';
import Usermodal from './modal'
const {confirm}=Modal;

export default function User() {
    const [users,setUsers] =useState([]); //用户列表
    const [pageSize,setPageSize]=useState(5);
    const [pageNum,setPageNum]=useState(1);
    const [total,setTotal]=useState(0);
    const [loading,setLoading]=useState(false);
    const [status,setStatus]=useState('');
    const [username,setUsername]=useState('');
    const [name,setName]=useState('');
    const [phone,setPhone]=useState('');
    const [isModalVisible,setIsModalVisible]=useState(false);
    const [roles,setRoles]=useState([]);
    const [current,setCurrent]=useState({});//现在在新增或编辑的用户
    const [modaltitle,setModalTitle]=useState('新建用户');
    const columns=[
        {
            title: '用户名',
            dataIndex: 'username',
            key: 'username',
            render: text => <>{text}</>,
        },
        {
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '电话',
            dataIndex: 'phone',
            key: 'phone',
            render: text => <>{!text||text==='undefined'?'未填写':text}</>,
        },
        {
            title: '帐号状态',
            dataIndex: 'status',
            key: 'status',
            render:el=>
                {
                        let color='volcano',text='冻结';
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
            title: '角色',
            dataIndex: 'roles',
            key: 'roles',
            render:el=>
            {
                let arr=el?JSON.parse(el):[]
                let result=[];
                arr.forEach(item=>{
                    const target=roles.find(i=>i.value===item)
                    if(target?.label){
                        result.push(target.label)
                    }
                })
                return result.map((i,k)=>{
                    return (
                        <Tag color="cyan" key={i+k}>
                          {i}
                        </Tag>
                      );
                })
            }
        },
        {
            title: '操作',
            key: 'action',
            render: (text, record) => (
              <Space size="small">
                <Button onClick={()=>{updateUser(record)}} type="primary" >编辑</Button>
                <Button onClick={()=>{deleteUser(record.id)}} type="danger" >删除</Button>
              </Space>
            ),
          },
    ]

    const [form]=Form.useForm();

    useEffect(()=>{
        console.log('render')
        getList();
    },[pageSize,pageNum,username,phone,name,status]) // eslint-disable-line react-hooks/exhaustive-deps
    useEffect(()=>{
        getRoleList();
    },[]) // eslint-disable-line react-hooks/exhaustive-deps

    function changePage(val){
        setPageNum(val);
    }
    function deleteUser(id){
        confirm({
            title: '删除用户',
            icon: <ExclamationCircleOutlined />,
            content: '确认要删除该用户吗？',
            async onOk() {
                const result=await api.deleteUser(id);
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
            username,
            name,
            phone,
            status,
            pageSize,
            pageNum
        }
        const result=await api.getUserList(data);
        setUsers(result.data.list);//ajax settimeout 原生事件中setState同步，此处是因为users被赋值为新对象而不是修改以后的users对象
        setTotal(result.data.total);
        setLoading(false);
    }
    async function submitForm(val){
        setUsername(val.username);
        setName(val.name);
        setPhone(val.phone);
        setStatus(val.status);
        setPageNum(1);
    }
    function addNew(){
        setCurrent({});
        setModalTitle('新建用户');
        setIsModalVisible(true);
    }
    function updateUser(val){
        setCurrent(val);
        setModalTitle('编辑用户');
        setIsModalVisible(true);
    }
    async function getRoleList(){
        setLoading(true);
        const result=await api.exportList();
        let roleList=result.data?result.data:[];
        setRoles(roleList.map(item=>{
            return {label:item.name,value:item.id,status:item.status}
        }));
        setLoading(false);
    }

    return (
        <Spin spinning={loading} size="large" tip="加载中......">
            <div className="clearfix">
                <Space size={[8,16]} wrap style={{marginBottom:'20px'}}>
                    <Button icon={<PlusOutlined />} type="primary" onClick={()=>{addNew()}}>新增用户</Button>
                </Space>
                <Modal title={modaltitle} visible={isModalVisible} onCancel={()=>{setIsModalVisible(false)}}
                    bodyStyle={{maxHeight:'700px',overflowY:'auto'}}
                    footer={null}
                    style={{top:'50px'}}
                    destroyOnClose={true}
                >
                    <Usermodal close={()=>{setIsModalVisible(false)}} getList={()=>{getList()}} current={current} roleList={roles}></Usermodal>
                </Modal>
                <Form
                    layout="inline"
                    form={form}
                    onFinish={submitForm}
                    >
                    <Form.Item name='username'>
                        <Input placeholder="用户名"/>
                    </Form.Item>
                    <Form.Item name='name'>
                        <Input placeholder="姓名"/>
                    </Form.Item>
                    <Form.Item name='phone'>
                        <Input placeholder="电话"/>
                    </Form.Item>
                    <Form.Item name='status'>
                        <Select placeholder="帐号状态" style={{width:'100px'}} 
                                options={[{label:'正常',value:1},{label:'冻结',value:0}]}
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
                <Table columns={columns} dataSource={users} rowKey="id" pagination={false}/>
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
