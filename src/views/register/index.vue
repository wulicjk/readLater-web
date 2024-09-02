<template>
  <div class="register-container">
    <el-form ref="registerForm" :model="registerForm"
             :rules="registerRules" class="register-form" auto-complete="on" label-position="top">
      <div class="title-container">
        <h3 class="title">注册</h3>
      </div>

      <el-form-item label="用户名" prop="username">
        <el-input
          ref="username"
          v-model="registerForm.username"
          placeholder="请输入用户名"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        >
        </el-input>
      </el-form-item>

      <el-form-item label="密码" prop="password">
        <el-input
          :key="passwordType"
          ref="password"
          v-model="registerForm.password"
          :type="passwordType"
          placeholder="请输入密码"
          name="password"
          tabindex="2"
          auto-complete="on"
        >
          <template #append>
            <span class="show-pwd" @click="showPwd">
              <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"/>
            </span>
          </template>
        </el-input>
      </el-form-item>

      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input
          :key="confirmPasswordType"
          ref="confirmPassword"
          v-model="registerForm.confirmPassword"
          :type="confirmPasswordType"
          placeholder="请再次输入密码"
          name="confirmPassword"
          tabindex="3"
          auto-complete="on"
        >
          <template #append>
            <span class="show-pwd" @click="showConfirmPwd">
              <svg-icon :icon-class="confirmPasswordType === 'password' ? 'eye' : 'eye-open'"/>
            </span>
          </template>
        </el-input>
      </el-form-item>

      <el-form-item label="昵称" prop="nickName">
        <el-input
          ref="nickName"
          v-model="registerForm.nickName"
          placeholder="请输入昵称"
          name="nickName"
          type="text"
          tabindex="4"
          auto-complete="on"
        >
        </el-input>
      </el-form-item>

      <el-form-item label="手机号" prop="phone">
        <el-input
          ref="phone"
          v-model="registerForm.phone"
          placeholder="请输入手机号"
          name="phone"
          type="text"
          tabindex="5"
          auto-complete="on"
        >
        </el-input>
      </el-form-item>

      <el-form-item label="邮箱" prop="email">
        <el-input
          ref="email"
          v-model="registerForm.email"
          placeholder="请输入邮箱"
          name="email"
          type="email"
          tabindex="6"
          auto-complete="on"
        >
        </el-input>
      </el-form-item>

      <el-button :loading="loading" type="primary" style="width: 100%; margin-bottom: 30px;"
                 @click.native.prevent="handleRegister">
        注册
      </el-button>

      <div class="login-container">
        <span>已经有账号了？</span>
        <router-link to="/login">登录</router-link>
      </div>
    </el-form>
  </div>
</template>

<script>
import {validUsername, validEmail, validPhone} from '@/utils/validate'

export default {
  name: 'Register',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('请输入有效的用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能少于6位'))
      } else {
        callback()
      }
    }
    const validateConfirmPassword = (rule, value, callback) => {
      if (value !== this.registerForm.password) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    }
    const validateEmail = (rule, value, callback) => {
      if (!validEmail(value)) {
        callback(new Error('请输入有效的邮箱'))
      } else {
        callback()
      }
    }
    const validatePhone = (rule, value, callback) => {
      if (!validPhone(value)) {
        callback(new Error('请输入有效的手机号'))
      } else {
        callback()
      }
    }
    return {
      registerForm: {
        username: '',
        password: '',
        confirmPassword: '',
        nickName: '',
        phone: '',
        email: ''
      },
      registerRules: {
        username: [{required: true, trigger: 'blur', validator: validateUsername}],
        password: [{required: true, trigger: 'blur', validator: validatePassword}],
        confirmPassword: [{required: true, trigger: 'blur', validator: validateConfirmPassword}],
        email: [{required: true, trigger: 'blur', validator: validateEmail}],
        phone: [{required: true, trigger: 'blur', validator: validatePhone}]
      },
      loading: false,
      passwordType: 'password',
      confirmPasswordType: 'password'
    }
  },
  methods: {
    showPwd() {
      this.passwordType = this.passwordType === 'password' ? '' : 'password';
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    showConfirmPwd() {
      this.confirmPasswordType = this.confirmPasswordType === 'password' ? '' : 'password';
      this.$nextTick(() => {
        this.$refs.confirmPassword.focus();
      });
    },
    handleRegister() {
      this.$refs.registerForm.validate(valid => {
        if (valid) {
          this.loading = true;
          // Simulate a register API call
          setTimeout(() => {
            this.loading = false;
            this.$router.push('/login');
          }, 1500);
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }
  }
}
</script>

<style lang="scss">
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
  height: 100vh;

  .register-form {
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    width: 400px;
    max-width: 100%;

    .title-container {
      text-align: center;
      margin-bottom: 20px;

      .title {
        font-size: 24px;
        font-weight: bold;
        color: #333;
      }
    }

    .el-form-item {
      margin-bottom: 20px;

      .el-input {
        width: 100%;

        input {
          padding: 10px;
          border-radius: 4px;
          border: 1px solid #dcdfe6;

          &:focus {
            border-color: #409eff;
          }
        }
      }

      .show-pwd {
        cursor: pointer;
        color: #409eff;
      }
    }

    .login-container {
      text-align: center;
      margin-top: 20px;

      span {
        color: #333;
        margin-right: 10px;
      }

      a {
        color: #409eff;
        text-decoration: none;

        &:hover {
          color: lighten(#409eff, 10%);
        }
      }
    }
  }
}
</style>
