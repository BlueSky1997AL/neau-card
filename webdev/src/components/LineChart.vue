<template>
  <div id="line-chart-component">
    <div id="main" style="width: 100%; height: 117.5px;"></div>
  </div>
</template>

<script>
const eChartsModule = require('../script/echarts.modified.min.js')
// 节省流量及简化代码考虑，引入定制好的ECharts文件而非使用npm包

export default {
  name: 'line-chart',
  props: {
    'rec-data': {
      type: Object,
      default: function () {
        return {
          date: ['01-01', '01-02', '01-03', '01-04', '01-05', '01-06', '01-07'],
          cost: [12.34, 56.78, 12.34, 90.12, 34.56, 34.12, 12.34]
        }
      }
    }
  },
  data () {
    return {
      chart: '',
      isLoading: false
    }
  },
  watch: {
    recData: {
      // Needed to be optimized (params links)
      handler (newValue, oldValue) {
        this.chart.setOption({ xAxis: [ { data: newValue.date } ] })
        if (!this.isLoading) {
          this.chart.setOption({ series: [ { data: newValue.cost } ] })
        } else {
          setTimeout(() => {
            this.chart.setOption({ series: [ { data: newValue.cost } ] })
          }, 1000)
        }
      },
      deep: true
    }
  },
  mounted: function () {
    const chart = eChartsModule.echarts.init(document.getElementById('main'))
    this.chart = chart

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
        top: '20%',
        left: '0%',
        right: '0%',
        bottom: '20%'
      },
      xAxis: [
        {
          type: 'category',
          position: 'bottom',
          offset: 5,
          boundaryGap: true,
          data: this.recData.date,
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: {
            color: '#AAA',
            fontSize: 10
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
              position: 'top',
              fontSize: 10
            }
          }
        }
      ],
      animationDurationUpdate: 1000,
      animationDuration: 1000
    }

    chart.setOption(option)

    this.isLoading = true
    setTimeout(() => {
      chart.setOption({series: [ { data: this.recData.cost } ]})
      this.isLoading = false
    }, 1000)
  }
}
</script>
