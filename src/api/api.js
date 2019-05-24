//import axios from 'axios';

//let baseUrl = '192.168.0.166:10010';
export const baseUrl='192.168.0.166:10010/api';


export const requestLogin = params => { return axios.post(`${baseUrl}/login`, params).then(res => res.data); };

export const getUserList = params => { return axios.get(`${baseUrl}/user/list`, { params: params }); };

export const getUserListPage = params => { return axios.get(`${baseUrl}/user/listpage`, { params: params }); };

export const removeUser = params => { return axios.get(`${baseUrl}/user/remove`, { params: params }); };

export const batchRemoveUser = params => { return axios.get(`${baseUrl}/user/batchremove`, { params: params }); };

export const editUser = params => { return axios.get(`${baseUrl}/user/edit`, { params: params }); };

export const addUser = params => { return axios.get(`${baseUrl}/user/add`, { params: params }); };
