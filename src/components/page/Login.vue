<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">一路查单</div>
      <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
        <el-form-item prop="username">
          <el-input v-model="param.userName" placeholder="username">
            <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            placeholder="password"
            v-model="param.password"
            @keyup.enter.native="submitForm()"
          >
            <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
          </el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="submitForm()">登录</el-button>
        </div>
        <p class="login-tips">Tips : 用户名和密码随便填。</p>
      </el-form>
    </div>
  </div>
</template>

<script>
  import {httpPost} from '@/api'

  export default {
    data: function () {
      return {
        param: {
          userName: 'admin',
          password: '123123',
        },
        rules: {
          userName: [{required: true, message: '请输入用户名', trigger: 'blur'}],
          password: [{required: true, message: '请输入密码', trigger: 'blur'}],
        },
      };
    },
    methods: {
      submitForm() {
        this.$refs.login.validate(valid => {
          if (valid) {
            var userInfo = {
              userName: this.param.userName,
              password: this.param.password,
            }
            httpPost('login', userInfo).then((res) => {
              if (res.code == 0) {
                localStorage.setItem('token', res.data.token);  // 放置token
                localStorage.setItem('userName', res.data.userName) // 保存用户到本地会话
                localStorage.setItem('timestamp', res.data.timestamp) // 角色
                this.$router.push('/')  // 登录成功，跳转到主页
              } else {
                this.$message({message: res.message, type: 'error'})
              }
            }).catch((res) => {
              this.$message({message: res, type: 'error'})
            });
          } else {
            this.$message.error('请输入账号和密码');
            console.log('error submit!!');
            return false;
          }
          return false;
        });
      },
    },
  };
</script>

<style scoped>
  .login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url(../../assets/img/login-bg.jpg);
    background-size: 100%;
  }

  .ms-title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: #fff;
    border-bottom: 1px solid #ddd;
  }

  .ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 350px;
    margin: -190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.3);
    overflow: hidden;
  }

  .ms-content {
    padding: 30px 30px;
  }

  .login-btn {
    text-align: center;
  }

  .login-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
  }

  .login-tips {
    font-size: 12px;
    line-height: 30px;
    color: #fff;
  }
</style>
