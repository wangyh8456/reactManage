import React,{useEffect,useState,useRef} from 'react'
import * as api from '../../api'
import {Table,Space,Button,Modal,Spin,message,Empty} from 'antd'
import {
    PlusOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons';
import Menumodal from './modal'
const {confirm}=Modal;

export default function Menu() {
    const [menus,setMenus] =useState([]); //菜单列表
    const [loading,setLoading]=useState(false);
    const [isModalVisible,setIsModalVisible]=useState(false);
    const [current,setCurrent]=useState({});//现在在新增或编辑的菜单
    const [allmenu,setAllMenu]=useState([]);
    const [modaltitle,setModalTitle]=useState('新建菜单');
    const fileRef=useRef();

    const columns=[
        {
            title: '菜单ID',
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
            title: '排序',
            dataIndex: 'sort',
            key: 'sort',
        },
        {
            title: '操作',
            key: 'action',
            render: (text, record) => (
              <Space size="small">
                <Button onClick={()=>{updateMenu(record)}} type="primary" >编辑</Button>
                <Button onClick={()=>{deleteMenu(record.id)}} type="danger" >删除</Button>
              </Space>
            ),
          },
    ]


    useEffect(()=>{
        getList();
        getAllList();
    },[]) // eslint-disable-line react-hooks/exhaustive-deps

    function deleteMenu(id){
        confirm({
            title: '删除菜单',
            icon: <ExclamationCircleOutlined />,
            content: '确认要删除该菜单吗？',
            async onOk() {
                const result=await api.deleteMenu(id);
                if(result.status===200){
                    message.success({content:result.message,duration:2});
                    getList();
                    getAllList();
                }else{
                    message.error({content:result.message,duration:2});
                }
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }
    async function getAllList(){
        setLoading(true);
        const result=await api.menuList();
        let list=result.data?result.data:[];
        setAllMenu(list.map(item=>{
            return {label:item.name,value:item.id,level:item.level||0}
        }));
        setLoading(false);
    }
    async function getList(){
        setLoading(true);
        const result=await api.getMenuList();
        setMenus(result.data);
        setLoading(false);
    }
    function addNew(){
        setCurrent({});
        setModalTitle('新建菜单');
        setIsModalVisible(true);
    }
    function updateMenu(val){
        setCurrent(val);
        setModalTitle('编辑菜单');
        setIsModalVisible(true);
    }
    async function downloadCSV(){
        setLoading(true);
        const result=await api.downloadMenuCSV();
        console.log(result);
        const blob = new Blob([result],{type: 'application/vnd.ms-excel'});
        const downloadElement = document.createElement('a');
        const href = window.URL.createObjectURL(blob); // 创建下载的链接
        downloadElement.href = href;
        downloadElement.download = '模板.csv'; // 下载后文件名
        document.body.appendChild(downloadElement);
        downloadElement.click(); // 点击下载
        document.body.removeChild(downloadElement); // 下载完成移除元素
        window.URL.revokeObjectURL(href); // 释放掉blob对象
        message.success({content:'下载成功!',duration:2});
        setLoading(false);
    }
    async function uploadfile(val){
        try{
            setLoading(true);
            const formdata=new FormData();
            formdata.append('file',val.target.files[0]);
            await api.importMenuCSV(formdata);
            fileRef.current.value='';
            message.success({content:'导入成功!',duration:2});
            getList();
            getAllList();
        }catch(e){
            message.error({content:'导入失败!',duration:2});
        }finally{
            setLoading(false);
        }
    }

    return (
        <Spin spinning={loading} size="large" tip="加载中......">
            <div className="clearfix">
                <Space size={[8,16]} wrap style={{marginBottom:'20px'}}>
                    <Button icon={<PlusOutlined />} type="primary" onClick={()=>{addNew()}}>新增菜单</Button>
                    <Button onClick={()=>{downloadCSV()}}>模板下载</Button>
                    <div style={{display:'inline-block',position:'relative'}}> 
                        <Button onClick={()=>{downloadCSV()}}>批量导入</Button>
                        <input type="file"  onChange={(val)=>{uploadfile(val)}} ref={fileRef}
                            style={{width:'100%',height:'100%',opacity:'0',position:'absolute',top:'0',left:'0'}}/>
                    </div>
                </Space>
                <Modal title={modaltitle} visible={isModalVisible} onCancel={()=>{setIsModalVisible(false)}}
                    bodyStyle={{maxHeight:'700px',overflowY:'auto'}}
                    footer={null}
                    style={{top:'50px'}}
                    destroyOnClose={true}
                >
                    <Menumodal close={()=>{setIsModalVisible(false)}} getList={()=>{getList()}} current={current} allmenu={allmenu.filter(e=>e.value!==current.id)} getAllList={()=>{getAllList()}}></Menumodal>
                </Modal>
                {menus?.length>0?<Table columns={columns} dataSource={menus} rowKey="id" pagination={false} defaultExpandAllRows={true}/>:
                <Empty/>}
            </div>
        </Spin>
    )
}
