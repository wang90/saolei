<template>
  <div id="app">
    <index></index>
  </div>
</template>
<style>
</style>
<script lang = "ts">
import { Component, Vue } from 'vue-property-decorator';
import Index from "./pages/index.vue";

@Component({
  components: {
    'index': Index,
  },
})
export default class App extends Vue{}
</script>

