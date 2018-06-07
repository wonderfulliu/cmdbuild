<template>
  <div class="byself">
    <h3>{{tableCName}}
      <Button type="ghost" size="small" icon="plus-round" @click="AddRecord"></Button>
    </h3>
    <div class="table">
      <Table border
             height="100"
             size="small"
             :columns="columns"
             :data="data"></Table>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      tableEName: 'host',//表英文名
      tableCName: '主机Host',//表中文名
      columns: [], //表头数据
      data: [], //表格数据
    }
  },
  created() {
    this.getThead();
  },
  methods: {
    //获取表头
    getThead() {
      let data = {
        'table':'Host'
      };
      this.$http
        .post('/cardController/getAttributeList', data)
        .then(info => {
          let newArra = [];
          info.data.forEach(function(v, i){
            let newObja = {
              title: v.cname,
              key: v.attribute,
              width: 160
            };
            newArra.push(newObja);
          });
          this.columns = newArra;
        });
    },
    //添加记录
    AddRecord(){
      //向表格添加记录
      console.log('向表格添加了一条记录');
    },
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

