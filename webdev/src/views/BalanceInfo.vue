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
          <x-input type="text" required title="学号" placeholder="你的学号" v-model="stuId" placeholder-align="center" text-align="center" :show-clear="false"></x-input>
          <x-input type="password" required title="密码" placeholder="默认密码为身份证后六位" v-model="password" placeholder-align="center" text-align="center" :show-clear="false"></x-input>
          <x-input title="验证码" class="weui-cell_vcode" text-align="center" :show-clear="false" required>
            <img slot="right" class="weui-vcode-img" src="https://i.loli.net/2017/09/18/59bf7f32425d5.jpg">
          </x-input>
        </group>

        <box gap="10px 10px">
          <x-button :gradients="['#1D62F0', '#19D5FD']" type="primary" text="更 新" :disabled="false" :show-loading="false" action-type="submit" class="btn" @click.native="submit"></x-button>
        </box>
      </div>
    </x-dialog>
  </div>
</template>

<script>
import InfoCard from '../components/InfoCard.vue'
import LineChart from '../components/LineChart.vue'
import DetailRecord from '../components/DetailRecord.vue'
import { XDialog, Group, XInput, XButton, Box, Popup } from 'vux'

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
    XDialog
  },
  data () {
    return {
      stuId: 'A19150191',
      password: 'A19150191',
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
      }
    }
  },
  methods: {
    updateData () {
      this.showLoginBox = true
    },
    changeDisplayStatus (val) {
      this.showStatus = val
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

<style>
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
</style>
