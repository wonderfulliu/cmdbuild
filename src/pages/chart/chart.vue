<template>
  <div id="chartContainer">
    <Layout>
      <Sider hide-trigger collapsible width="240" :collapsed-width="0" v-model="isCollapsed">
        <Menu theme="dark"
              width="auto"
              :class="menuitemClasses"
              :style="{maxHeight:menuHeight,overflowY:'auto'}">
          <MenuItem :key="index"
                    :name="'1-' + index + 1"
                    v-for="(item, index) in sideMenu.dataList"
                    @click.native="getSelectMenuData(item)"
                    :class="{'ivu-menu-item-active':sideMenu.active&&index==0}">
            <span>{{ item.description }}</span>
          </MenuItem>
        </Menu>
      </Sider>
      <Layout class="miniWindow">
        <Row v-if="!sideMenu.currentItem.columns">
          <Col span="24">
          <Card style="margin:15px">
            <p slot="title" style="text-align: left">
              Classic film
            </p>
            <a href="#" slot="extra">
              <Icon type="ios-loop-strong"></Icon>
              刷新
            </a>
            <div>
            </div>
          </Card>
          </Col>
        </Row>
        <Row v-if="sideMenu.currentItem.columns">
          <Col span="12">
            <Row>
              <Col span="24" :key="ci" v-for="(cv, ci) in dashboard.chartDatas">
                <Card style="margin:15px">
                  <div>
                    <div id="mChart+'ci'"></div>
                  </div>
                </Card>
              </Col>
            </Row>
          </Col>

          <Col span="12">
            <Row>
              <Col span="24">
              <Card style="margin:15px">
                <p slot="title" style="text-align: left">

                </p>
                <a href="#" slot="extra">
                  <Icon type="ios-loop-strong"></Icon>
                  刷新
                </a>
                <div>
                  Content of no border type
                </div>
              </Card>
              </Col>
            </Row>
          </Col>

        </Row>
      </Layout>
    </Layout>
  </div>
</template>

<script>
export default {
  data () {
    return {
      //侧栏数据
      sideMenu:{
        dataList:[], //侧栏菜单数据集合
        active: true, //侧栏默认选中
        currentItem: {},//当前dashboard数据
      },
      dashboard: {
        chartDatas: [],
        leftChartData: [],
        rightChartData: [],
        selfClartData: []
      },
      menuHeight: '', //侧栏内容最大高度
      isCollapsed: false
    };
  },
  created(){
    this.getsideMenu();

    for(let index in this.chartDatas){
      this.drawLine(index,this.chartDatas[index]);
    }

  },
  mounted(){
    let _this = this;
    window.onresize = () => {
      _this.heightAdaptive();
    }
  },
  methods:{
    //获取侧栏数据
    getsideMenu(){
      let _this = this;
      this.$http.get("/dashboardController/getFunctionMenu")
        .then(function(info){
          if(info){
            let newArr = [];
            info.data.forEach(function(v, i){
              let oItem = JSON.parse(v);
              if(i ==0){
                _this.sideMenu.currentItem = oItem; //初始加载
                _this.contentRender(_this.sideMenu.currentItem);//渲染初始加载页面
              }
              newArr.push(oItem);
            });
            _this.sideMenu.dataList = newArr;
          }
        })
    },
    //点击侧栏获取数据
    getSelectMenuData(item){
      this.sideMenu.active = false;
      this.contentRender(item);
    },
    //内容区域渲染
    contentRender(item){
      let chartsArr = item.charts;
      let coluArr = item.columns[0].charts;
      for(let ckey in coluArr){
        this.getDashboardData(ckey, chartsArr[coluArr[ckey]]);
      }
      console.log(this.dashboard.chartDatas);
    },
    //获取图标数据
    getDashboardData(index, value){
      let _this = this;
      let xField = value.categoryAxisField;
      let yField = value.valueAxisFields[0];
      let functionName = value.dataSourceName;
      this.$http
        .get('/dashboardController/getData?xField=' + xField +
          '&yField=' + yField +
          '&functionName=' + functionName)
        .then(info => {
              _this.dashboard.chartDatas[index] = {
                charts : info.data,
                title : value.description
              };
        }, info => {
          console.log(info)
        });
    },
    //绘制图表
    drawLine(index, value){//category, legend, series
      let _this = this;
      let echarts = require('echarts');
      //初始化实例
      let mChart = echarts.init(document.getElementById('mChart'+index));
      //绘制
      mChart.setOption({
        title: {
          text: value.title
        },
        tooltip: {},
        legend: {
          data: value.charts.legend
        },
        xAxis :{
          data: value.charts.category
        },
        yAxis: {},
        series: value.charts.series
      });
    },
    // 高度自适应
    heightAdaptive() {
      let clientH = document.documentElement.clientHeight;
      this.menuHeight = clientH - 104 + 'px';
    },

  },
  computed: {
    menuitemClasses: function () {
      return [
        'menu-item',
        this.isCollapsed ? 'collapsed-menu' : ''
      ]
    },
  },
}
</script>

<style>
html, body {
  width: 100%;
  height: 100%;
}
#chartContainer {
  height: 100%;
  background-color: #eee;
}
</style>
