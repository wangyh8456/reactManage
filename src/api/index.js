import fetch from "../utils/fetch";

/********************登录相关***************************/
//登录
export function Login(data) {
  return fetch({
      url: "/api/user/login",
      method: "post",
      data: data,
  });
}

/********************用户管理***************************/
//获取列表
export function getUserList(data) {
  return fetch({
      url: "/api/user/find",
      method: "post",
      data: data,
  });
}
//创建用户
export function addUser(data) {
  return fetch({
      url: "/api/user/create",
      method: "post",
      data: data,
  });
}
//修改用户
export function updateUser(data) {
  return fetch({
      url: "/api/user/update",
      method: "post",
      data: data,
  });
}
//删除用户
export function deleteUser(id) {
  return fetch({
      url: `/api/user/delete/${id}`,
      method: "post"
  });
}
//修改密码
export function changePwd(data) {
  return fetch({
      url: `/api/user/changepwd`,
      method: "post",
      data:data
  });
}
//修改头像
export function changeAvatar(data) {
  return fetch({
      url: `/api/user/changeavatar`,
      method: "post",
      data:data
  });
}
//获取路由
export function getRouter() {
  return fetch({
      url: `/api/user/getrouter`,
      method: "get",
  });
}
/********************角色管理***************************/
//获取列表
export function getRoleList(data) {
  return fetch({
      url: "/api/role/find",
      method: "post",
      data: data,
  });
}
//获取所有角色列表
export function exportList() {
  return fetch({
      url: "/api/role/exportlist",
      method: "get",
  });
}
//创建角色
export function addRole(data) {
  return fetch({
      url: "/api/role/create",
      method: "post",
      data: data,
  });
}
//修改角色
export function updateRole(data) {
  return fetch({
      url: "/api/role/update",
      method: "post",
      data: data,
  });
}
//删除角色
export function deleteRole(id) {
  return fetch({
      url: `/api/role/delete/${id}`,
      method: "post"
  });
}
/********************菜单管理***************************/
//获取列表
export function getMenuList(data) {
  return fetch({
      url: "/api/menu/find",
      method: "post",
      data: data,
  });
}
//获取所有菜单列表
export function menuList() {
  return fetch({
      url: "/api/menu/findlist",
      method: "get",
  });
}
//创建菜单
export function addMenu(data) {
  return fetch({
      url: "/api/menu/create",
      method: "post",
      data: data,
  });
}
//修改菜单
export function updateMenu(data) {
  return fetch({
      url: "/api/menu/update",
      method: "post",
      data: data,
  });
}
//删除菜单
export function deleteMenu(id) {
  return fetch({
      url: `/api/menu/delete/${id}`,
      method: "post"
  });
}
//模板下载
export function downloadMenuCSV() {
  return fetch({
      url: `/api/menu/exportcsv`,
      method: "get"
  });
}
//批量导入
export function importMenuCSV(data) {
  return fetch({
      url: `/api/menu/importcsv`,
      method: "post",
      data:data
  });
}