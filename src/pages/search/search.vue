<template>
    <div id="searchContainer">
      <div class="btnContainerAll">
          <Input v-model="searchMsg" size="large" placeholder="Search for..." style="width: 400px; height: 46px" icon="arrow-right-c" @on-click='getsearchMsg'></Input>
      </div>
    </div>
</template>
<script>
export default {
  data() {
    return {
      searchMsg: ""
    };
  },
  created(){
    this.gettableName();
  },
  methods: {
    // 根据搜索的内容查询所有符合的表与记录
    getsearchMsg(){
      let data = '?key=' + this.searchMsg;
      this.$http.get('/luceneController/search'+data).then(info => {
        // 成功的回调
        console.log(info.data);
        if (info.status == 200) {
          this.searchMsg = '';
          // 路由跳转

        }
      }, info => {
        // 失败的回调
      })
    },
    // 获取所有表名
    gettableName(){
      this.$http.get('/cardController/getTableList').then(info => {
        console.log(info);
      })
    }
  }
};
</script>

<style lang="scss">
#searchContainer {
  height: 100%;
  .btnContainerAll {
    margin-top: 100px;
    .ivu-input-wrapper {
      .ivu-input-large {
        font-size: 18px;
        height: 46px;
        padding-left: 20px;
        padding-right: 46px;
        border-radius: 23px;
      }
      input.ivu-input-large::placeholder{
        font-size: 16px;
      }
      i.ivu-input-icon{
        height: 46px;
        width: 46px;
        line-height: 46px;
        font-size: 24px;
        border-radius: 0 23px 23px 0;
        cursor: pointer;
      }
      i.ivu-input-icon:hover{
        background-color: #ededed;
        transition: .5s
      }
    }
  }
}
</style>