<template>
  <div id="component">
    <div id="main" style="width: 375px;height: 170px;"></div>
  </div>
</template>

<script>
const eChartsModule = require('../script/echarts.modified.min.js')
// 节省流量及简化代码考虑，引入定制好的ECharts文件而非使用npm包

export default {
  name: 'line-chart',
  props: {
    'rec-data': {
      type: Array,
      default: function () {
        return [
          {
            date: '01-01',
            cost: 13.62
          },
          {
            date: '01-02',
            cost: 16.25
          },
          {
            date: '01-03',
            cost: 23.50
          },
          {
            date: '01-04',
            cost: 7.50
          },
          {
            date: '01-05',
            cost: 30.21
          },
          {
            date: '01-06',
            cost: 5.68
          },
          {
            date: '01-07',
            cost: 17.21
          }
        ]
      }
    },
    hello: {
      type: String,
      default: 'world'
    }
  },
  data () {
    return {}
  },
  methods: {
    generateDataArr (arr) {
    // this 指针指向不正确，不可使用this指针，改用参数传递
      return {
        date () {
          const tmpArr = []
          arr.forEach((v) => {
            tmpArr.push(v.date)
          })
          return tmpArr
        },
        cost () {
          const tmpArr = []
          arr.forEach((v) => {
            tmpArr.push(v.cost)
          })
          return tmpArr
        }
      }
    }
  },
  watch: {},
  computed: {},
  mounted: function () {
    const chart = eChartsModule.echarts.init(document.getElementById('main'))

    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'line',
          lineStyle: {
            color: '#0097ff'
          }
        }
      },
      grid: {
        top: '8.25%',
        left: '3%',
        right: '3%',
        bottom: '20%'
      },
      xAxis: [
        {
          type: 'category',
          position: 'bottom',
          offset: 15,
          boundaryGap: true,
          data: this.generateDataArr(this.recData).date(),
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: {
            color: '#AAA'
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          show: false
        }
      ],
      series: [
        {
          name: '当日消费金额',
          type: 'line',
          stack: '总量',
          smooth: true,
          itemStyle: {
            normal: {
              color: '#0097ff',
              borderWidth: 4
            }
          },
          lineStyle: {
            normal: {
              type: 'solid',
              color: '#0097FF'
            }
          },
          animationEasing: 'quarticOut',
          animationEasingUpdate: 'quarticOut',
          areaStyle: {
            normal: {
              color: '#0097FF',
              opacity: 0.3
            }
          },
          data: [0, 0, 0, 0, 0, 0, 0],
          label: {
            normal: {
              show: true,
              color: '#0097FF',
              position: 'top'
            }
          }
        }
      ],
      animationDurationUpdate: 1000,
      animationDuration: 1000
    }

    chart.setOption(option)

    setTimeout(() => {
      option.series[0].data = this.generateDataArr(this.recData).cost()
      chart.setOption(option)
    }, 400)
  }
}
</script>
<style>
</style>
