<template>
    <div id="searchAll">
      <transition name="fade" mode="out-in">
        <router-view>
        </router-view>
      </transition>
    </div>
</template>
<script>
export default {
  data() {
    return {

    };
  },
  created() {
    this.$router.push({ path: "/search/searchOn"});
  },
  methods: {

  }
};
</script>

<style lang="scss">

</style>
