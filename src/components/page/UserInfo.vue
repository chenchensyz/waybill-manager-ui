<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-calendar"></i> 设置
        </el-breadcrumb-item>
        <el-breadcrumb-item>账户信息</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="form-box">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="账号">
            <el-input v-model="form.userName" disabled="disabled"></el-input>
          </el-form-item>
          <el-form-item label="姓名">
            <el-input v-model="form.nickName"></el-input>
          </el-form-item>
          <el-form-item label="手机号">
            <el-input v-model="form.telephone"></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input  v-model="form.remark" type="textarea" :rows="4"></el-input>
          </el-form-item>
          <el-form-item label="过期时间">
            <el-input v-model="form.expireStr" disabled="disabled"></el-input>
          </el-form-item>
          <el-form-item label="创建时间">
            <el-input v-model="form.createTimeStr" disabled="disabled"></el-input>
          </el-form-item>
          <!--<el-form-item label="修改时间">-->
            <!--<el-input v-model="form.updateTimeStr" disabled="disabled"></el-input>-->
          <!--</el-form-item>-->
          <el-form-item>
            <el-button type="primary" @click="onSubmit('form')">保存</el-button>
            <el-button>取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
  import {httpPost, httpGet} from '@/api';

  export default {
    name: 'userInfo',
    data() {
      return {
        form: {
          id: '',
          userName: '',
          nickName: '',
          telephone: '',
          createTimeStr: '',
          expireStr: ''
        }
      };
    },
    created() {
      this.getData();
    },
    methods: {
      getData() {
        httpGet('user/info').then((res) => {
          if (res.code == 0) {
            this.form = res.data;
            this.form.expireStr = res.data.expireStr == '' ? '未设置' : res.data.expireStr;
          } else {
            this.$message({message: res, type: 'error'})
          }
        }).catch((res) => {
          this.$message({message: res, type: 'error'})
        });
      },
      onSubmit(form) {
        this.$refs[form].validate((valid) => {
          if (valid) {
            var param = {
              id: this.form.id,
              userName: this.form.userName,
              nickName: this.form.nickName,
              telephone: this.form.telephone,
            }
            httpPost('user/saveUser', param).then(res => {
              if (res.code == 0) {
                this.$message.success(res.message);
              } else {
                this.$message({message: res.message, type: 'error'})
              }
            }, err => {
              this.$message({message: err, type: 'error'})
            });
          }
        });
      }
    }
  };
</script>
