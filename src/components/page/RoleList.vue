<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 角色列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" icon="el-icon-plus" @click="alertAdd">新增</el-button>
      </div>
      <el-table :data="tableData" border class="table" ref="multipleTable"
                header-cell-class-name="table-header">
        <el-table-column type="index" width="55" align="center"></el-table-column>
        <el-table-column prop="roleCode" label="角色编码" align="center"></el-table-column>
        <el-table-column prop="roleName" label="角色名称" align="center"></el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button type="text" @click="permEdit(scope.$index, scope.row)">权限</el-button>
            <el-button type="text" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background layout="total, prev, pager, next"
                       :current-page="query.pageNum" :page-size="query.pageSize" :total="pageTotal"
                       @current-change="handlePageChange">
        </el-pagination>
      </div>
    </div>

    <!-- 编辑弹出框 -->
    <el-dialog :title=dialogFormTitle :visible.sync="editVisible" width="50%">
      <el-form ref="form" :model="form" label-width="150px" :rules="fieldRules">
        <el-form-item label="角色编码" prop="roleCode">
          <el-input v-model="form.roleCode"></el-input>
        </el-form-item>
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="form.roleName"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="introduction">
          <el-input label="描述" v-model="form.introduction" type="textarea" :rows="4"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit('form')">确 定</el-button>
        </span>
    </el-dialog>

    <!-- 权限 -->
    <el-dialog title="选择权限" :visible.sync="optionVisible" width="30%">
      <el-tree :data="perms" show-checkbox node-key="id" ref="tree"
               default-expand-all :default-checked-keys="checkedkeys" :props="defaultProps">
      </el-tree>
      <span slot="footer" class="buttons">
                <el-button @click="optionVisible = false">取 消</el-button>
                <el-button type="primary" @click="permSave">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
  import {httpPost, httpGet, httpJson} from '@/api';

  export default {
    name: 'roleList',
    data() {
      return {
        query: {
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
        fieldRules: {
          roleCode: [{required: true, message: '请输入角色编码', trigger: 'blur'}],
        },
        delShow: false,
        optionVisible: false,
        perms: [],
        checkedkeys: [],  //默认选中
        roleId: '',
        defaultProps: {
          children: 'subs',
          label: 'title'
        }
      }
    },
    created() {
      this.getData();
      this.getPerms();
    },
    methods: {
      getData() {
        httpPost('role/list', this.query).then((res) => {
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
      getPerms() {
        httpGet('permission/userPerms').then((res) => {
          if (res.code == 0) {
            this.perms = res.data;
          } else {
            this.$message({message: res.message, type: 'error'})
          }
        }).catch((res) => {
          this.$message({message: res, type: 'error'})
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
      // 编辑操作
      handleEdit(index, row) {
        this.dialogFormTitle = '编辑';
        if (this.$refs['form'] !== undefined) {
          this.$nextTick(() => {
            this.$refs['form'].clearValidate();
          })
        }
        this.form = {
          id: row.id,
          roleCode: row.roleCode,
          roleName: row.roleName,
          introduction: row.introduction
        };
        this.editVisible = true;
      },
      // 保存编辑
      saveEdit(form) {
        this.$refs[form].validate((valid) => {
          if (valid) {
            var param = {
              id: this.form.id,
              roleCode: this.form.roleCode,
              roleName: this.form.roleName,
              introduction: this.form.introduction
            }
            httpPost('role/saveRole', param).then(res => {
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
      alertAdd() {
        if (this.$refs['form'] !== undefined) {
          this.$nextTick(() => {
            this.$refs['form'].resetFields();
          })
        }
        this.dialogFormTitle = '新增';
        this.form = {
          roleCode: '',
          roleName: '',
          introduction: ''
        };
        this.editVisible = true;
      },
      permEdit(index, row) {
        if (this.$refs['tree'] !== undefined) {
          this.$nextTick(() => {
            this.$refs['tree'].setCheckedKeys([]);
          })
        }
        httpGet('permission/permsSet', {'roleId': row.id}).then((res) => {
          if (res.code == 0) {
            var perms = res.data;
            this.checkedkeys = [];
            for (var i = 0; i < perms.length; i++) { //过滤菜单项，用于显示非全选菜单
              if (perms[i].type == 1) {
                this.checkedkeys.push(perms[i].id);
              }
            }
            this.roleId = row.id;
          } else {
            this.$message({message: res.message, type: 'error'})
          }
        }).catch((res) => {
          this.$message({message: res, type: 'error'})
        });
        this.optionVisible = true;
      },
      permSave() {
        var perms = this.$refs['tree'].getCheckedKeys();  //选中
        var halfChecked = this.$refs['tree'].getHalfCheckedKeys()
        if (halfChecked.length > 0) {
          for (var i = 0; i < halfChecked.length; i++) {
            perms.push(halfChecked[i]);  //半选中
          }
        }
        httpJson('permission/userPermsSave', {'roleId': this.roleId, 'perms': perms}).then((res) => {
          if (res.code == 0) {
            this.$message.success(res.message);
            this.optionVisible = false;
          } else {
            this.$message.error(res.message);
          }
        }).catch((res) => {
          this.$message.error(res);
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
