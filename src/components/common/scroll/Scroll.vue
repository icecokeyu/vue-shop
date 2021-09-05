<template>
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import Bscroll from 'better-scroll'
export default {
  name: 'Scroll',
  props: {
    probeType: {
      type: Number,
      default: 0
    },
    pullUpLoad: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      scroll: null
    }
  },
  mounted() {
    // 1.创建BScroll对象
    this.scroll = new Bscroll(this.$refs.wrapper, {
      click: true,
      probeType: this.probeType,
      pullUpLoad: this.pullUpLoad
    })
    // 2.监听滚动的位置
    if(this.probeType ===2 || this.probeType === 3) {
      this.scroll.on('scroll', (position) => {
      // console.log(position);
      // 通过自定义事件把position传递给Home.vue父组件
         this.$emit('scroll', position)
      })
    }
    // 3.完成监听上拉加载更多 监听scroll滚动到底部
    if(this.pullUpLoad) {
      this.scroll.on('pullingUp', () => {
      // console.log('上拉加载更多');
      // this.$emit发送事情的名称不能使用驼峰命名法
      this.$emit('sentup')
      })
    }
  },
  methods: {
    // 最好加上this.scroll  先看能不能拿到，逻辑更加严密
    scrollTo(x, y, time=300) {
      this.scroll && this.scroll.scrollTo(x, y, time)
    },
    finishPullUp() {
      this.scroll && this.scroll.finishPullUp()
    },
    refresh() {
      this.scroll && this.scroll.refresh()
    },
    getScrollY() {
      return this.scroll ? this.scroll.y : 0
    }
  }
}
</script>

<style>
</style>