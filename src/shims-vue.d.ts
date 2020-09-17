// declare module '*.vue' {
//   import Vue from 'vue'
//   export default Vue
// }
import Vue from 'vue'

declare module 'vue/types/vue' {
  interface Vue {
    // $router: VueRouter;
    // $route: Route;
    // $store: Store<any>;
    // 以下是在main.ts中挂载到Vue.prototype上的变量
    // $set: any;
  }
}