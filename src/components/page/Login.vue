<template>
  <div class="login-div">
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">一路查单</div>
      <el-form :model="param" :rules="rules" ref="login"  label-width="60px" class="ms-content">
        <el-form-item prop="userName" label="账号" class="login-title">
          <el-input v-model="param.userName" placeholder="用户名">
            <!--<el-button slot="prepend" icon="el-icon-lx-people">账号</el-button>-->
          </el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码" class="login-title">
          <el-input type="password" placeholder="密码" v-model="param.password"
                    @keyup.enter.native="submitForm()">
            <!--<el-button slot="prepend" icon="el-icon-lx-lock">密码</el-button>-->
          </el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="submitForm()" :loading="loading">{{loginText}}</el-button>
        </div>
      </el-form>
    </div>
  </div>
  <div class="login-beian">
<!--    备案号：<router-link target="_blank" :to="{path:'http://www.beian.miit.gov.cn'}">苏ICP备19068096号</router-link>-->

    <p>备案号：<a :href="'http://www.beian.miit.gov.cn/'" target="_blank" >苏ICP备19068096号</a></p>
  </div>
  </div>
</template>

<script>
  import {httpPost} from '@/api'

  export default {
    data: function () {
      return {
        param: {
          userName: '',
          password: '',
        },
        rules: {
          userName: [{required: true, message: '请输入用户名', trigger: 'blur'}],
          password: [{required: true, message: '请输入密码', trigger: 'blur'}],
        },
        loginText: "登陆",
        clickNum: 0,
        loading: false,
        totalTime: 30
      };
    },
    methods: {
      submitForm() {
        if (this.clickNum >= 5) {
          this.loginText = '请' + this.totalTime + '秒后重试';
          this.loading = true;
          let timeout = this.totalTime;
          let clock = window.setInterval(() => {
            timeout--;
            this.loginText = '请' + timeout + '秒后重试'
            if (timeout == 0) {
              window.clearInterval(clock)
              this.loading = false;
              this.clickNum = 0;
              this.loginText = "登陆";
            }
          }, 1000)
          return false;
        }

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
                return false;
              } else {
                this.$message({message: res.message, type: 'error'})
              }
            }).catch((res) => {
              this.$message({message: res, type: 'error'})
            });
          } else {
            this.$message.error('请输入账号和密码');
            console.log('error submit!!');
          }
          this.clickNum = this.clickNum + 1;
          return false;
        });
      },
    },
  };
</script>

<style scoped>
  .login-div {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .login-wrap {
    position: relative;
    width: 100%;
    height: 96%;
    background-image: url(../../assets/img/login-bg.jpg);
    background-size: 89%;
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

  .login-title{
    border-right-color: rgba(0, 0, 0, 0.1);
    border-left-color: rgba(0, 0, 0, 0.1);
    background-color: #f5f7fa;
    color: inherit;
    border-top: 0px;
    border-bottom: 0px;
    border-radius:5px
  }

  .login-beian{
    position: absolute;
    right: 10px;
  }
</style>
