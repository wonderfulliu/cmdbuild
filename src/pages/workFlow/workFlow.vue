<template>
  <Layout>
    <transition name="fade" mode="out-in">
      <router-view>
      </router-view>
    </transition>
  </Layout>
</template>

<script>
export default {
  data() {
    return {

    }
  },
  created() {
  },
  mounted () {
    this.$router.push({ path: "/workflow/wfList"});
  },
  methods: {

  }
}
</script>

<style>

</style>
