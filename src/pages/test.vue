<template>
  <AutoComplete
        v-model="value"
        :data="data"
        @on-search="search"
        @on-select="select"
        placeholder="input here"
        style="width:200px">
  </AutoComplete>
</template>
<script>
export default {
  data() {
    return {
      value: '',
      data: [],
    };
  },
  methods: {
    search(){
      this.data.push(this.value);
    },
    select(value){
      console.log(value);
      console.log(this.data);
    },
  }
};
</script>
