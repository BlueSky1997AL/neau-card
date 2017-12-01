<template>
  <div class="main-container">
    <info-card :stu-id="stuId" :balance="balance" :update-time="updateTime" :show-info="showStatus" @display-status-change="changeDisplayStatus" :update="updateData"></info-card>
    <div class="section-label">最近七天消费</div>
    <line-chart :rec-data="recDataSample"></line-chart>
    <detail-record class="dr-component"></detail-record>
    <div id="jser-logo">
      <img id="jser-logo-img" src="../assets/jser_logo.svg" alt="Jser: The most powerful coding force in NEAU" title="Jser: The most powerful coding force in NEAU">
    </div>

    <x-dialog v-model="showLoginBox" hide-on-blur :dialog-style="dialogStyle">
      <div id="dialog-container">
        <group title="东农校内 - 更新数据">
          <x-input type="text" title="学号" disabled placeholder="你的学号" v-model="stuId" placeholder-align="center" text-align="center" :show-clear="false"></x-input>
          <x-input type="password" title="密码" placeholder="默认密码为身份证后六位" v-model="password" placeholder-align="center" text-align="center" :show-clear="false"></x-input>
          <x-input title="验证码" class="weui-cell_vcode" text-align="center" :show-clear="false" v-model="captcha">
            <div slot="right" class="captcha-container" @click="reloadCaptcha">
              <spinner type="lines" id="captcha-loading-icon" v-if="captchaLoadingIcon"></spinner>
              <img id="captcha" :src="captchaImg">
            </div>
          </x-input>
        </group>

        <box gap="10px 10px">
          <x-button :gradients="['#1D62F0', '#19D5FD']" type="primary" text="更 新" :disabled="submitBtnDisabled" :show-loading="submitBtnShowLoading" action-type="submit" class="btn" @click.native="submit"></x-button>
        </box>

        <toast v-model="stuIdWarn" type="cancel" position="top" text="学号信息错误" width="8rem"></toast>
        <toast v-model="pswWarn" type="cancel" position="top" text="请输入密码" width="8rem"></toast>
        <toast v-model="captchaWarn" type="cancel" position="top" text="请输入验证码" width="8rem"></toast>
      </div>
    </x-dialog>
  </div>
</template>

<script>
import InfoCard from '../components/InfoCard.vue'
import LineChart from '../components/LineChart.vue'
import DetailRecord from '../components/DetailRecord.vue'
import { XDialog, Group, XInput, XButton, Box, Popup, Toast, Spinner } from 'vux'
import axios from 'axios'

export default {
  props: {},
  components: {
    InfoCard,
    LineChart,
    DetailRecord,
    Popup,
    Group,
    XInput,
    XButton,
    Box,
    XDialog,
    Toast,
    Spinner
  },
  data () {
    return {
      stuId: 'A19150191',
      password: '131110',
      showStatus: true,
      balance: '32.58',
      updateTime: '今天18:00',

      showLoginBox: false,

      recDataSample: {
        date: ['07-09', '07-10', '07-11', '07-12', '07-13', '07-14', '07-15'],
        cost: [0.00, 0.00, 20.08, 10.68, 32.36, 0.00, 0.00]
      },

      dialogStyle: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '5px',
        paddingBottom: '0px'
      },

      captchaImg: '',
      captcha: '',
      stuIdWarn: false,
      pswWarn: false,
      captchaWarn: false,

      cookie: '',

      submitBtnShowLoading: false,
      submitBtnDisabled: false,

      captchaLoadingIcon: false
    }
  },
  methods: {
    async updateData () {
      this.captchaImg = ''
      this.showLoginBox = true
      this.captchaLoadingIcon = true
      const cookieData = await axios.get('/api/cookie')
      this.cookie = cookieData.data
      this.captchaLoading()
    },
    changeDisplayStatus (val) {
      this.showStatus = val
    },
    async submit () {
      this.submitBtnShowLoading = true
      this.submitBtnDisabled = true
      if (this.stuId && this.password && this.captcha) {
        const loginResult = await axios.get(`/api/login?cookie=${this.cookie}&username=${this.stuId}&password=${this.password}&chkCode=${this.captcha}`)
        if (loginResult.data.status === 'success') {
          this.submitBtnShowLoading = false
          this.submitBtnDisabled = false
          this.showLoginBox = false
          const basicInfo = await axios.get(`/api/basicInfo?cookie=${this.cookie}`)
          const dailyRecords = await axios.get(`/api/dailyRecords?cookie=${this.cookie}&accountId=${basicInfo.data.accountId}`)
          const records = await axios.get(`/api/records?cookie=${this.cookie}&accountId=${basicInfo.data.accountId}&startDate=20171101&endDate=20171201`)
          const totalRecords = [...(dailyRecords.data), ...(records.data)]
          console.log(basicInfo.data)
          console.log(totalRecords)
        } else {
          alert(loginResult.data.msg)
        }
      } else if (!this.stuId) {
        this.stuIdWarn = true
      } else if (!this.password) {
        this.pswWarn = true
      } else if (!this.captcha) {
        this.captchaWarn = true
      }
    },
    captchaLoading () {
      this.captchaLoadingIcon = true
      const img = new Image()
      img.src = `/api/captcha?cookie=${this.cookie}`
      img.onload = () => {
        this.captchaImg = img.src
        this.captchaLoadingIcon = false
      }
    },
    async reloadCaptcha () {
      this.captchaImg = ''
      this.captchaLoadingIcon = true
      const cookieData = await axios.get('/api/cookie')
      this.cookie = cookieData.data
      this.captchaLoading()
    }
  },
  watch: {},
  created: function () {
    setTimeout(() => {
      this.balance = '93.67'
    }, 5000)
  }
}
</script>

<style scoped>
/* Dev Style Sheet Start*/
* {
  font-family: 苹方;
}
/* Dev Style Sheet End*/

.main-container {
  padding: 12px 25px;
}

.section-label {
  font-size: 20px;
  font-weight: bold;
}

body {
  background-color: white;
}

.dr-component {
  margin-top: 7px;
}

#jser-logo {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  height: 80px;
}

#jser-logo-img {
  height: 40px; 
}

#dialog-container {
  text-align: left;
  width: 95%;
  background-color: #fff;
  border-radius: 5px;
}

.captcha-container {
  position: relative;
  height: 44px;
  width: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
}

#captcha {
  height: 24px;
}

#captcha-loading-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
