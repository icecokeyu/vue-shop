<template>
  <div class="goods-list">
    <goods-list-item v-for="(item, index) in goods"
    :key="index" :goodsItem="item"/>
  </div>
</template>

<script>
import GoodsListItem from './GoodsListItem.vue'
export default {
  components: { GoodsListItem },
  name: 'GoodsList',
  props: {
    goods: {
      type: Array,
      dafault() {
        return []
      }
    }
  }
}
</script>

<style>
  .goods-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    padding: 2px;
  }
</style>