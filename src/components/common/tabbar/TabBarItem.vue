<template>
  <div class="tab-bar-item" @click="itemClick">
    <!-- 为了保证插槽上的属性不被替换掉，最好在插槽外面再写div，属性写在div上 -->
    <div v-if="!isActive">
      <slot name="item-icon"></slot>
    </div>
    <div v-else>
      <slot name="item-icon-active"></slot>
    </div>
    <div :style="activeStyle">
      <slot name="item-text"></slot>
    </div>
    <!-- <img src="../../assets/img/tabbar/home.svg" alt="">
    <div>首页</div> -->
  </div>
</template>

<script>
export default {
  name: 'TabBarItem',
  props: {
    path: String,
    activeColor: {
      type: String,
      default: 'pink'
    }
  },
  // data() {
  //   return {
  //     isActive: true
  //   }
  // },
  computed: {
    isActive() {
      return this.$route.path == this.path;
      // return this.$route.path.indexOf(this.path) !== -1 
      // indexOf() 方法返回调用它的 String 对象中第一次出现的指定值的索引，从 fromIndex 处进行搜索。如果未找到该值，则返回 -1。
    },
    activeStyle() {
      return this.isActive ? {color: this.activeColor} : {};
    }
  },
  methods: {
    itemClick() {
      this.$router.push(this.path).catch(err => err);
    }
  }
}
</script>

<style>
  .tab-bar-item {
  flex: 1;
  text-align: center;
  height: 49px;
  font-size: 14px;
}

.tab-bar-item img {
  width: 24px;
  height: 24px;
  margin-top: 4px;
  margin-bottom: 2px;
  vertical-align: middle;
}
</style>