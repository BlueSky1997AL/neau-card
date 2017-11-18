<template>
  <div class="main-container">
    <info-card stu-id="A19150191" balance="38.92" update-time="今天18:00" :show-info="showStatus" :update="updateData"></info-card>
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
      showStatus: true
    }
  },
  methods: {
    updateData () {
      alert('hello world')
    }
  },
  watch: {},
  created: function () {

  }
}
</script>
<style>
.main-container {
  padding: 12px 25px;
}
</style>
