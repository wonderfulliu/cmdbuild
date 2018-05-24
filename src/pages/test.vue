<template>
  <Layout>
    <div :key="index" v-for="(item, index) in data">
      {{item.title}}
    </div>
  </Layout>
</template>
<script>
export default {
  data() {
    return {
      data: [
        {
          title : '白菜豆腐',
          value: 10001
        },
        {
          title : '水煮鱼',
          value: 10002

        },
        {
          title : '菠萝古老肉',
          value: 10003

        },
        {
          title: '水煮鱼',
          value: 10004
        }
      ]
    };
  },
  methods: {
  }
};
</script>
