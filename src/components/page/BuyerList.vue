<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 用户列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button type="danger" icon="el-icon-delete" v-if="delShow" @click="delAllSelection">
          批量删除
        </el-button>
        <el-button type="primary" icon="el-icon-plus" @click="addUser">新增</el-button>
        <el-input v-model="query.userName" placeholder="用户名" class="handle-input mr10" clearable></el-input>
        <el-input v-model="query.nickName" placeholder="姓名" class="handle-input mr10" clearable></el-input>
        <el-input v-model="query.telephone" placeholder="手机号" class="handle-input mr10" clearable></el-input>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
      </div>
      <el-table :data="tableData" border class="table" ref="multipleTable"
                header-cell-class-name="table-header" @selection-change="handleSelectionChange">
        <el-table-column type="index" width="55" align="center"></el-table-column>
        <el-table-column prop="userName" label="用户名" align="center"></el-table-column>
        <el-table-column prop="nickName" label="姓名" align="center"></el-table-column>
        <el-table-column prop="telephone" label="手机号" align="center"></el-table-column>
        <el-table-column prop="expireStr" label="过期时间" align="center"></el-table-column>
        <el-table-column prop="createTimeStr" label="创建时间" align="center"></el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="handleEdit(scope.$index, scope.row)">编辑 </el-button>
            <el-button type="text" @click="openPwd(scope.$index, scope.row)">重置密码</el-button>
            <el-button type="text" class="red" @click="handleDelete(scope.$index, scope.row)">禁用</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background layout="total, prev, pager, next, jumper"
                       :current-page="query.pageNum" :page-size="query.pageSize" :total="pageTotal"
                       @current-change="handlePageChange">
        </el-pagination>
      </div>
    </div>

    <!-- 编辑弹出框 -->
    <el-dialog :title=dialogFormTitle :visible.sync="editVisible" width="50%">
      <el-form ref="form" :model="form" label-width="150px" :rules="fieldRules">
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="form.userName"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="nickName">
          <el-input v-model="form.nickName"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="telephone">
          <el-input v-model="form.telephone"></el-input>
        </el-form-item>
        <el-form-item label="过期时间">
          <el-col :span="11">
            <el-date-picker v-model="form.expire" type="datetime"
                            placeholder="选择日期" default-time="23:59:59"
                            value-format="timestamp">
            </el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input label="备注" v-model="form.remark" type="textarea" :rows="4"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit('form')">确 定</el-button>
            </span>
    </el-dialog>
  </div>
</template>

<script>
  import {httpPost, httpGet, httpJson} from '@/api';

  export default {
    name: 'buyerList',
    data() {
      return {
        query: {
          state: 1,
          roleId: 3,
          address: '',
          name: '',
          pageNum: 1,
          pageSize: 10,
        },
        dialogFormTitle: '新增',
        tableData: [],
        multipleSelection: [],
        delList: [],
        editVisible: false,
        pageTotal: 0,
        form: {},
        idx: -1,
        id: -1,
        fieldRules: {
          userName: [{required: true, message: '用户名', trigger: 'blur'}],
        },
        delShow: false,
        optionVisible: false
      }
    },
    created() {
      this.getData();
    },
    methods: {
      getData() {
        httpPost('buyer/list', this.query).then((res) => {
          if (res.code == 0) {
            this.tableData = res.data;
            this.pageTotal = res.total;
          } else {
            this.$message({message: res.message, type: 'error'})
          }
        }).catch((res) => {
          this.$message({message: res.message, type: 'error'})
        });
      },
      // 触发搜索按钮
      handleSearch() {
        this.$set(this.query, 'pageNum', 1);
        this.getData();
      },
      // 删除操作
      handleDelete(index, row) {
        // 二次确认删除
        this.$confirm('确定要删除吗？', '提示', {
          type: 'warning'
        }).then(() => {
          var str = [row.id];
          httpJson('order/delOrder', {'ids': str}).then(res => {
            if (res.code == 0) {
              this.$message.success('删除成功');
              this.tableData.splice(index, 1);
            } else {
              this.$message({message: res.message, type: 'error'})
            }
          }, err => {
            this.$message({message: err, type: 'error'})
          });
        }).catch(() => {
        });
      },
      // 多选操作
      handleSelectionChange(val) {
        if (val.length > 0) {
          this.delShow = true;
        } else {
          this.delShow = false;
        }
        this.multipleSelection = val;
      },
      //批量删除
      delAllSelection() {
        this.$confirm('确定要删除吗？', '提示', {
          type: 'warning'
        }).then(() => {
          const length = this.multipleSelection.length;
          var str = [];
          this.delList = this.delList.concat(this.multipleSelection);
          for (let i = 0; i < length; i++) {
            str.push(this.multipleSelection[i].id);
          }
          httpJson('order/delOrder', {'ids': str}).then((res) => {
            if (res.code == 0) {
              this.$message.success(res.message);
              this.multipleSelection = [];
              this.getData();
            } else {
              this.$message.error(res.message);
            }
          }).catch((res) => {
            this.$message.error(res);
          });
        }).catch(() => {
        });
      },
      // 编辑操作
      handleEdit(index, row) {
        this.dialogFormTitle = '编辑';
        if (this.$refs['form'] !== undefined) {
          this.$nextTick(() => {
            this.$refs['form'].clearValidate();
          })
        }
        this.idx = index;
        this.form = {
          id: row.id,
          userName: row.userName,
          nickName: row.nickName,
          telephone: row.telephone,
          remark: row.remark,
          expire: row.expire
        };
        this.editVisible = true;
      },
      // 保存编辑
      saveEdit(form) {
        this.$refs[form].validate((valid) => {
          if (valid) {
            var param = {
              id: this.form.id,
              userName: this.form.userName,
              nickName: this.form.nickName,
              telephone: this.form.telephone,
              remark: this.form.remark,
              expire: this.form.expire
            }
            httpPost('buyer/saveUser', param).then(res => {
              if (res.code == 0) {
                this.$message.success(res.message);
                this.getData();
                // this.$set(this.tableData, this.idx, this.form);
                this.editVisible = false;
              } else {
                this.$message({message: res.message, type: 'error'})
              }
            }, err => {
              this.$message({message: err.message, type: 'error'})
            });
          }
        });
      },
      // 分页导航
      handlePageChange(val) {
        this.$set(this.query, 'pageNum', val);
        this.getData();
      },
      addUser() {
        if (this.$refs['form'] !== undefined) {
          this.$nextTick(() => {
            this.$refs['form'].resetFields();
          })
        }
        this.dialogFormTitle = '新增';
        this.form = {
          userName: '',
          nickName: '',
          telephone: '',
          remark: '',
          expire: ''
        };
        this.editVisible = true;
      },
      openPwd(index, row) {
        this.$prompt('默认密码888888，如需自定，请填写密码', '重置密码', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputType: 'password',
          inputPlaceholder: ''
        }).then(({value}) => {
          httpPost('user/resetPassword', {'uname': row.userName, 'password': value}).then(res => {
            if (res.code == 0) {
              this.$message.success(res.message);
            } else {
              this.$message({message: res.message, type: 'error'})
            }
          }, err => {
            this.$message({message: err.message, type: 'error'})
          });
        }).catch(() => {

        });
      }
    }
  };
</script>

<style scoped>
  .handle-box {
    margin-bottom: 20px;
  }

  .handle-select {
    width: 120px;
  }

  .handle-input {
    width: 200px;
    display: inline-block;
  }

  .table {
    width: 100%;
    font-size: 14px;
  }

  .red {
    color: #ff0000;
  }

  .mr10 {
    margin-right: 10px;
  }

  .table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
  }
</style>
