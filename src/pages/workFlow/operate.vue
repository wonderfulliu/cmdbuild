<template>
  <div class="operate">
    <div class="steps">
      <Steps :current="current">
        <Step title="开始录入"></Step>
        <Step title="数据库"></Step>
        <Step title="应用系统"></Step>
        <Step title="确认"></Step>
      </Steps>
    </div>
    <div class="way">
      <h2>请选择录入方式: </h2>
      <Select v-model="way" style="width:200px">
        <Option value="byself"><router-link to="/workflow/operate/byself">手动新增/修改CI内容</router-link></Option>
        <Option value="byexcel"><router-link to="/workflow/operate/byexcel">Excel批量新增/修改CI内容</router-link></Option>
      </Select>
    </div>
    <div class="content">
      <!-- 放置上传下载组件或者手动录入组件 -->
      <router-view></router-view>
    </div>
    <div class="btn">
      <ButtonGroup shape="circle">
        <Button type="primary" @click="step('pre')">
            <Icon type="chevron-left"></Icon>
            上一步
        </Button>
        <Button type="primary">
          保存
        </Button>
        <Button type="primary" @click="step('next')">
            下一步
            <Icon type="chevron-right"></Icon>
        </Button>
      </ButtonGroup>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      current: 1, //到第几步了
      way: "byself" //录入的方式
    };
  },
  watch: {
    "$route": 'routerChange',
  },
  mounted () {
    this.way = this.$route.name;
  },
  methods: {
    // 监控路由变化, 保证下拉框和路由统一
    routerChange(){
      this.way = this.$route.name;
    },
    // 下一步
    step(value) {
      if (value == "next") {
        if (this.current == 3) {
          return false;
        } else {
          this.current += 1;
        }
      } else {
        if (this.current == 0) {
          return false;
        } else {
          this.current -= 1;
        }
      }
    },
  }
};
</script>
 
<style lang="scss">
.operate {
  height: 100%;
  padding: 20px 15px;
  background-color: #f5f7f9;
  .steps {
    width: 60%;
    margin-bottom: 35px;
  }
  .way {
    overflow: hidden;
    margin-bottom: 35px;
    h2{
      margin-left: 120px;
      float: left;
    }
    div.ivu-select{
      margin-left: 25px;
      float: left;
    }
    .ivu-select-item{
      padding: 0;
      a{
        display: block;
        height: 30px;
        line-height: 30px;
      }
    }
  }
  .content{
    min-height: 120px;
    margin-bottom: 70px;
  }
  .btn{
    div.ivu-btn-group{
      width: 100%;
      padding: 5px 300px;
      button:nth-child(2){
        width: 100px;
        margin: 0 15px;
      }
    }
  }
  .ivu-steps .ivu-steps-head {
    background-color: #f5f7f9;
  }
  .ivu-steps .ivu-steps-title {
    background-color: #f5f7f9;
  }
  .ivu-steps-item.ivu-steps-status-process .ivu-steps-tail > i {
    background-color: transparent;
    display: none;
  }
  .ivu-steps .ivu-steps-tail > i {
    background: transparent;
  }
  a {
    color: #000;
  }
  .ivu-select-item-selected > a {
    color: #fff;
  }
}
</style>
