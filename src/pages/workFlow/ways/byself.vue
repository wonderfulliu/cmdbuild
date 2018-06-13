<template>
  <div class="byself">
    <h3><!--{{tableCName}}-->
      <Button type="ghost" size="small" icon="plus-round" @click="AddRecord"></Button>
    </h3>
    <div class="table" style="position: relative">
      <Table border
             :height="tableHeight"
             size="small"
             :columns="columns"
             no-data-text=""
             :data="data"></Table>
      <Spin fix v-show="tbLoading">
        <Icon type="load-a" size=18 class="spinLoading"></Icon>
        <div>Loading</div>
      </Spin>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    TableEName:{
      type: String
    },
    Type:{
      type: String
    },
  },
  data () {
    return {
      //数据
      columns: [], //表头数据
      data: [], //表格数据
      //配置
      tbLoading: false,
      tableHeight: 100, //表格高度
    }
  },
  created() {
    this.getThead();
  },
  watch: {
    'TableEName': function(newValue, oldValue){
      this.getThead();
    },
  },
  mounted () {
    let _this = this;
    _this.heightAdaptive();
    window.onresize = () => {
      _this.heightAdaptive();
    }
  },
  methods: {
    //获取表头
    getThead() {
      this.tbLoading = true;
      let tHead = sessionStorage.getItem("tHead_" + this.TableEName);
      if(!tHead){
        if(this.Type == "table"){
          let data = {
            'table': this.TableEName
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
            sessionStorage.setItem("tHead_" + this.TableEName, JSON.stringify(newArra));
            this.columns = newArra;
          });
        }else if(this.Type == "relation"){
          this.columns = [];
        }
      }else {
        this.columns = JSON.parse(tHead);
      }
      this.tbLoading = false;
    },
    //添加记录
    AddRecord(){
      //向表格添加记录
      console.log('向表格添加了一条记录');
    },
    // 高度自适应
    heightAdaptive() {
      let clientH = document.documentElement.clientHeight;
      this.clientW = document.documentElement.clientWidth;
      this.tableHeight = clientH - 315;
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

