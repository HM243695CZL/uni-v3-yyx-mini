<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
onLaunch(() => {
  console.log("App Launch");
});
onShow(() => {
  console.log("App Show");
});
onHide(() => {
  console.log("App Hide");
});
</script>
<style lang="scss">
	@import '@/static/iconfont/iconfont.css';
	@import '@/uni_modules/uni-scss/index.scss';
	@import '@/uni.scss';
	@import '@/common.scss';
</style>
