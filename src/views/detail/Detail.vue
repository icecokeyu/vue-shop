<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"/>
    <scroll class="content" ref="scroll" :probe-type="3" @scroll="contentScroll">
      <detail-swiper :top-images="topImages"/>
      <detail-base-info :goods="goods" />
      <detail-shop-info :shop="shop" />
      <detail-goods-info :images-info="imagesInfo" @imgLoad="imgLoad"/>
      <detail-params-info ref="params" :param-info="paramInfo"/>
      <detail-comment-info ref="comment" :comment-info="commentInfo"/>
      <goods-list ref="recommend" :goods="recommends"/>
    </scroll>
    <detail-bottom-bar @addCart="addToCart"/>
    <back-top @click.native="backClick" v-show="isShowBackTop" />
  </div>
</template>

<script>
import DetailNavBar from './childComps/DetailNavBar.vue';
import DetailSwiper from './childComps/DetailSwiper.vue';
import DetailBaseInfo from './childComps/DetailBaseInfo.vue'
import DetailShopInfo from './childComps/DetailShopInfo.vue'
import DetailGoodsInfo from './childComps/DetailGoodsInfo.vue';
import DetailParamsInfo from './childComps/DetailParamsInfo.vue';
import DetailCommentInfo from './childComps/DetailCommentInfo.vue';
import DetailBottomBar from './childComps/DetailBottomBar.vue'
import GoodsList from 'components/content/goods/GoodsList.vue';
import BackTop from "components/content/backTop/BackTop.vue";

import Scroll from 'components/common/scroll/Scroll'

import {getDetail, Goods, Shop, GoodsParam, getRecommend} from "network/detail.js"

import {debounce} from "common/utils.js"
import {backTopMixin} from "common/mixin.js"



export default {
  name: "Detail",
  mixins: [backTopMixin],
  components: { 
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    Scroll,
    DetailGoodsInfo,
    DetailParamsInfo,
    DetailCommentInfo,
    DetailBottomBar,
    GoodsList,
    BackTop
  },
  data() {
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      imagesInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommends: [],
      themeTopYs:[],
      getThemeTopYs: null,
      currentIndex: 0,
    };
  },
  created() {
    // 1.保存传入的iid
    this.iid = this.$route.params.iid;
    // 2.根据iid请求详情数据
    getDetail(this.iid).then((res) => {
      // 1.获取顶部的图片
      console.log(res);
      this.topImages = res.result.itemInfo.topImages;

      //3.获取商品信息
      const data = res.result;
      this.goods = new Goods(
        data.itemInfo,
        data.columns,
        data.shopInfo.services
      );

      // 4.创建店铺信息的对象
      this.shop = new Shop(data.shopInfo);

      // 5.获取商品详情数据
      this.imagesInfo = data.detailInfo;

      // 6.获取商品参数信息
      this.paramInfo = new GoodsParam(
        data.itemParams.info,
        data.itemParams.rule
      );
      // 7.获取商品评论信息
      // 先进行判断，判断商品有无评论信息
      if (data.rate.cRate !== 0) {
          this.commentInfo = data.rate.list[0] || {};
        }
    })
     // 8.请求推荐数据
    getRecommend().then((res) => {
      // console.log(res);
      this.recommends = res.data.list;
    });
  }, 
  mounted() {
    // 获取tabControl的offsetTop值 这样获取的offsetTop值是不正确的，因为图片还未加载完，高度不对
    // console.log(this.$refs.tabControl.$el.offsetTop);

    const refresh = debounce(this.$refs.scroll.refresh, 200)
    // 使用this.$refs 或者document.querySeletor方法等时 一定要再mounted里面使用
    this.$bus.$on("detailItemImgLoad", () => {
      refresh();
    });
  },
  methods: {
    imgLoad() {
      this.$refs.scroll.refresh()
      this.getThemeTopYs = debounce(() => {
        this.themeTopYs.push(0)
        this.themeTopYs.push(this.$refs.params.$el.offsetTop)
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
        this.themeTopYs.push(Number.MAX_VALUE)
      })
      this.getThemeTopYs()
      console.log(this.themeTopYs);
    },
    titleClick(index) {
      // console.log(index);
      this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 500)
    },
    contentScroll(position) {
      // console.log(position);
      // 1.获取Y值

      const positionY = -position.y;
      // console.log(positionY);
      // 2.positionY和主题中进行对比
      // [0, 11251, 11843, 12037, Number.MAX_VALUE]
    
      // positionY在0 和 11251之间，index = 0
      // positionY在11251 和 11843之间，index = 1
      // positionY在11843 和 12037之间，index = 2
      // positionY大于等于12027，index = 3
      let length = this.themeTopYs.length
      for(let i = 0; i < length - 1; i++ ) {
        // 方法一
        // if(this.currentIndex !== i && ((i < length - 1 && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1]) || (i === length - 1 && positionY >= this.themeTopYs[i]))) {
        //   this.currentIndex = i;
        //   this.$refs.nav.currentIndex = this.currentIndex
        // }

        // 方法二
        if(this.currentIndex !== i && (positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1])) {
          this.currentIndex = i;
          // console.log(this.currentIndex);
          this.$refs.nav.currentIndex = this.currentIndex
        }
      }
      this.isShowBackTop = -position.y > 1000;
    },
    addToCart() {
      // 1.获取在购物车需要展示的信息 一张图片，标题，描述，最新价格，iid
      const product = {};
      product.image = this.topImages[0];
      product.title = this.goods.title;
      product.desc = this.goods.desc;
      product.price = this.goods.realPrice;
      product.iid = this.iid

      // 2.将商品添加到购物车里
      
    }
  }
};
</script>

<style scoped>
  #detail {
    position: relative;
    z-index: 9;
    background-color: #fff;
    height: 100vh;
  }

  .detail-nav {
    position: relative;
    z-index: 9;
    background-color: #fff;
  }

  .content {
    position: absolute;
    top: 44px;
    bottom: 60px;
  }
</style>