<template>
  <div class="byself">
    <h3>{{tableName}}</h3>
    <div class="table">
      <Table height="100" :columns="columns" :data="data"></Table>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      tableName: '表格名字',
      columns: [], //表头数据
      data: [], //表格数据
    }
  } 
};
</script>
 
<style lang="scss">
.byself {
  h3{
    text-align: left;
    padding: 5px 20px;
  }
}
</style>

