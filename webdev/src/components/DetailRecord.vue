<template>
  <div id="detail-record-component">
    <div class="dr-cells dr-label">
      <span id="dr-label-title-text">一月内消费账目</span>
      <span id="dr-label-total-text">共计消费：{{totalAmount}}元</span>
    </div>
    <div v-for="item in records" :key="item.id" class="dr-cells">
      <div class="dr-detail-left-content"><span class="dr-detail-seller">{{item.seller}}</span><span class="dr-detail-date">{{normalizedDate(item.date)}}</span></div>
      <span class="dr-detail-right-amount"><span class="dr-detail-right-amount-positive" v-if="item.amount > 0">+</span><span :class="(item.amount < 0) ? 'dr-detail-right-amount' : 'dr-detail-right-amount-positive'">{{item.amount}}</span> 元</span>
    </div>
  </div>
</template>

<script>
export default {

  name: 'detail-record',

  props: {
    records: {
      type: Array,
      default: function () {
        return [
          {
            id: 0,
            seller: '北区一食堂',
            date: '2017-07-01 7:35',
            amount: -10.50
          },
          {
            id: 1,
            seller: '北区二食堂',
            date: '2017-07-01 11:20',
            amount: -2.10
          },
          {
            id: 2,
            seller: '支付宝充值',
            date: '2017-07-01 18:24',
            amount: +10.50
          }
        ]
      }
    }
  },

  computed: {
    totalAmount () {
      try {
        let sum = 0
        this.records.forEach((e) => {
          sum -= e.amount
        })
        return sum.toFixed(2)
      } catch (error) {
        return 'N/A'
      }
    }
  },

  methods: {
    formatDate (date, format) {
      var o = {
        'M+': date.getMonth() + 1,                     // 月份
        'd+': date.getDate(),                          // 日
        'h+': date.getHours(),                         // 小时
        'm+': date.getMinutes(),                       // 分
        's+': date.getSeconds(),                       // 秒
        'q+': Math.floor((date.getMonth() + 3) / 3),   // 季度
        'S': date.getMilliseconds()                    // 毫秒
      }
      if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
      }
      for (var k in o) {
        if (new RegExp('(' + k + ')').test(format)) {
          format = format.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
        }
      }
      return format
    },
    normalizedDate (date) {
      const dateObj = new Date(date)
      return this.formatDate(dateObj, 'yyyy/MM/dd hh:mm:ss')
    }
  }

}
</script>

<style scoped>
.dr-cells {
  height: 67px;
  border-bottom: 1px solid #DCDCDC;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dr-label {
  height: 52px;
}

#dr-label-title-text {
  font-size: 20px;
  font-weight: bold;
}

#dr-label-total-text {
  font-size: 12px;
  color: #AAAAAA;
}

.dr-detail-left-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.dr-detail-seller {
  color: #707070;
  font-size: 15px;
}

.dr-detail-date {
  color: #AAAAAA;
  font-size: 12px;
}

.dr-detail-right-amount {
  font-size: 15px;
  color: #95989A;
  font-weight: bold;
}

.dr-detail-right-amount-positive {
  color: #0097FF;
}
</style>

