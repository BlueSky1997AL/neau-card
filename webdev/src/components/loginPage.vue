<template>
  <div>
    <group title="东农校内 - 一卡通登陆">
      <x-input type="text" :required="required" title="学号" placeholder="你的学号" v-model="username" placeholder-align="center" text-align="center" :show-clear="showClearBtn"></x-input>
      <x-input type="password" :required="required" title="密码" placeholder="默认密码为身份证后六位" v-model="password" placeholder-align="center" text-align="center" :show-clear="showClearBtn"></x-input>
      <x-input title="验证码" class="weui-cell_vcode" text-align="center" :show-clear="showClearBtn">
        <img slot="right" class="weui-vcode-img" src="https://i.loli.net/2017/09/18/59bf7f32425d5.jpg">
      </x-input>
    </group>

    <box gap="10px 10px">
      <x-button type="primary" :text="btnText" :disabled="btnDisabled" :show-loading="subBtnLoad" action-type="submit" class="btn" @click.native="submit"></x-button>
    </box>
  </div>
</template>

<script>
import { Group, XInput, XButton, Box } from 'vux'

export default {
  components: {
    Group,
    XInput,
    XButton,
    Box
  },
  data () {
    return {
      showClearBtn: false,
      subBtnLoad: false,
      btnText: '获取信息',
      btnDisabled: false,
      required: true,
      username: '',
      password: ''
    }
  },
  methods: {
    submit () {
      console.log('testMsg')
    }
  }
}
</script>

<style>
</style>
