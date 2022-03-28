import React,{useState,Suspense,useEffect} from 'react'
import './index.module.scss'

import { Layout, Menu, Breadcrumb,Spin } from 'antd';
import { Outlet,Link } from 'react-router-dom';
import router from '../../router'
import Userinfo from './header'
import * as api from '../../api'
// import {getToken} from '../../utils/auth'

const { Header, Content, Sider } = Layout;
const { SubMenu } = Menu;
let checkSub=[],checkMenu=[],tempMenu=[],checktitle=[],temptitle=[];

function searchMenu(menu = {children:[]},isFirst=false){
  if(isFirst) {
    tempMenu=[];
    temptitle=[];
  }
  let thebool=false;
  for(let i=0;i<menu.children.length;i++){
    let item=menu.children[i]
    if(item.children) {
      let bool=searchMenu(item);
      thebool=bool;
      if(thebool){
        tempMenu=[...tempMenu,item.id];
        temptitle=[...temptitle,item.title];
        checkMenu=tempMenu;
        checktitle=temptitle;
        return thebool
      }
    }else{
      if(item.path===window.location.pathname){
        checkSub=[item.id]
        tempMenu=[...tempMenu,item.id]
        temptitle=[...temptitle,item.title];
        checkMenu=tempMenu;
        checktitle=temptitle;
        return true;
      }
    }
  }
  return thebool;
}


export default function AppLayout(){
  searchMenu(router[0],true)
  const [collapsed,setCollapsed]=useState(false);
  const [title,setTitle]=useState(checktitle.reverse());
  const [selected,setSelected]=useState(checkMenu);
  const [routes,setRoutes]=useState([]);

  useEffect(async ()=>{
    getRoutes();
  },[]) // eslint-disable-line react-hooks/exhaustive-deps
 
  function onCollapse(collapsed){
    setCollapsed(collapsed=>!collapsed);
  };
  async function getRoutes(){
    const result=await api.getRouter();
    setRoutes(JSON.parse(result.data));
  }
  function change(){
    searchMenu(router[0],true);
    setTitle(title=>checktitle.reverse());
    setSelected(checkMenu)
  }
  function createMenu(menu = []){
    return menu.map(item => {
      let visible=true;
      if(routes.findIndex(el=>Number(el)===Number(item.id))===-1){
        visible=false;
      }
      if(item.children) {
        return <SubMenu key={item.id} title={item.title} icon={item.icon} style={{display:visible?'':'none'}}>
                  { createMenu(item.children) }
               </SubMenu>
      }else {
        console.log(item.icon)
        return <Menu.Item key={item.id} icon={item.icon} onClick={change} style={{display:visible?'':'none'}}>
                   <Link to={item.path}>{ item.title }</Link>
                </Menu.Item>
      }
    })
  }
  function onOpenChange(keys){
    setSelected(keys)
  }

  return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
          <div className="logo" />
          <Menu theme="dark" defaultSelectedKeys={checkSub} onOpenChange={onOpenChange} openKeys={selected} mode="inline">
            {createMenu(router[0].children)}
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Header className="site-layout-background" style={{ padding: 0 }}>
            <Userinfo/>
          </Header>
          <Content style={{ margin: '0 16px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              {title.map((e,i)=>{
                return <Breadcrumb.Item key={i}>{e}</Breadcrumb.Item>
              })}  
            </Breadcrumb>
            <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
              <Suspense fallback={<div style={{textAlign:'center',width:'100%',marginTop:'100px'}}><Spin size="large" /></div>}>
                <Outlet/>
              </Suspense>
            </div>
          </Content>
          {/* <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer> */}
        </Layout>
      </Layout>
  )
}
