<template>
  <div id="component-root">
    <div class="main-container">
      <info-card :stu-id="stuId" :balance="balance" :update-time="updateTime" :show-info="showStatus" @display-status-change="changeDisplayStatus" :update="updateData" :is-updating="isUpdating" :transBalance="transBalance"></info-card>

      <div id="cet-card" @click="goToCETPage" v-if="false">
        <span id="cet-card-title">四六级缴费</span>
        <span id="cet-card-detail">点击查看详情</span>
      </div>
      <div id="cet-card-shadow" v-if="false"></div>

      <div class="section-label">最近七天消费</div>
      <line-chart :rec-data="recData"></line-chart>
      <detail-record class="dr-component" :records="records"></detail-record>
      <div id="jser-logo">
        <img id="jser-logo-img" src="../assets/jser_logo.svg" alt="Jser: The most powerful coding force in NEAU" title="Jser: The most powerful coding force in NEAU">
      </div>

      <toast v-model="isUpdatingWarn" type="cancel" text="正在更新信息" width="8rem"></toast>
      <x-dialog v-model="showLoginBox" hide-on-blur :dialog-style="dialogStyle">
        <div id="dialog-container">
          <group title="东农校内 - 更新数据">
            <x-input type="text" title="学号" :disabled="false" placeholder="你的学号" v-model="stuId" placeholder-align="center" text-align="center" :show-clear="false"></x-input>
            <x-input type="password" title="密码" placeholder="默认密码为身份证后六位" v-model="password" placeholder-align="center" text-align="center"></x-input>
            <x-input title="验证码" class="weui-cell_vcode" text-align="center" :show-clear="false" v-model="captcha">
              <div slot="right" class="captcha-container" @click="reloadCaptcha">
                <spinner type="lines" id="captcha-loading-icon" v-if="captchaIsLoading"></spinner>
                <img id="captcha" :src="captchaImg" v-show="!captchaIsLoading">
              </div>
            </x-input>
          </group>

          <box gap="10px 10px">
            <x-button :gradients="['#1D62F0', '#19D5FD']" type="primary" text="更 新" :disabled="submitBtnDisabled" :show-loading="submitBtnShowLoading" action-type="submit" class="btn" @click.native="submit"></x-button>
          </box>

          <toast v-model="loginFailureWarn" type="cancel" position="top" :text="loginFailureMsg" width="11.5rem"></toast>
          <toast v-model="stuIdWarn" type="cancel" position="top" text="学号信息错误" width="8rem"></toast>
          <toast v-model="pswWarn" type="cancel" position="top" text="请输入密码" width="8rem"></toast>
          <toast v-model="captchaWarn" type="cancel" position="top" text="请输入验证码" width="8rem"></toast>
        </div>
      </x-dialog>
    </div>
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
      stuId: '',
      password: '',
      showStatus: true,
      balance: 'N/A',
      updateTime: 'N/A',
      transBalance: '0.00元',

      showLoginBox: false,

      recData: {
        date: [],
        cost: [0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00]
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

      captchaIsLoading: false,

      isUpdating: false,

      records: [],

      isUpdatingWarn: false,

      loginFailureWarn: false,
      loginFailureMsg: ''
    }
  },
  methods: {
    async updateData () {
      if (this.isUpdating) {
        this.isUpdatingWarn = true
      } else {
        this.captchaImg = ''
        this.showLoginBox = true
        this.captchaIsLoading = true
        const cookieData = await axios.get('/api/cookie')
        this.cookie = cookieData.data
        this.captchaLoading()
      }
    },
    changeDisplayStatus (val) {
      this.showStatus = val
    },
    async submit () {
      if (this.stuId && this.password && this.captcha) {
        this.submitBtnShowLoading = true
        this.submitBtnDisabled = true
        const loginResult = await axios.get(`/api/login?cookie=${this.cookie}&username=${this.stuId}&password=${this.password}&chkCode=${this.captcha}`)
        if (loginResult.data.status === 'success') {
          this.captcha = ''
          this.isUpdating = true
          this.submitBtnShowLoading = false
          this.submitBtnDisabled = false
          this.showLoginBox = false

          localStorage.psw = this.password

          const basicInfo = await axios.get(`/api/basicInfo?cookie=${this.cookie}`)

          localStorage.basicInfo = JSON.stringify(basicInfo.data)

          this.balance = parseFloat(basicInfo.data.balance) + ''
          this.transBalance = basicInfo.data.transBalance

          // if (localStorage.records) {
          //   // dev code block
          // } else {
          const dailyRecords = await axios.get(`/api/dailyRecords?cookie=${this.cookie}&accountId=${basicInfo.data.accountId}`)

          const nowDate = new Date()
          const endDateObj = new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate() - 1)
          const endDate = `${endDateObj.getFullYear()}${endDateObj.getMonth() < 9 ? '0' + (endDateObj.getMonth() + 1) : endDateObj.getMonth() + 1}${endDateObj.getDate() < 9 ? '0' + endDateObj.getDate() : endDateObj.getDate()}`
          const startDateObj = new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate() - 32)
          const startDate = `${startDateObj.getFullYear()}${startDateObj.getMonth() < 9 ? '0' + (startDateObj.getMonth() + 1) : startDateObj.getMonth() + 1}${startDateObj.getDate() < 9 ? '0' + startDateObj.getDate() : startDateObj.getDate()}`

          const records = await axios.get(`/api/records?cookie=${this.cookie}&accountId=${basicInfo.data.accountId}&startDate=${startDate}&endDate=${endDate}`)

          const totalRecords = [...(dailyRecords.data), ...(records.data.records)]

          // sort
          totalRecords.sort(function (rec1, rec2) {
            const rec1Date = new Date(rec1.tradeDate)
            const rec2Date = new Date(rec2.tradeDate)
            if (rec1Date - rec2Date > 0) return -1
            if (rec1Date - rec2Date < 0) return 1
            else return 0
          })

          this.recData.cost = [0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00]
          this.records = []
          totalRecords.forEach((v, i) => {
            this.records.push({
              id: i,
              seller: v.firmName,
              date: v.tradeDate,
              amount: parseFloat(v.cost)
            })
            const date = new Date(v.tradeDate)
            const recordMonth = date.getMonth()
            const recordDate = date.getDate()
            const dateStr = `${recordMonth < 9 ? '0' + (recordMonth + 1) : recordMonth + 1}-${recordDate < 10 ? '0' + recordDate : recordDate}`
            const index = this.recData.date.indexOf(dateStr)
            if (index !== -1) {
              this.recData.cost[index] += Math.abs(parseFloat(v.cost))
            }
          })

          localStorage.records = JSON.stringify(totalRecords)

          this.recData.cost.forEach((v, i) => {
            this.recData.cost[i] = v.toFixed(2)
          })
          this.isUpdating = false
          this.recData.cost = Object.assign([], this.recData.cost)

          const updateAt = new Date()
          const updateHours = updateAt.getHours()
          const updateMinutes = updateAt.getMinutes()
          this.updateTime = `今天${updateHours}:${updateMinutes < 10 ? '0' + updateMinutes : updateMinutes}`

          localStorage.updateAt = updateAt.toISOString()
          // }
        } else {
          this.reloadCaptcha()
          this.captcha = ''
          this.submitBtnShowLoading = false
          this.submitBtnDisabled = false
          this.loginFailureWarn = true
          this.loginFailureMsg = loginResult.data.msg
        }
      } else if (!this.stuId) {
        this.stuIdWarn = true
      } else if (!this.password) {
        this.pswWarn = true
      } else if (!this.captcha) {
        this.captchaWarn = true
      }
    },
    renderLineChart () {

    },
    captchaLoading () {
      this.captchaIsLoading = true
      const img = new Image()
      img.src = `/api/captcha?cookie=${this.cookie}`
      img.onload = () => {
        this.captchaImg = img.src
        this.captchaIsLoading = false
      }
    },
    async reloadCaptcha () {
      this.captchaImg = ''
      this.captchaIsLoading = true
      const cookieData = await axios.get('/api/cookie')
      this.cookie = cookieData.data
      this.captchaLoading()
    },
    generateDateArray () {
      const now = new Date()

      const nowDate = now.getDate()
      const nowMonth = now.getMonth()
      const nowYear = now.getFullYear()

      let calc = new Date(nowYear, nowMonth, nowDate - 6)

      const dateArr = []
      this.dateObjArr = []

      for (let i = 0; i < 7; i++) {
        this.dateObjArr.push(new Date(nowYear, nowMonth, nowDate - 6 + i))
        const calcMonth = calc.getMonth()
        const calcDate = calc.getDate()
        dateArr.push(`${calcMonth < 9 ? '0' + (calcMonth + 1) : calcMonth + 1}-${calcDate < 10 ? '0' + calcDate : calcDate}`)
        calc = new Date(nowYear, nowMonth, nowDate - 5 + i)
      }

      this.recData.date = Object.assign([], dateArr)
    },

    async getUsrInfo (token) {
      const usrInfo = await axios.get(`/api/usrInfo?token=${token}`)

      this.stuId = usrInfo.data.stuId
      const IDCardNo = usrInfo.data.IDCardNo
      let psw
      if (IDCardNo.substr(-1) === 'x' || IDCardNo.substr(-1) === 'X') {
        psw = IDCardNo.substr(-7, 6)
      } else {
        psw = IDCardNo.substr(-6)
      }
      this.password = psw
    },

    async goToCETPage () {
      this.$router.push('/CET')
    }
  },
  watch: {
    showStatus () {
      localStorage.showStatus = this.showStatus
    }
  },
  mounted () {
    if (this.$route.query.accountToken) {
      this.getUsrInfo(this.$route.query.accountToken)
    }

    this.generateDateArray()
    if (localStorage.showStatus) {
      if (localStorage.showStatus === 'false') {
        this.showStatus = false
      }
    }
    if (localStorage.basicInfo) {
      const basicInfo = JSON.parse(localStorage.basicInfo)
      this.stuId = basicInfo.stuId
      this.balance = parseFloat(basicInfo.balance) + ''
      this.transBalance = basicInfo.transBalance
    }
    if (localStorage.psw) {
      this.password = localStorage.psw
    }
    if (localStorage.updateAt) {
      const updateAt = new Date(localStorage.updateAt)
      const updateDate = new Date(updateAt.getFullYear(), updateAt.getMonth(), updateAt.getDate())
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1)
      const theDayBeforeYesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2)
      if (today - updateDate === 0) {
        const hours = updateAt.getHours()
        const minutes = updateAt.getMinutes()
        this.updateTime = `今天${hours}:${minutes < 10 ? '0' + minutes : minutes}`
      } else if (yesterday - updateDate === 0) {
        const hours = updateAt.getHours()
        const minutes = updateAt.getMinutes()
        this.updateTime = `昨天${hours}:${minutes < 10 ? '0' + minutes : minutes}`
      } else if (theDayBeforeYesterday - updateDate === 0) {
        const hours = updateAt.getHours()
        const minutes = updateAt.getMinutes()
        this.updateTime = `前天${hours}:${minutes < 10 ? '0' + minutes : minutes}`
      } else {
        const hours = updateAt.getHours()
        const minutes = updateAt.getMinutes()
        this.updateTime = `${updateAt.getFullYear()}/${updateAt.getMonth() + 1}/${updateAt.getDate()} ${hours}:${minutes < 10 ? '0' + minutes : minutes}`
      }
    }
    if (localStorage.records) {
      const records = JSON.parse(localStorage.records)
      records.forEach((v, i) => {
        this.records.push({
          id: i,
          seller: v.firmName,
          date: v.tradeDate,
          amount: parseFloat(v.cost)
        })
        const date = new Date(v.tradeDate)
        const recordMonth = date.getMonth()
        const recordDate = date.getDate()
        const dateStr = `${recordMonth < 9 ? '0' + (recordMonth + 1) : recordMonth + 1}-${recordDate < 10 ? '0' + recordDate : recordDate}`
        const index = this.recData.date.indexOf(dateStr)
        if (index !== -1) {
          this.recData.cost[index] += Math.abs(parseFloat(v.cost))
        }
      })
      this.recData.cost.forEach((v, i) => {
        this.recData.cost[i] = v.toFixed(2)
      })
    }
    if (!localStorage.basicInfo) {
      setTimeout(() => {
        this.updateData()
      }, 1000)
    }
  }
}
</script>

<style scoped>

* {
  user-select: none;
}

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

#cet-card {
  padding: 0 15px;
  height: 70px;
  margin: 12px 0px 20px;
  border-radius: 15px;
  background-image: linear-gradient(45deg, #fa709a, #fee140);
  z-index: 99;
  color: white;
  display: flex;
  justify-content: space-between;
}

#cet-card-shadow {
  height: 70px;
  width: 83%;
  border-radius: 15px;
  background-image: linear-gradient(45deg, #fa709a, #fee140);
  filter: blur(10px);
  position: absolute;
  left: 50%;
  top: 240px;
  transform: translate(-50%, -50%);
  z-index: -1;
  opacity: 0.5;
}

#cet-card-title {
  font-size: 22px;
  align-self: center;
}

#cet-card-detail {
  font-size: 14px;
  align-self: center;
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
