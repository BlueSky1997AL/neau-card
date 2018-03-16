<template>
  <div id="root">

    <div id="stu-info-card">
      <div id="stu-info-card-title-area">
        <span id="stu-info-card-title">四六级缴费信息</span>
        <div id="stu-info-card-btn-area">
          <spinner v-if="isUpdating" id="stu-card-loading-spinner" type="ios-small" size="17px"></spinner>
          <span v-if="isUpdating" id="stu-card-loading-msg">正在更新数据</span>
          <div id="login-btn" @click="login()">登录</div>
        </div>
      </div>
      <div id="info-area">
        <div class="stu-info-card-cell"><span>学号: </span><span>{{stuId}}</span></div>
        <div class="stu-info-card-cell"><span>姓名: </span><span>{{name}}</span></div>
        <div class="stu-info-card-cell"><span>班级: </span><span>{{className}}</span></div>
        <div class="stu-info-card-cell"><span>身份证号: </span><span>{{idNo}}</span></div>
        <div class="stu-info-card-cell"><span>语种: </span><span>{{lang}}</span></div>
        <div class="stu-info-card-cell"><span>级别: </span><span>{{category}}</span></div>
        <div class="stu-info-card-cell"><span>费用: </span><span>{{fee}}</span></div>
        <div class="stu-info-card-cell"><span>缴费状态: </span><span>{{status}}</span></div>
        <div v-if="canPay" id="payment-btn-container">
          <div id="payment-btn" @click="payForCET">缴费</div>
        </div>
      </div>
    </div>
    <div id="stu-info-card-shadow"></div>

    <div id="jser-logo">
      <img id="jser-logo-img" src="../assets/jser_logo.svg" alt="Jser: The most powerful coding force in NEAU" title="Jser: The most powerful coding force in NEAU">
    </div>

    <!-- <button @click="login">触发登陆</button>
    <button @click="payForCET">缴费</button> -->

    <toast v-model="isUpdatingWarn" type="cancel" text="正在更新信息" width="8rem"></toast>
    <loading :show="isPaying" text="正在缴费"></loading>
    <x-dialog v-model="showLoginBox" hide-on-blur :dialog-style="dialogStyle">
      <div id="dialog-container">
        <group title="四六级缴费 - 登录">
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
          <x-button :gradients="['#37ecba', '#72afd3']" type="primary" text="登 录" :disabled="submitBtnDisabled" :show-loading="submitBtnShowLoading" action-type="submit" class="btn" @click.native="submit"></x-button>
        </box>

        <toast v-model="loginFailureWarn" type="cancel" position="top" :text="loginFailureMsg" width="11.5rem"></toast>
        <toast v-model="stuIdWarn" type="cancel" position="top" text="学号信息错误" width="8rem"></toast>
        <toast v-model="pswWarn" type="cancel" position="top" text="请输入密码" width="8rem"></toast>
        <toast v-model="captchaWarn" type="cancel" position="top" text="请输入验证码" width="8rem"></toast>
      </div>
    </x-dialog>

  </div>
</template>

<script>
import { XDialog, Group, XInput, XButton, Box, Toast, Spinner, Confirm, Loading } from 'vux'
import axios from 'axios'

export default {

  name: 'CET',

  data () {
    return {
      stuId: '',
      password: '',

      showLoginBox: false,

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

      isUpdatingWarn: false,

      loginFailureWarn: false,
      loginFailureMsg: '',

      // 用户信息
      name: '不可用',
      className: '不可用',
      gender: '不可用',
      idNo: '不可用',
      lang: '不可用',
      category: '不可用',
      fee: '不可用',
      status: '不可用',

      linkId: '',
      isPaying: false
    }
  },

  components: {
    Group,
    XInput,
    XButton,
    Box,
    XDialog,
    Toast,
    Spinner,
    Confirm,
    Loading
  },

  methods: {
    async login () {
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

          let data = (await axios(`/api/cet?cookie=${this.cookie}`))

          data = data.data
          if (data.stuInfo) {
            const stuInfo = data.stuInfo
            this.stuId = stuInfo.stuId
            this.name = stuInfo.name
            this.className = stuInfo.class
            this.gender = stuInfo.gender
            this.idNo = stuInfo.idNo
            this.lang = stuInfo.lang
            this.category = stuInfo.category
            this.fee = stuInfo.fee
            this.status = stuInfo.status
          }

          if (data.linkId) {
            this.linkId = data.linkId
          }

          this.isUpdating = false
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
    async payForCET () {
      const _this = this
      this.$vux.confirm.show({
        title: '注意',
        content: `<ol type="1" style="text-align: justify; margin-left: 10px;"><li style="margin: 5px 0">我们是活跃于校园内的极客组织, 出于兴趣和便利同学的们的目的编写此工具, 如果您在使用本工具的过程中有任何疑问或意见, 欢迎联系我们, 提出您的宝贵意见。</li><li style="margin: 5px 0">本工具直接访问校园卡官网 <span style="font-weight: bold; text-decoration: underline;">http://card.neau.edu.cn/</span> 进行四六级缴费, 出现缴费失败及功能性错误请您重试或到校园卡官网进行四六级缴费, 东农校内不对您因为使用此工具造成的任何后果负责。</li><li style="margin: 5px 0">当您点击确认时表示您了解以上所有信息, 四六级费用会直接从您的校园卡中扣除。</li></ol>`,
        async onConfirm () {
          _this.isPaying = true
          const result = await axios.get(`/api/payForCET?cookie=${_this.cookie}&id=${_this.linkId}&passwd=${_this.password}`)
          _this.isPaying = false
          _this.$vux.alert.show({
            title: '缴费结果',
            content: result.data.msg
          })

          _this.isUpdating = true

          let data = (await axios(`/api/cet?cookie=${_this.cookie}`))

          data = data.data
          if (data.stuInfo) {
            const stuInfo = data.stuInfo
            _this.stuId = stuInfo.stuId
            _this.name = stuInfo.name
            _this.className = stuInfo.class
            _this.gender = stuInfo.gender
            _this.idNo = stuInfo.idNo
            _this.lang = stuInfo.lang
            _this.category = stuInfo.category
            _this.fee = stuInfo.fee
            _this.status = stuInfo.status
          }

          if (data.linkId) {
            _this.linkId = data.linkId
          }

          _this.isUpdating = false
        }
      })
    }
  },

  computed: {
    canPay () {
      if (this.status === '未缴费') {
        return true
      }
      return false
    }
  },

  mounted () {
    if (localStorage.basicInfo) {
      const basicInfo = JSON.parse(localStorage.basicInfo)
      this.stuId = basicInfo.stuId
      this.balance = parseFloat(basicInfo.balance) + ''
    }
    if (localStorage.psw) {
      this.password = localStorage.psw
    }
  }

}
</script>

<style scoped>

  #root {
    padding: 20px;
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

  #dialog-container {
    text-align: left;
    width: 95%;
    background-color: #fff;
    border-radius: 5px;
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

  #stu-info-card {
    padding: 15px;
    height: 530px;
    border-radius: 15px;
    background-image: linear-gradient(45deg, #37ecba, #72afd3);
    z-index: 99;
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }

  #stu-info-card-shadow {
    height: 550px;
    width: 85vw;
    border-radius: 15px;
    background-image: linear-gradient(45deg, #37ecba, #72afd3);
    filter: blur(10px);
    position: absolute;
    left: 50%;
    top: 40px;
    transform: translateX(-50%);
    z-index: -1;
    opacity: 0.5;
  }

  #stu-info-card-title {
    font-size: 1.5rem;
    font-weight: bold;
  }

  .stu-info-card-cell {
    padding-bottom: 12px;
    font-size: 1.2rem;
    margin: 10px 15px 10px;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid rgba(255, 255, 255, 0.431);
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

  #login-btn {
    font-size: 14px;
    background-color: rgba(255, 255, 255, 0.1);
    width: 43px;
    height: 20px;
    border-radius: 10px;
    border: 1px solid white;
    text-align: center;
    line-height: 20px;
    vertical-align: middle;
    align-self: center;
  }

  #payment-btn-container {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  #payment-btn {
    font-size: 20px;
    background-color: rgba(255, 255, 255, 0.1);
    width: 60px;
    height: 25px;
    border-radius: 12.5px;
    border: 1px solid white;
    text-align: center;
    line-height: 25px;
    vertical-align: middle;
    align-self: center;
  }

  #stu-info-card-title-area {
    display: flex;
    justify-content: space-between;
    align-content: center;
  }

  #stu-info-card-btn-area {
    display: flex;
  }

  #stu-card-loading-spinner {
    align-self: center;
    margin-right: 2px;
  }

  #stu-card-loading-msg {
    align-self: center;
    font-size: 12px;
    margin-right: 10px;
  }

  .vux-spinner-ios-small {
    stroke: #fff;
  }

</style>

