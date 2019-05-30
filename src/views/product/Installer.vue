<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.name" placeholder="姓名"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getInstallers">查询</el-button>
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
            <el-table-column type="index" label="序号" sortable>
            </el-table-column>
            <el-table-column prop="id" label="id"  width="200" sortable>
            </el-table-column>
            <el-table-column prop="cname" label="产品分类"  sortable>
            </el-table-column>
            <el-table-column prop="cid" label="产品分类id"  sortable>
            </el-table-column>
            <el-table-column prop="versionCode" label="版本名称"  sortable>
            </el-table-column>
            <el-table-column prop="versionNum" label="版本序号"  sortable>
            </el-table-column>
            <el-table-column prop="fileName" label="文件名称"  sortable>
            </el-table-column>
            <el-table-column prop="fileSize" label="文件大小（字节）"  sortable>
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
                <el-form-item label="产品分类" prop="cid">
                    <el-select v-model="addForm.cid" placeholder="请选择">
                        <el-option
                                v-for="category in categories"
                                :key="category.id"
                                :label="category.cname"
                                :value="category.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="版本名称">
                    <el-input v-model="addForm.versionCode" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="版本序号">
                    <el-input-number v-model="addForm.versionNum" :min="0" :max="200"></el-input-number>
                </el-form-item>
                <el-form-item label="客户端">
                    <el-upload
                            ref="addUpload"
                            action="http://192.168.0.166:10010/api/product/installer/upload"
                            :on-remove="handleRemove"
                            :on-error="handleError"
                            :limit="1"
                    >
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                    </el-upload>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>

        <!--编辑界面-->
        <el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false" :before-close="beforeClose">
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
                <el-form-item label="版本名称">
                    <el-input v-model="editForm.versionCode" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="版本序号">
                    <el-input-number v-model="editForm.versionNum" :min="0" :max="200"></el-input-number>
                </el-form-item>
                <el-form-item label="客户端">
                    <el-upload
                            ref="editUpload"
                            :file-list="fileList"
                            action="http://192.168.0.166:10010/api/product/installer/upload"
                            :on-remove="handleRemove"
                            :on-error="handleError"
                            :limit="1"
                    >
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                    </el-upload>
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
    import util from '../../common/js/util'
    import axios from 'axios';
    //import NProgress from 'nprogress'
    import { baseUrl } from '../../api/api';

    export default {
        name: "Installer",
        data() {
            return {
                filters: {
                    key: ''
                },
                items: [],
                categories:[],
                total: 0,
                page: 1,
                listLoading: false,
                fileList:[],
                //列表选中列
                sels: [],
                //新增界面是否显示
                addFormVisible: false,
                addLoading: false,
                addFormRules: {
                    name: [
                        { required: true, message: '请输入姓名', trigger: 'blur' }
                    ]
                },
                //新增界面数据
                addForm: {
                    cid: '',
                    versionCode: "",
                    versionNum: 0,
                    fileName:'',
                    fileSize: ''
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
                    cid: '',
                    versionCode: -1,
                    versionNum: 0,
                    fileName: '',
                    fileSize: ''
                },
            }
        },
        methods: {
            handleCurrentChange(val) {
                this.page = val;
                this.getCategories();
            },
            //获取用户列表
            getInstallers() {
                let params = {
                    page: this.page,
                    key: this.filters.name
                };
                this.listLoading = true;
                axios.get(baseUrl+'/product/installer/page', {
                        params: params
                    }
                ).then((resp)=>{
                    this.total = resp.data.total;
                    this.items = resp.data.items;
                    this.listLoading = false;
                });
            },
            //查产品分类
            getCategories(){
                axios.get(baseUrl+'/product/category/all')
                    .then((resp)=>{
                    this.categories = resp.data;
                }).catch(()=>{
                    this.$message.error("获取产品分类失败!");
                });
            },

            //显示新增界面
            handleAdd: function () {
                this.addFormVisible = true;
                this.addForm = {
                    cid: '',
                    versionCode: "",
                    versionNum: 0,
                    fileName:'',
                    fileSize: ''
                };
            },
            //新增
            addSubmit: function () {
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addLoading = true;
                            let files=Object.assign({}, this.$refs.addUpload.uploadFiles);
                            if (files.length = 0) {
                                this.$message.error("请上传客户端!");
                            }
                            this.addForm.fileName = files[0].name;
                            this.addForm.fileSize = files[0].size;
                            axios({
                                method:'post',
                                url:baseUrl+ '/product/installer',
                                data: this.$qs.stringify(this.addForm)
                            }).then(() => {
                                this.addLoading = false;
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['addForm'].resetFields();
                                this.addFormVisible = false;
                                this.getInstallers();
                            }).catch((resp) => {
                                this.addLoading = false;
                                let message = resp.response.data.message;
                                this.$message.error("保存失败！"+message);
                            });
                        });
                    }
                });
            },
            //删除上传的文件
            handleRemove: function (file) {
                let para = { fileName: file.name };
                axios.delete(baseUrl+'/product/installer/upload', {
                    params: para
                }).then(()=>{
                    this.$message({
                        message: '文件删除成功',
                        type: 'success'
                    });
                    this.getInstallers();
                }).catch(() => {
                    this.$message.error('文件删除失败！');
                });
            },
            handleError:function(err){
                this.$message.error(err.message);
            },
            //删除
            handleDel: function (index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    let para = { id: row.id };
                    axios.delete(baseUrl+'/product/installer', {
                        params: para
                    }).then(()=>{
                        this.listLoading = false;
                        this.$message({
                            message: '文件删除成功',
                            type: 'success'
                        });
                        this.getInstallers();
                    }).catch(() => {
                        this.listLoading = false;
                        this.$message.error('文件删除失败！');
                    });
                })
            },
            //显示编辑界面
            handleEdit: function (index, row) {
                this.editFormVisible = true;
                let file= {name:row.fileName}
                this.fileList.push(file);
                this.editForm = Object.assign({}, row);
            },

            //编辑
            editSubmit: function () {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editLoading = true;
                            let files=Object.assign({}, this.$refs.editUpload.uploadFiles);
                            if (files.length = 0) {
                                this.$message.error("请上传客户端!");
                            }
                            debugger
                            this.editForm.fileName = files[0].name;
                            if (files[0].size) {
                                this.editForm.fileSize = files[0].size;
                            }
                            axios({
                                method:'put',
                                url:baseUrl+ '/product/installer',
                                data: this.$qs.stringify(this.editForm)
                            }).then(() => {
                                this.editLoading = false;
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['editForm'].resetFields();
                                this.editFormVisible = false;
                                this.getInstallers();
                            }).catch((resp) => {
                                this.editLoading = false;
                                let message = resp.response.data.message;
                                this.$message.error("保存失败！"+message);
                            });

                        });
                    }
                });
            },
            beforeClose:function(){
                this.fileList=[];
                this.editFormVisible = false;
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
                    //NProgress.start();
                    let para = { ids: ids };
                    batchRemoveUser(para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getInstallers();
                    });
                }).catch(() => {

                });
            }
        },
        mounted() {
            this.getInstallers();
            this.getCategories();
        }
    }
</script>
<style scoped>
</style>