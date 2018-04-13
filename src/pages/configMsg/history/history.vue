<template>
  <Layout>
    <Header :offset-top="64" :style="{padding: 0}" class="layout-header-bar">
      <div class="btnItem btnItemLeft">
        <Icon @click.native="collapsedSider" :class="rotateIcon" :style="{margin: '4px 20px'}" type="navicon-round" size="24"></Icon>
        <Button type="ghost" @click="backBtn">返回</Button>
      </div>
      <div class="btnItemRight floatRight">

        <ButtonGroup>
          <Button type="info">信息</Button>
          <Button type="info">关系</Button>
        </ButtonGroup>
      </div>
    </Header>

    <Content :style="{margin: '20px', background: '#fff', minHeight: '260px'}">
      <div class="contentBody">
        <Table border size="small" :loading="loading" height="440" :columns="columnData" :data="tableData"></Table>
      </div>
    </Content>

  </Layout>
</template>

<style lang="scss">
  .btnItemRight{
    .ivu-btn-group{
      button{
        margin-right: 0;
      }
    }
  }
</style>

<script>
  export default {
    props: {
      //表名
      'tableName':{
        type: String,
        required: true
      },
      'collapsedSider': {
        type: Function,
        default: null
      },
      'rotateIcon': {
        type: Array,
        default: null
      },
      //记录id
      'recordId': {
        type: Number,
        required: true
      }
    },
    data () {
      return {
        isCollapsed: false,
        columnData: '', //表头
        tableData: '',  //表数据
        loading: false
      }
    },
    created: function(){
      this.gethistoryInfo();
    },
    methods:{
      //历史信息记录
      gethistoryInfo(){
        let _this = this;
        _this.loading = true;
        let data = {
          table: _this.tableName,
          Id: _this.recordId
        };
        _this.$http.post('/cardController/cardHistory',data)
          .then(function(info){
            let opt = info.data[0];
            let arra = [];
            for(let k in opt){
              arra.push({title: k});
            }
            _this.columnData = arra;    //表头
            _this.tableData = info.data;  //数据
            _this.loading = false;
          });
        console.log(arra);
        console.log(_this.columnData);
        console.log(_this.tableData);
      },
      backBtn(){
        this.$router.go(-1);
      }
    }
    }
</script>
