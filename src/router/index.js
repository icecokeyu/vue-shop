// 1.导入vue-router
import vue from 'vue';
import Router from 'vue-router';

// 以懒加载方式导入路由
const Home = () => import('views/home/Home.vue');
const Category = () => import('views/category/Category.vue');
const Cart = () => import('views/cart/Cart.vue');
const Profile = () => import('views/profile/Profile.vue');
const Detail = () => import('views/detail/Detail.vue')

// 2.安装插件
vue.use(Router)

// 3.创建路由实例对象,及路由映射关系
const routes = [
  {
    path: '',
    redirect: '/home'
  },
  {
    path: '/home',
    component: Home
  },
  {
    path: '/category',
    component: Category
  },
  {
    path: '/cart',
    component: Cart
  },
  {
    path: '/profile',
    component: Profile
  },
  {
    path: '/detail/:iid',
    component: Detail
  }
];

const router = new Router({
  routes,
  mode: 'history'
})

// 4.导出路由
export default router