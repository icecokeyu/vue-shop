<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物车</div></nav-bar>
    <tab-control
        ref="tabControl1"
        :titles="['流行', '新款', '精选']"
        @tabClick="tabClick"
        class="tab-control1"
        v-show="isTabFixed"
      />
    <!-- 如果不加：会被当成一个字符串 -->
    <scroll
      class="content"
      ref="scroll"
      :probe-type="3"
      @scroll="contentScroll"
      :pull-up-load="true"
      @sentup="loadMore"
    >
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"/>
      <recommend-view :recommends="recommends" />
      <feature-view />
      <tab-control
        ref="tabControl2"
        :titles="['流行', '新款', '精选']"
        @tabClick="tabClick"
      />
      <goods-list :goods="showGoodsList" />
    </scroll>
    <back-top @click.native="backClick" v-show="isShowBackTop" />
  </div>
</template>

<script>
// home页面的子组件导入
import HomeSwiper from "./childComps/HomeSwiper.vue";
import RecommendView from "./childComps/RecommendView.vue";
import FeatureView from "./childComps/FeatureView.vue";

// components里的组件导入
import NavBar from "components/common/navbar/NavBar.vue";
import TabControl from "components/content/tabControl/TabControl.vue";
import GoodsList from "components/content/goods/GoodsList.vue";
import Scroll from "components/common/scroll/Scroll.vue";
import BackTop from "components/content/backTop/BackTop.vue";

// 请求数据的函数导入
import { getHomeMultidata, getHomeGoods } from "network/home";
import { debounce } from "common/utils";
import {backTopMixin} from "common/mixin.js"

export default {
  name: "Home",
  mixins: [backTopMixin],
  components: {
    // 顺序最好和导入组件的顺序一致
    HomeSwiper,
    RecommendView,
    FeatureView,
    NavBar,
    TabControl,
    GoodsList,
    Scroll,
    BackTop,
  },
  data() {
    return {
      banners: [],
      recommends: [],
      goods: {
        pop: { page: 0, list: [] },
        new: { page: 0, list: [] },
        sell: { page: 0, list: [] },
      },
      currentType: "pop",
      tabOffsetTop: 0,
      isTabFixed: false,
      scrollY: 0
    };
  },
  created() {
    // 1.请求多个数据
    // created中的数据最好在methods里面再做一层封装，注意这里要加上this
    this.getHomeMultidata();

    // 2,请求商品数据
    this.getHomeGoods("pop");
    this.getHomeGoods("new");
    this.getHomeGoods("sell");
  },
  destroyed() {
    console.log('home destroyed');
  },
  actived() {
    this.$refs.scroll.refresh()
    this.$refs.scroll.scrollTo(0, this.scrollY, 0);
  },
  unactived() {
    this.scrollY = this.refs.scroll.getScrollY()
    console.log(this.scrollY);
  },
  mounted() {
    // 获取tabControl的offsetTop值 这样获取的offsetTop值是不正确的，因为图片还未加载完，高度不对
    // console.log(this.$refs.tabControl.$el.offsetTop);

    const refresh = debounce(this.$refs.scroll.refresh, 200)
    // 使用this.$refs 或者document.querySeletor方法等时 一定要再mounted里面使用
    this.$bus.$on("homeItemImgLoad", () => {
      refresh();
    });
  },
  computed: {
    showGoodsList() {
      return this.goods[this.currentType].list;
    },
  },
  methods: {
    // 事件监听有关的方法
    tabClick(index) {
      // console.log(index);
      switch (index) {
        case 0:
          this.currentType = "pop";
          break;
        case 1:
          this.currentType = "new";
          break;
        case 2:
          this.currentType = "sell";
          break;
      }
      this.$refs.tabControl1.currentIndex = index;
      this.$refs.tabControl2.currentIndex = index;
    },
    // backClick() {
    //   // console.log('点击了backtop组件');
    //   // this.$refs.scroll.scroll.scrollTo(0, 0, 300)
    //   // this.$refs.scroll拿到的是scroll组件,.scroll拿到的是scroll对象，.scrollTo调用的是对象的方法
    //   this.$refs.scroll.scrollTo(0, 0, 300);
    //   // this.$refs.scroll拿到的是scroll组件，.scrollTo调用的是组件的方法，给组件封装了方法
    // },
    contentScroll(position) {
      // 设置backTop按钮是否隐藏
      this.isShowBackTop = -position.y > 1000;
      // 设置第一个TabControl是否显示
      this.isTabFixed = -position.y > this.tabOffsetTop
    },
    loadMore() {
      // 1.上拉加载更多数据,并监听图片什么时候加载完
      this.getHomeGoods(this.currentType);
      // console.log('上拉加载更多');
      // 2.图片加载完后，调用refresh方法，重新计算可滚动区域的大小
    },
    swiperImageLoad() {
      this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
    },
    // 请求数据有关的方法
    getHomeMultidata() {
      getHomeMultidata().then((res) => {
        // console.log(res);
        // created里面的this指向的就是这个组件对象
        // this.result = res;
        this.banners = res.data.banner.list;
        this.recommends = res.data.recommend.list;
      });
    },
    getHomeGoods(type) {
      const page = this.goods[type].page + 1;
      getHomeGoods(type, page).then((res) => {
        // res是暂时性变量
        // console.log(res);
        this.goods[type].list.push(...res.data.list);
        this.goods[type].page += 1;

        this.$refs.scroll.finishPullUp();
      });
    },
  },
};
</script>

<style scoped>
#home {
  position: relative;
  height: 100vh;
}
.home-nav {
  background-color: var(--color-tint);
  color: #fff;
  /* 使用浏览器原生滚动时让导航不跟着一起滚动 */
  /* position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9; */
}

/* .content {
    height: calc(100% - 93px);
    overflow: hidden;
    margin-top: 44px;
  } */

.content {
  overflow: hidden;
  position: absolute;
  top: 44px;
  bottom: 49px;
  left: 0;
  right: 0;
}

.tab-control1 {
  position: relative;
  z-index: 9;
}
</style>