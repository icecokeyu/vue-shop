<template>
  <div id="cart">
    <nav-bar class="nav-bar">
      <div slot="center">购物车({{ cartLength }})</div>
    </nav-bar>
    <cart-list class="cart-list"></cart-list>
    <cart-bottom-bar></cart-bottom-bar>
  </div>
</template>

<script>
import NavBar from 'components/common/navbar/NavBar.vue'
import CartList from './childComps/CartList.vue'


// mapGetters辅助函数，可以将store中getter映射到局部计算属性
import {mapGetters} from 'vuex'

import Scroll from '../../components/common/scroll/Scroll.vue'
import CartBottomBar from './childComps/CartBottomBar.vue'

export default {
  name: 'Cart',
  components: {
  NavBar, 
  CartList, 
  Scroll,
  CartBottomBar
   },
  computed: {
    // cartLength() {
    //   return this.$store.getters.cartLength
    // }
    ...mapGetters(['cartLength', 'cartList'])
  }
}
</script>

<style>
  #cart {
    height: 100vh;
  }
  .nav-bar {
    background-color: var(--color-tint);
    color: #fff;
  }
  /* .cart-list {
    position: absolute;
    top: 44px;
    bottom: 49px;
    width: 100%;
  } */
</style>