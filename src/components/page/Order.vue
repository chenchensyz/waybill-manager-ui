<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 订单列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-dropdown @command="handleTags" trigger="click">
          <el-button size="mini" type="primary">
            新增<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu size="small" slot="dropdown">
            <el-dropdown-item command="all">批量增加</el-dropdown-item>
            <el-dropdown-item command="one">单条增加</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-input v-model="query.orderNum" placeholder="单号" class="handle-input mr10" clearable></el-input>
        <el-input v-model="query.userName" placeholder="代购(微信名)" class="handle-input mr10" clearable></el-input>
        <el-input v-model="query.customer" placeholder="顾客姓名" class="handle-input mr10" clearable></el-input>
        <el-input v-model="query.telephone" placeholder="顾客手机号" class="handle-input mr10" clearable></el-input>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
      </div>
      <el-button type="danger" icon="el-icon-delete" v-if="delShow" @click="delAllSelection">
        批量删除
      </el-button>
      <el-table :data="tableData" border class="table" ref="multipleTable"
                header-cell-class-name="table-header" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column prop="orderNum" label="单号" align="center" width="180"></el-table-column>
        <el-table-column prop="userName" label="代购(微信名)" align="center"></el-table-column>
        <el-table-column prop="customer" label="顾客姓名" align="center"></el-table-column>
        <el-table-column prop="telephone" label="顾客手机号" align="center"></el-table-column>
        <el-table-column prop="detail" label="商品明细" align="center" :show-overflow-tooltip='true'></el-table-column>
        <el-table-column label="操作" width="130" align="center">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">
              编辑
            </el-button>
            <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)"
            >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background layout="total, prev, pager, next, jumper"
          :current-page="query.pageNum"  :page-size="query.pageSize" :total="pageTotal"
          @current-change="handlePageChange">
        </el-pagination>
      </div>
    </div>

    <!-- 编辑弹出框 -->
    <el-dialog :title=dialogFormTitle :visible.sync="editVisible" width="50%">
      <el-form ref="form" :model="form" label-width="150px" :rules="fieldRules">
        <el-form-item label="单号" prop="orderNum">
          <el-input v-model="form.orderNum"></el-input>
        </el-form-item>
        <el-form-item label="代购(微信名)" prop="userName">
          <el-input v-model="form.userName"></el-input>
        </el-form-item>
        <el-form-item label="顾客姓名" prop="customer">
          <el-input v-model="form.customer"></el-input>
        </el-form-item>
        <el-form-item label="顾客手机号" prop="telephone">
          <el-input v-model="form.telephone"></el-input>
        </el-form-item>
        <el-form-item label="商品明细" prop="detail">
          <el-input label="商品明细" v-model="form.detail" type="textarea" :rows="4"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit('form')">确 定</el-button>
            </span>
    </el-dialog>

    <el-dialog title="批量增加" :visible.sync="addMoreVisible" width="30%">
      <el-upload class="upload-file" :action="uploadAction" :headers="uploadHeaders" :file-list="fileList"
                 multiple :on-success="handleSuccess" :on-error="handleError">
        <el-button slot="trigger" size="small" type="primary">点击上传</el-button>
        <el-button size="small" type="success" @click="downModel" style="margin-left: 10px;">下载模板</el-button>
      </el-upload>
      <div style="color: #666;padding-top:20px;padding-left: 20px;">
        <h3>批量上传</h3><br>
        <p>请下载示例文件填写上传，如已下载请点击上传</p>
        <p>上传文件格式xls/xlsx</p>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {httpPost, httpGet, httpJson} from '@/api';

  export default {
    name: 'dashboard',
    data() {
      return {
        query: {
          state: 1,
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
          orderNum: [{required: true, message: '请输入单号', trigger: 'blur'}],
          userName: [{required: true, message: '请输入代购(微信名)', trigger: 'blur'}],
          customer: [{required: true, message: '请输入顾客姓名', trigger: 'blur'}],
          telephone: [{required: true, message: '请输入顾客手机号', trigger: 'blur'}],
          detail: [{required: true, message: '请输入商品明细', trigger: 'blur'}],
        },
        uploadAction: process.env.API_ROOT + 'order/addOrderMore',
        addMoreVisible: false,
        fileList: [],
        uploadHeaders: {
          'userName': localStorage.getItem('userName'),
          'token': localStorage.getItem('token'),
          'timestamp': localStorage.getItem('timestamp')
        },
        delShow: false
      }
    },
    created() {
      this.getData();
    },
    methods: {
      getData() {
        httpPost('order/list', this.query).then((res) => {
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
          orderNum: row.orderNum,
          customer: row.customer,
          telephone: row.telephone,
          detail: row.detail
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
              orderNum: this.form.orderNum,
              customer: this.form.customer,
              telephone: this.form.telephone,
              detail: this.form.detail
            }
            httpPost('order/saveOrder', param).then(res => {
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
      handleTags(command) {
        command === 'one' ? this.addOne() : this.addAll();
      },
      addOne() {
        if (this.$refs['form'] !== undefined) {
          this.$nextTick(() => {
            this.$refs['form'].resetFields();
          })
        }
        this.dialogFormTitle = '新增';
        this.form = {
          userName: '',
          orderNum: '',
          customer: '',
          telephone: '',
          detail: ''
        };
        this.editVisible = true;
      },
      addAll() {
        this.fileList = [];
        this.addMoreVisible = true;
      },
      handleSuccess(response, file, fileList) {
        if (response.code == 0) {
          this.addMoreVisible = false;
          this.$message({message: response.message, type: 'success'})
          this.getData();
        } else {
          this.$message({message: response.message, type: 'error'});
          this.fileList = [];
        }
      },
      handleError(err, file, fileList) {
        this.$message({message: err, type: 'error'})
      },
      downModel() {
        location.href = process.env.API_ROOT + "file/导入单号模板.xls"
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
