<template>
  <div>
    <div class="login-container">
      <el-form ref="loginForm" :model="loginForm"
               :rules="loginRules" class="login-form" auto-complete="on" label-position="top">
        <div class="title-container">
          <h3 class="title">登录</h3>
        </div>

        <el-form-item label="用户名" prop="username">
          <el-input
            ref="username"
            v-model="loginForm.username"
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
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="请输入密码"
            name="password"
            tabindex="2"
            auto-complete="on"
            @keyup.enter.native="handleLogin"
          >
            <template #append>
            <span class="show-pwd" @click="showPwd">
              <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"/>
            </span>
            </template>
          </el-input>
        </el-form-item>

        <el-button :loading="loading" type="primary" style="width: 100%; margin-bottom: 30px;"
                   @click.native.prevent="handleLogin">
          登录
        </el-button>

        <div class="signup-container">
          <span>没有账号?</span>
          <router-link to="/register">注册</router-link>
        </div>
      </el-form>
    </div>
    <Footer></Footer>
  </div>
</template>

<script>
import {validUsername} from '@/utils/validate'
import {constantRoutes} from "@/router";
import Footer from "@/views/common/footer.vue";

export default {
  name: 'Login',
  components: {Footer},
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
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{required: true, trigger: 'blur', validator: validateUsername}],
        password: [{required: true, trigger: 'blur', validator: validatePassword}]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      this.passwordType = this.passwordType === 'password' ? '' : 'password'
      this.$nextTick(() => {
        this.$refs.password.focus();
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm).then(() => {
            this.$router.push({path: this.redirect || '/'})
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
  height: 100vh;

  .login-form {
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

    .signup-container {
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
