<template>
  <div class="main-container">
    <info-card stuId="A19150191" balance="38.92" updateTime="今天18:00" :showInfo="showStatus"></info-card>
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

  },
  watch: {},
  created: function () {

  }
}
</script>
<style>
.main-container {
  padding: 0 25px;
}
</style>
