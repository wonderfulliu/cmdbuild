<template>
  <Layout class="miniWindow">
    <Header ref="conBhead" style="padding: 0;height: 64px;" class="layout-header-bar">
      <Steps :current="current">
        <Step :key="index"
              :title="item.TableName"
              v-for="(item, index) in currentScene"></Step>
        <Step title="完成"></Step>
      </Steps>
    </Header>
    <Content :style="{height:contentBodyH}">
      <router-view :Type="currentType"
                   :tabShow="nextBtnDisabled"
                   :TableEName="currentTableEName"></router-view>
      <div class="btnGroup">
        <ButtonGroup shape="circle">
          <Button type="primary" @click="step('pre')" :disabled="preBtnDisabled">
            <Icon type="chevron-left"></Icon>
            上一步
          </Button>
          <Button type="primary">
            保存
          </Button>
          <Button type="primary" @click="step('next')" :disabled="nextBtnDisabled">
            下一步
            <Icon type="chevron-right"></Icon>
          </Button>
        </ButtonGroup>
      </div>
    </Content>

  </Layout>
</template>
<script>
export default {
  data() {
    return {
      //页面样式
      contentBodyH: '', // .contentBody高度
//      tableHeight: '',  //表格的高度
//      contentTabsH: '',  //选项卡的高度
      //参数配置
      current: 0, //到第几步了
      way: "byself", //录入的方式
      preBtnDisabled: false, //上一步是否禁用
      nextBtnDisabled: false, //下一步是否禁用

//      currentTab: 'tab1',//标签页
      //数据
      currentScene: [], //步骤信息中所有数据
      currentTableEName: '',  //当前步骤对应表英文名
      currentType: '', //类型
    };
  },
  watch: {
    "$route": 'routerChange',
    'current': function(newValue, oldValue){
      this.currentChange();
      this.getStepTableName()
    },
  },
  created () {
    this.getStepInfo();
    this.currentChange();
    this.getStepTableName();
  },
  /*computed: {
    btnGroupShow() {
      console.log(this.currentTab);
      return this.currentTab == 'tab1'?true:false
    }
  },*/
  mounted () {
    this.way = this.$route.name;
    let _this = this;
    _this.heightAdaptive();
    window.onresize = () => {
      _this.heightAdaptive();
    }
//    setInterval(this.countDown, 1000);
  },
  methods: {

    // 监控当前步骤编号的变化 控制按钮是否禁用
    currentChange() {
      let maxStepNum = this.currentScene.length;  //最大步骤数  步骤数从0开始
      if(this.current == 0){    //当前步骤编号为0
        this.preBtnDisabled = true; //上一步禁用
        this.nextBtnDisabled = false; //下一步不禁用
      }else if(this.current == maxStepNum){
        this.preBtnDisabled = false; //上一步不禁用
        this.nextBtnDisabled = true; //下一步禁用
      }else {
        this.preBtnDisabled = false; //上一步不禁用
        this.nextBtnDisabled = false; //下一步不禁用
      }
    },

    // 监控路由变化, 保证下拉框和路由统一
    routerChange(){
      this.way = this.$route.name;
    },

    // 下一步
    step(type) {
      switch(type) {
        case 'next':
          this.current++;
          break;
        case 'pre':
          this.current--;
          break;
      };
    },

    //获取步骤信息
    getStepInfo() {
      this.currentScene = this.$store.state.currentScene;
    },

    //获取当前步骤对应表名
    getStepTableName() {
      if(this.currentScene.length != this.current){
        this.currentTableEName = this.currentScene[this.current].TableEName;
        this.currentType = this.currentScene[this.current].Type;
      }else{
        this.currentTableEName = '';
        this.currentType = '';
      }

    },

    // 高度自适应
    heightAdaptive() {
      let clientH = document.documentElement.clientHeight;
      this.clientW = document.documentElement.clientWidth;
      this.contentbodyH = clientH - 140 + 'px';
//      this.contentTabsH = clientH - 205 + 'px';
//      this.tableHeight = clientH - 215;
    }
  }
};
</script>
 
<style lang="scss">
</style>
