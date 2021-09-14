import Vue from "vue";
import Vuex from "vuex"

// 1.安装插件
Vue.use(Vuex)

// 2.创建Store对象
const store =new Vuex.Store({
  state: {
    cartList: []
  },
  mutations: {
    addCart(state, payLoad) {
      // payLoad新添加的商品
      let oldProduct = null;
      for(let item of state.cartList) {
        if(item.iid === payLoad.iid) {
          oldProduct = item
        }
      }

      // 2.判断oldProduct
      if(oldProduct) {
        oldProduct.count += 1
      } else {
        payLoad.count = 1
        state.cartList.push(payLoad)
      }
    }
  }
})

// 3.挂载到Vue实例上
export default store