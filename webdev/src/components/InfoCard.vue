<template>
  <div id="component">
    <div id="main-container">
      <span id="stuid-label">东北农业大学学生卡 {{stuId}}</span>
      <img src="../assets/neau_logo.png" alt="neau_logo" id="logo">
      <div id="balance-container">
        <span id="balance">余额：{{displayedBalance}}</span>
        <img id="show-balance-btn" :src="showBtn" @click="toggleDisplay()"></img>
      </div>
      <div id="update">
        <span id="update-time">更新时间：{{updateTime}}</span>
        <div id="update-btn" @click="update()">更新</div>
      </div>
    </div>
    <div id="main-container-shadow"></div>
  </div>
</template>

<script>
const showImg = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAeCAYAAABuUU38AAAABHNCSVQICAgIfAhkiAAAAipJREFUWIXdmK9XAkEQxz9z6SJNTBKJmjyT2rARjUSjf4rRaDTSpIlJTBKNmjwb8doYboBDgdvbPeTh9z3eu3fszO735ueOUBNUtQnsAftA0143gdieMyC15xT4BL5EJKUGSIiwqraAQ6DN/MBVkQFvwFhE3n3PUpmIqsbAMXAENHw3XoEJ8Aq8iEhWRdCZSIHACf5f3xUZ8CwiT64CTkTMhbrUb4EyTIC+i8uVElHVU+C8jlMF4LHMOiuJmCv1mGegbSMF7lbFzlIilkq7+JOYACPgfZpeTWcLSPB30RS4F5HJzz9+EbENe/gH9EBERusWqGoCdDz1Z+SWWag/C0TMna7xJ3HrWuDsg1157pMBN0U3iwqKpzERYgnnKm1rB557xUDPzgwUiBAYE2XutAwm88vfHTGNY8CImM+2PRVCHtjbkG2r6iFAZOY5C1AG4N0jBcoCdFQ1jsjNE9RyhHSwNXS/MdCNSpftCCKgT57OvGGp9M9lDRnQjywXDwOVtbYkC3nazyKYpcG3AGXJlmTHIjKGxTrSZ34VrYqGpfBKMJmQvmtWUGdEzMXu8I+XThV/V9U24f3W7KybaBofRORl3QJVPQYuPPWXN42FjRrAJWFt/DPw8aONPyC/Km++jZ/iX1ysilDVM8JbmFAMRWRtidiF4cO9SxtTaa5l1kn4m3HQsMrVwHdAl5BPGDcxoBsDo40N6JZhp0emq2DptfiD9UPsFEjrGmJ/AxF43zo0geHTAAAAAElFTkSuQmCC'
const hideImg = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAeCAYAAABuUU38AAAABHNCSVQICAgIfAhkiAAAAlJJREFUWIXdmK+T2kAUxz8vCllX6pCVVJWq3rmTyJP3pyGRkedKVe9UI5G45hwy7lXkJSTHJuxuls7QzwwzkGw2++X92n1CIlR1DnwEPgFzuzwHZva9Akr7XgJ/gDcRKUmATHlYVRfAEvjMacGhVMAeKETkELuWYCGqOgO+Al+AD7EvHuAI/AZeRaQKedBbSEfAN+L/fV8q4JeI/PR9wEuIudCa9Ba4xBHIfVzuohBV/Q7cp1jVBH5css6gEHOlJ04ZyIcDsLjCWKgz3WYodjLXRUuloSJyEdkAhcfYwsbmAfPPgSdVdbr3mUU6IkICOheRVoCqrqnTsotCRPLO2CV1/PlSUVumV396Fum4U4iIQ1cEgC3UZZmeCBtbULuZLzNqy/TW2AqJFAGwMAv0cIg5E2HvXRMWK+AQ07qWqj5SV+hYxhbKyL0hF/RhLyJbMCGqugIeJkzY4BTjIoGIhlxEiszMc5dgQoCly83ek1AEwIOqziSBS7kYtExiEQ17Zx25RTLqohS007zAaJyMpOZYKiDPrOTvEk3qFeyJxTyLSJXZxC/Uh5spDKZfzzoT+84C+pU953QUjZlwrE44s9lEMSXw3PxohZiLbQiPl4NnsRsTE3rEbfZb7Vp7WStSzMI2fi0jKfZMjD0bskU5EwED5xHbKj8Svo0vPOtEISJ5xM63BLYicnx/4785WPkcde9It4WJZScioyXiFpoPW58mXlBfy6yz4t+0g3ZW37yIbdCtqAP6Gg26Ani5WoPOxU23TIewpkX3A+NN7BIoUzWx/wKYaiFaWyD52wAAAABJRU5ErkJggg=='

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
    update: {
      type: Function,
      default: function () {
        alert('Balance card dev info.')
      }
    }
  },
  components: {},
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
<style>
  /* Dev Style Sheet */
  * {
    font-family: 苹方;
  }

  #component {
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

  #update {
    font-size: 12px;
    position: absolute;
    right: 10px;
    bottom: 10px;
    display: inline-block;
  }

  #update-btn {
    display: inline-block;
    width: 40px;
    height: 16.5px;
    border-radius: 9.5px;
    border: 1px solid white;
    text-align: center;
    line-height: 16.5px;
    margin-left: 5px;
  }
</style>
