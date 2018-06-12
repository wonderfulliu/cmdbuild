<template>
  <Layout>
    <transition name="fade" mode="out-in">
      <router-view @currentScene="getCurrentScene">
      </router-view>
    </transition>
  </Layout>
</template>

<script>
export default {
  data() {
    return {
      currentScene: {},//当前场景信息
    }
  },
  created() {
  },
  mounted () {
    this.$router.push({ path: "/workflow/wfList"});
  },
  methods: {
    getCurrentScene(data) {
      console.log(data);
      this.currentScene = data;
    },

  }
}
</script>

<style>

</style>
