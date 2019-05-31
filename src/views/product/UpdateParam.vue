<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.name" placeholder="输入机器id"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getRunningMachines">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="items" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
            <el-table-column type="selection" width="60">
            </el-table-column>
            <el-table-column type="index" label="序号"  width="100" sortable>
            </el-table-column>
            <el-table-column prop="id" label="id" width="200" sortable>
            </el-table-column>
            <el-table-column prop="cname" label="产品分类"  sortable>
            </el-table-column>
            <el-table-column prop="versionCode" label="当前版本名称"  sortable>
            </el-table-column>
            <el-table-column prop="versionNum" label="客户端序号"  sortable>
            </el-table-column>
            <el-table-column prop="runtimeMileage" label="运行里程（公里）" width="180"  sortable>
            </el-table-column>
            <el-table-column prop="country" label="国家"  sortable>
            </el-table-column>
            <el-table-column prop="province" label="省份"  sortable>
            </el-table-column>
            <el-table-column prop="address" label="地址"  sortable>
            </el-table-column>

            <el-table-column label="操作" width="150">
                <template scope="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
            <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
            </el-pagination>
        </el-col>

        <!--新增界面-->
        <el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
            <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
                <el-form-item label="产品分类" >
                    <el-select v-model="addForm.cid" placeholder="请选择">
                        <el-option
                                v-for="category in categories"
                                :key="category.id"
                                :label="category.cname"
                                :value="category.id">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="客户端版本">
                    <el-select v-model="addForm.iids" multiple placeholder="请选择">
                        <el-option
                                v-for="currentVersionNum in installers"
                                :key="currentVersionNum.id"
                                :label="currentVersionNum.versionCode"
                                :value="currentVersionNum.id">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="省份" >
                    <el-select v-model="addForm.provinces" multiple placeholder="请选择">
                        <el-option
                                v-for="currentVersionNum in installers"
                                :key="currentVersionNum.id"
                                :label="currentVersionNum.versionCode"
                                :value="currentVersionNum.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>

        <!--编辑界面-->
        <el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
                <el-form-item label="产品分类" prop="cid">
                    <el-select v-model="editForm.cid" placeholder="请选择">
                        <el-option
                                v-for="category in categories"
                                :key="category.id"
                                :label="category.cname"
                                :value="category.id">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="客户端版本" prop="cid">
                    <el-select v-model="editForm.iids" placeholder="请选择">
                        <el-option
                                v-for="installer in installers"
                                :key="installer.id"
                                :label="installer.versionCode"
                                :value="installer.id">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="客户端版本" prop="cid">
                    <el-select v-model="editForm.provinces" placeholder="请选择">
                        <el-option
                                v-for="currentVersionNum in installers"
                                :key="currentVersionNum.id"
                                :label="currentVersionNum.versionCode"
                                :value="currentVersionNum.id">
                        </el-option>
                    </el-select>
                </el-form-item>


            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import axios from 'axios';
    import { baseUrl } from '../../api/api';

    export default {
        name: "UpdateParam",
        data() {
            return {
                filters: {
                    key: ''
                },
                items: [],
                total: 0,
                page: 1,
                listLoading: false,
                sels: [],//列表选中列
                categories:[],
                installers:[],
                provinces:[],

                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                addFormRules: {
                    name: [
                        { required: true, message: '请输入姓名', trigger: 'blur' }
                    ]
                },
                //新增界面数据
                addForm: {
                    //产品分类
                    cid:"",
                    //版本号
                    iids:[],
                    //省份
                    provinces:[]
                },

                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                editFormRules: {
                    name: [
                        { required: true, message: '请输入姓名', trigger: 'blur' }
                    ]
                },
                //编辑界面数据
                editForm: {
                    //产品分类
                    cid:"",
                    //版本号
                    iids:[],
                    //省份
                    provinces:[]
                }
            }
        },
        methods: {
            //性别显示转换
            formatSex: function (row, column) {
                return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getRunningMachines();
            },
            //获取用户列表
            getRunningMachines() {
                let params = {
                    page: this.page,
                    key: this.filters.name
                };
                this.listLoading = true;
                //NProgress.start();
                //baseUrl+'/product/category/page'
                axios.get(baseUrl+'/product/runningmachine/page', {
                        params: params
                    }
                ).then((resp)=>{
                    this.total = resp.data.total;
                    this.items = resp.data.items;
                    this.listLoading = false;
                });
            },

            //查询产品分类
            getCategories(){
                axios.get(baseUrl+'/product/category/all')
                    .then((resp)=>{
                        this.categories = resp.data;
                    }).catch(()=>{
                    this.$message.error("获取产品分类失败!");
                });
            },

            getInstallers(cid){
                if (cid==undefined) {
                    return;
                }
                let params = {
                    cid: cid,
                };
                axios.get(baseUrl+'/product/installer/cid',{
                    params: params
                }).then((resp)=>{
                    this.installers = resp.data;
                })
                    /*.catch(()=>{
                    this.$message.error("获取版本编号失败!");
                });*/
            },

            getProvinces(){

            },

            //显示新增界面
            handleAdd: function (){
                this.getCategories();
                this.addFormVisible = true;
                this.addForm = {
                    name: '',
                    sex: -1,
                    age: 0,
                    birth: '',
                    addr: ''
                };
            },
            //新增
            addSubmit: function () {
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addLoading = true;
                            axios({
                                method:'post',
                                url:baseUrl+ '/product/updateparam',
                                data: this.$qs.stringify(this.addForm)
                            }).then(() => {
                                this.addLoading = false;
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['addForm'].resetFields();
                                this.addFormVisible = false;
                                this.getRunningMachines();
                            }).catch((resp) => {
                                this.addLoading = false;
                                let message = resp.response.data.message;
                                this.$message.error("保存失败！"+message);
                            });
                        });
                    }
                });
            },

            //删除
            handleDel: function (index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    let para = { id: row.id };
                    axios.delete(baseUrl+'/product/runningmachine', {
                        params: para
                    }).then(()=>{
                        this.listLoading = false;
                        this.$message({
                            message: '文件删除成功',
                            type: 'success'
                        });
                        this.getRunningMachines();
                    }).catch(() => {
                        this.listLoading = false;
                        this.$message.error('文件删除失败！');
                    });
                })
            },

            //显示编辑界面
            handleEdit: function (index, row) {
                this.getCategories();
                this.editFormVisible = true;
                this.editForm = Object.assign({}, row);
            },

            //编辑
            editSubmit: function () {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editLoading = true;
                            axios({
                                method:'put',
                                url:baseUrl+ '/product/runningmachine',
                                data: this.$qs.stringify(this.editForm)
                            }).then(() => {
                                this.editLoading = false;
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['editForm'].resetFields();
                                this.editFormVisible = false;
                                this.getRunningMachines();
                            }).catch((resp) => {
                                this.editLoading = false;
                                let message = resp.response.data.message;
                                this.$message.error("保存失败！"+message);
                            });
                        });
                    }
                });
            },

            selsChange: function (sels) {
                this.sels = sels;
            },
            //批量删除
            batchRemove: function () {
                var ids = this.sels.map(item => item.id).toString();
                this.$confirm('确认删除选中记录吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    let para = { ids: ids };
                    batchRemoveUser(para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getRunningMachines();
                    });
                }).catch(() => {

                });
            }
        },
        mounted() {
            this.getRunningMachines();
        },
        watch: {
            "addForm.cid"(){
                this.getInstallers(this.addForm.cid);
            },
            "editForm.cid"(){
                this.getInstallers(this.editForm.cid);
            }
        }
    }
</script>

<style scoped>

</style>