<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-calendar"></i> 用户设置
        </el-breadcrumb-item>
        <el-breadcrumb-item>修改密码</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="form-box">
        <el-form ref="form" :model="form" label-width="120px" :rules="fieldRules">
          <el-form-item label="原密码"  prop="password">
            <el-input v-model="form.password" type="password"></el-input>
          </el-form-item>
          <el-form-item label="新密码"  prop="newPassword">
            <el-input v-model="form.newPassword" type="password"></el-input>
          </el-form-item>
          <el-form-item label="确认密码"  prop="confirm">
            <el-input v-model="form.confirm" type="password"></el-input>
          </el-form-item>
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
  import Routers from '@/router'
  export default {
    name: 'password',
    data() {
      var validatePass = (rule, value, callback) => {
        if (!this.form.newPassword) {
          callback(new Error('请输入新密码'));
        } else if (!value) {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.form.newPassword) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        form: {
          password: '',
          newPassword: '',
          confirm: '',
        },
        fieldRules: {
          password: [{required: true, message: '请输入原密码', trigger: 'blur'}],
          newPassword: [{validator: validatePass, trigger: 'blur'}],
          confirm: [{validator: validatePass, trigger: 'blur'}]
        }
      };
    },
    methods: {
      onSubmit(form) {
        this.$refs[form].validate((valid) => {
          if (valid) {
            httpPost('user/changePassword', this.form).then(res => {
              if (res.code == 0) {
                this.$alert('密码修改成功，请重新登陆', {
                  confirmButtonText: '确定',
                  callback: action => {
                    localStorage.clear();
                    Routers.push('/login');
                  }
                });
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
