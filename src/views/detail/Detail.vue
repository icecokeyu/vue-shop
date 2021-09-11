<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav"/>
    <scroll class="content" ref="scroll">
      <detail-swiper :top-images="topImages"/>
      <detail-base-info :goods="goods" />
      <detail-shop-info :shop="shop" />
      <detail-goods-info :images-info="imagesInfo" @imgLoad="imgLoad"/>
      <detail-params-info :param-info="paramInfo"/>
      <detail-comment-info :comment-info="commentInfo"/>
      <goods-list :goods="recommends"/>
    </scroll>
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
import GoodsList from 'components/content/goods/GoodsList.vue';

import Scroll from 'components/common/scroll/Scroll'

import {getDetail, Goods, Shop, GoodsParam, getRecommend} from "network/detail.js"

import {debounce} from "common/utils.js"



export default {
  name: "Detail",
  components: { 
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    Scroll,
    DetailGoodsInfo,
    DetailParamsInfo,
    DetailCommentInfo,
    GoodsList
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
      console.log(res);
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