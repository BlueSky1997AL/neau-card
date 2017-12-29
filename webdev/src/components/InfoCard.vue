<template>
  <div id="info-card-component">
    <div id="main-container">
      <span id="stuid-label">东北农业大学学生卡 {{stuId}}</span>
      <img src="../assets/neau_logo.svg" alt="neau_logo" id="logo">
      <div id="balance-container">
        <span id="balance">余额：{{displayedBalance}}</span>
        <div id="show-balance-btn" v-html="showBtn" @click="toggleDisplay()"></div>
      </div>
      <div id="update">
        <spinner v-if="isUpdating" type="ios-small" size="17px"></spinner>
        <span id="update-time">更新时间：{{updateTime}}</span>
        <div id="update-btn-container" @click="update()">
          <span id="update-btn-text">更新</span>
        </div>
      </div>
    </div>
    <div id="main-container-shadow"></div>
  </div>
</template>

<script>
import { Spinner } from 'vux'

const showImg = '<svg class="svg-btn" xmlns="http://www.w3.org/2000/svg" viewBox="2212 3190 50 30"><defs><style>.a{fill:#fff;opacity:0.5;}</style></defs><path class="a" d="M-967-3014a28.8,28.8,0,0,1-25-15,28.8,28.8,0,0,1,25-15,28.8,28.8,0,0,1,25,15A28.8,28.8,0,0,1-967-3014Zm0-23a8.009,8.009,0,0,0-8,8,8.009,8.009,0,0,0,8,8,8.008,8.008,0,0,0,8-8A8.009,8.009,0,0,0-967-3037Z" transform="translate(3204 6234)"/></svg>'
const hideImg = '<svg class="svg-btn" xmlns="http://www.w3.org/2000/svg" viewBox="1488 3190 50 30"><defs><style>.a{fill:#fff;opacity:0.5;}</style></defs><path class="a" d="M-967-3014a28.8,28.8,0,0,1-25-15,28.8,28.8,0,0,1,25-15,28.8,28.8,0,0,1,25,15A28.8,28.8,0,0,1-967-3014Zm0-12.171h0l5.656,5.656,2.829-2.828-5.657-5.657,5.657-5.656-2.829-2.829-5.656,5.657-5.657-5.657-2.829,2.829,5.657,5.656-5.657,5.657,2.829,2.828Z" transform="translate(2480 6234)"/></svg>'

export default {
  name: 'info-card',
  props: {
    'stu-id': {
      type: String,
      default: 'N/A'
    },
    balance: {
      type: String,
      default: '00.00'
    },
    'update-time': {
      type: String,
      default: 'N/A'
    },
    'show-info': {
      type: Boolean,
      default: true
    },
    'is-updating': {
      type: Boolean,
      default: false
    },
    update: {
      type: Function,
      default: function () {
        alert('Balance card dev info.')
      }
    }
  },
  components: { Spinner },
  data () {
    return {
      displayedBalance: '',
      displayStatus: true
    }
  },
  methods: {
    toggleDisplay () {
      if (this.displayStatus) {
        this.displayStatus = false
        this.displayedBalance = '*****'
        this.showBtn = showImg
      } else {
        this.displayStatus = true
        this.displayedBalance = this.balance
        this.showBtn = hideImg
      }
    },
    refreshInfo () {
      if (this.displayStatus) {
        this.displayedBalance = this.balance
        this.showBtn = hideImg
      } else {
        this.displayedBalance = '*****'
        this.showBtn = showImg
      }
    }
  },
  watch: {
    balance: function () {
      if (this.displayedBalance === '*****') {
        return
      } else {
        this.displayedBalance = this.balance
      }
    },
    showInfo: function () {
      this.displayStatus = this.showInfo
    },
    displayStatus: function (val) {
      this.refreshInfo()
      this.$emit('display-status-change', val)
    }
  },
  computed: {},
  created: function () {
    this.refreshInfo()
  }
}
</script>
<style scoped>
  #info-card-component {
    position: relative;
    width: 100%;
    height: 170px;
  }

  #main-container {
    height: 150px;
    width: 100%;
    border-radius: 15px;
    background-image: linear-gradient(45deg, #14E7FF, #5107FF 30%, #06DAFC);
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1;
    color: white;
  }

  #main-container-shadow {
    height: 150px;
    width: 93.8%;
    border-radius: 15px;
    background-image: linear-gradient(45deg, #14E7FF, #5107FF 30%, #06DAFC);
    filter: blur(10px);
    position: absolute;
    left: 50%;
    top: 5.3rem;
    transform: translate(-50%, -50%);
    z-index: 0;
    opacity: 0.5;
  }

  #logo {
    position: absolute;
    right: 10px;
    top: 10px;
    width: 40px;
    height: 40px;
  }

  #stuid-label {
    font-size: 12px;
    position: absolute;
    top: 10px;
    left: 15px;
  }

  #balance-container {
    display: flex;
    align-items: center;
    position: absolute;
    top: 47.5px;
    left: 15px;
  }

  #balance {
    font-size: 30px;
  }

  #show-balance-btn {
    width: 25px;
    height: 15px;
    margin-left: 10px;
  }

  .svg-btn {
    vertical-align: top;
  }

  #update {
    font-size: 12px;
    position: absolute;
    right: 10px;
    bottom: 10px;
    display: inline-block;
  }

  #update-btn-container {
    display: inline-block;
    background-color: rgba(255, 255, 255, 0.1);
    width: 40px;
    height: 16.5px;
    border-radius: 9.5px;
    border: 1px solid white;
    text-align: center;
    line-height: 16.5px;
    margin-left: 5px;
    
  }

  /* 将 style 标签设置为 scoped 属性时，可以将 css 样式限定于当前组件的作用域，这样还可以对所需要调用的vux组件样式进行修改 */
  .vux-spinner-ios-small {
    stroke: #fff;
  }
</style>
