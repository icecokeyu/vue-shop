<template>
  <div class="bottom-bar">
    <div class="check-content">
      <check-button 
      class="check-btn" 
      :is-checked="isSelectAll"
      @click.native="checkClick"
      />
      <span>全选</span>
    </div>
    <div class="price">合计：{{totalPrice}}</div>
    <div class="caculate">去计算({{toCount}})</div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import CheckButton from 'components/content/checkButton/CheckButton.vue'
export default {
  name: 'CartBottomBar',
  components: { CheckButton },
  computed: {
    ...mapGetters(['cartList']),
    totalPrice() {
      return this.cartList.filter(item =>{
        return item.checked
      }).reduce((preValue, item) => {
        return preValue += item.price * item.count
      }, 0)
    },
    toCount() {
      return this.cartList.filter(item => {return item.checked}).length
    },
    isSelectAll() {
      // 方法一 使用filter
      // if(this.cartList.length === 0) {
      //   return false
      // } else {
      //   return !(this.cartList.filter(item => !item.checked).length)
      // }

      // 方法二 使用find
      if(this.cartList.length === 0) return false
      // return !this.cartList.find(item => !item.checked)

      // 方法三 使用for循环
      for(let item of this.cartList) {
        if(!item.checked) {
          return false
        }
      }
      return true
    }
  },
  methods: {
    // isSelectALL 为 true时，说明全部选中  isSelectAll为false说明有未选中的
    checkClick() {
      if(this.isSelectAll) {
        this.$store.state.cartList.forEach(item => item.checked = false)
      } else {
        this.$store.state.cartList.forEach(item => item.checked = true)
      }
    }
  }
}
</script>

<style scoped>
  .bottom-bar {
    position: relative;
    display: flex;
    height: 40px;
    line-height: 40px;
    background-color: #eee;
  }

  .check-content {
    display: flex;
    align-items: center; 
    margin-left: 10px;
    width: 60px;
  }

  .check-btn {
    height: 20px;
    width: 20px;
    line-height: 20px;
    margin-right: 5px;
  }

  .price {
    flex: 1;
    margin-left: 25px;
  }

  .caculate {
    width: 90px;
    text-align: center;
    color: #fff;
    background-color: var(--color-tint);
  }
</style>