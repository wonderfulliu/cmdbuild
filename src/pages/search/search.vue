<template>
    <div id="searchAll">
      <Layout>
        <transition name="fade" mode="out-in">
          <router-view>
          </router-view>
        </transition>
      </Layout>
    </div>
</template>
<script>
export default {
  data() {
    return {

    };
  },
  created() {
  },
  mounted () {
    this.$router.push({ path: "/search/searchOn"});
  },
  methods: {

  }
};
</script>

<style lang="scss">
  #searchAll {
    height: 100%;
  }
</style>
