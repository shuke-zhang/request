<script setup lang="ts">
import type { AxiosResponse } from 'axios';
import type { ElForm } from 'element-plus';

import { getBaseCodeImg, loginApi } from '@/api/auth';

import { DataLine, User } from '@element-plus/icons-vue';
interface CodeImageResponse {
  img: string;
  uuid: string;
}
const loginRef = ref<InstanceType<typeof ElForm>>();
const loginForm = ref({
  username: 'admin',
  password: 'admin123',
  code: '',
  uuid: '',
});
const codeImg = ref('');

const isLoginLoading = ref(false);

const rules = reactive({
  username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  code: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
});

function getCode() {
  return getBaseCodeImg().then((res: AxiosResponse<CodeImageResponse>) => {
    codeImg.value = res.data.img;
    loginForm.value.uuid = res.data.uuid;
  });
}

function submit() {
  loginRef.value?.validate(valid => {
    if (valid) {
      isLoginLoading.value = true;
      loginApi(loginForm.value).then(res => {
        if (res.data.code == 200) {
          isLoginLoading.value = false;
          console.log('登录成功');
          ElMessage({
            type: 'success',
            message: '登录成功',
          });
        } else {
          isLoginLoading.value = false;
          console.log('登录失败');
          loginForm.value.code = '';
          ElMessage({
            type: 'error',
            message: res.data.msg,
          });
          getCode();
        }
      });
    }
  });
}
onMounted(() => {
  getCode();
});
</script>

<template>
  <div class="container w-full h-full flex-center">
    <div class="login w-100 h-100">
      <div class="login-form">
        <div class="login-form-input">
          <el-form ref="loginRef" :model="loginForm" :rules="rules">
            <el-form-item label="" prop="username">
              <el-input
                v-model="loginForm.username"
                placeholder="请输入账号"
                size="large"
                class="user-info-item input"
                :prefix-icon="User"
                @keyup.enter="submit"
              />
            </el-form-item>

            <el-form-item label="" prop="password">
              <el-input
                v-model="loginForm.password"
                placeholder="请输入密码"
                size="large"
                class="user-info-item input"
                show-password
                type="password"
                :prefix-icon="DataLine"
                @keyup.enter="submit"
              />
            </el-form-item>

            <el-form-item label="" prop="code">
              <div class="w-full flex flex-justify-between">
                <el-input
                  v-model="loginForm.code"
                  placeholder="请输入验证码"
                  size="large"
                  class="user-info-item input"
                  :prefix-icon="DataLine"
                  @keyup.enter="submit"
                />
                <el-image
                  class="ml-10 w-[100px] h-[40px] cursor-pointer"
                  :src="`data:image/gif;base64,${codeImg}`"
                  @click="getCode"
                />
              </div>
            </el-form-item>

            <el-form-item>
              <el-button
                type="primary"
                size="large"
                class="w-full user-info-item login-button"
                :disabled="isLoginLoading"
                @keyup.enter="submit"
                @click="submit"
              >
                <span v-if="!isLoginLoading">登录</span>
                <span v-else>登录中...</span>
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
html {
  height: 100vh;
}
body {
  background-color: #f5f7fa;
  height: 100vh;
}
#app {
  height: 100vh;
}
</style>
