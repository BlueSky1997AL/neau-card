<template>
  <div class="main-container">
    <info-card :stu-id="stuId" :balance="balance" :update-time="updateTime" :show-info="showStatus" @display-status-change="changeDisplayStatus" :update="updateData"></info-card>
  </div>
</template>

<script>
import InfoCard from '../components/InfoCard.vue'

export default {
  props: {},
  components: {
    InfoCard
  },
  data () {
    return {
      stuId: 'A19150191',
      showStatus: true,
      balance: '32.58',
      updateTime: '今天18:00'
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
      this.balance = '66.66'
    }, 5000)
  }
}
</script>
<style>
.main-container {
  padding: 12px 25px;
}
</style>
