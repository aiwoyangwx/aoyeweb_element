import Login from './views/Login.vue'
import Category from './views/product/Category'
import Installer from './views/product/Installer'
import RunningMachine from './views/product/RunningMachine'
import UpdateParam from './views/product/UpdateParam'



import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
import Table from './views/nav1/Table.vue'
import Form from './views/nav1/Form.vue'
import user from './views/nav1/user.vue'
import Page4 from './views/nav2/Page4.vue'
import Page5 from './views/nav2/Page5.vue'
import Page6 from './views/nav3/Page6.vue'
import echarts from './views/charts/echarts.vue'

let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },

    {
        path: '/',
        component: Home,
        name: '产品管理',
        iconCls: 'el-icon-message',//图标样式class
        children: [
            { path: '/category', component: Category, name: '分类' },
            { path: '/installer', component: Installer, name: '客户端版本' },
            { path: '/runningMachine', component: RunningMachine, name: '跑步机' },
            { path: '/updateParam', component: UpdateParam, name: '升级参数' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '客户管理',
        iconCls: 'el-icon-message',//图标样式class
        children: [

        ]
    },
    {
        path: '/',
        component: Home,
        name: '私教管理',
        iconCls: 'el-icon-message',//图标样式class
        children: [
        ]
    },
    {
        path: '/',
        component: Home,
        name: '积分管理',
        iconCls: 'el-icon-message',//图标样式class
        children: [
        ]
    },
    {
        path: '/',
        component: Home,
        name: '推广及知识',
        iconCls: 'el-icon-message',//图标样式class
        children: [
        ]
    },
    {
        path: '/',
        component: Home,
        name: '员工管理',
        iconCls: 'el-icon-message',//图标样式class
        children: [

        ]
    },

    {
        path: '/',
        component: Home,
        name: '权限管理',
        iconCls: 'el-icon-message',//图标样式class
        children: [
        ]
    },
    {
        path: '/',
        component: Home,
        name: 'demo1',
        iconCls: 'el-icon-message',//图标样式class
        children: [
            { path: '/main', component: Main, name: '主页', hidden: true },
            { path: '/table', component: Table, name: 'Table' },
            { path: '/form', component: Form, name: 'Form' },
            { path: '/user', component: user, name: '列表' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: 'demo2',
        iconCls: 'fa fa-id-card-o',
        children: [
            { path: '/page4', component: Page4, name: '页面4' },
            { path: '/page5', component: Page5, name: '页面5' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'fa fa-address-card',
        leaf: true,//只有一个节点
        children: [
            { path: '/page6', component: Page6, name: 'demo3' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: 'demoCharts',
        iconCls: 'fa fa-bar-chart',
        children: [
            { path: '/echarts', component: echarts, name: 'echarts' }
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;