<template>
  <div class="main-container">
    <info-card :stu-id="stuId" :balance="balance" :update-time="updateTime" :show-info="showStatus" @display-status-change="changeDisplayStatus" :update="updateData"></info-card>
    <div class="section-label">最近七天消费</div>
    <line-chart :rec-data="recDataSample"></line-chart>
  </div>
</template>

<script>
import InfoCard from '../components/InfoCard.vue'
import LineChart from '../components/LineChart.vue'

export default {
  props: {},
  components: {
    InfoCard,
    LineChart
  },
  data () {
    return {
      stuId: 'A19150191',
      showStatus: true,
      balance: '32.58',
      updateTime: '今天18:00',

      recDataSample: {
        date: ['07-09', '07-10', '07-11', '07-12', '07-13', '07-14', '07-15'],
        cost: [0.00, 0.00, 20.08, 10.68, 32.36, 0.00, 0.00]
      }
    }
  },
  methods: {
    updateData () {
      alert('hello world')
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
}
</style>
