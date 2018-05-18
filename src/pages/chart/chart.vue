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
        <Row v-if="chartDatas.columnSelf">
          <Col span="24">
          <Card style="margin:15px">
            <div>
              一屏展示
            </div>
          </Card>
          </Col>
        </Row>
        <Row v-if="chartDatas.columnLeft">
          <Col span="12">
            <Row>
              <Col span="24" :key="cli" v-for="(clv, cli) in chartDatas.columnLeft">
                <Card style="margin:15px">
                  <div>
                    <!--<div :id="'mChart'+cli" @click="drawLine(cli, clv)" style="height:280px"></div>-->
                    <Chart :chartdata="clv" :index="cli"></Chart>
                  </div>
                </Card>
              </Col>
            </Row>
          </Col>

          <Col span="12">
            <Row>
              <Col span="24" :key="cri" v-for="(crv, cri) in chartDatas.columnRight">
              <Card style="margin:15px">
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
      chartDatas: {},
      menuHeight: '', //侧栏内容最大高度
      isCollapsed: false
    };
  },
  created(){
    this.getsideMenu();
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
      //处理数据   当数据中没有columns属性时 一屏展示，反之两屏
      let charts = item.charts;
      if(item.columns){
        //两屏
        let newobj = {
          columnLeft: [],
          columnRight: []
        };
        //遍历左边
        for(let cli in item.columns[0].charts){
          let clk = item.columns[0].charts[cli];
          let chartObj = {};
          if(!charts[clk]){
            continue;
          }else if(charts[clk].type == 'bar'){
            chartObj = {
              title: charts[clk].description,
              chartAttr:{
                xField: charts[clk].categoryAxisField,
                yField: charts[clk].valueAxisFields[0],
                functionName: charts[clk].dataSourceName
              }
            };
          }else if(charts[clk].type == 'pie'){
            chartObj = {
              title: charts[clk].description,
              chartAttr:{
                xField: charts[clk].labelField,
                yField: charts[clk].singleSeriesField,
                functionName: charts[clk].dataSourceName
              }
            };
          }
          newobj.columnLeft.push(chartObj);
        }
        //遍历右边
        for(let cri in item.columns[1].charts){
          let crk = item.columns[1].charts[cri];
          let chartObj = {};
          if(!charts[crk]){
            continue;
          }else if(charts[crk].type == 'bar'){
            chartObj = {
              title: charts[crk].description,
              chartAttr:{
                xField: charts[crk].categoryAxisField,
                yField: charts[crk].valueAxisFields[0],
                functionName: charts[crk].dataSourceName
              }
            };
          }else if(charts[crk].type == 'pie'){
            chartObj = {
              title: charts[crk].description,
              chartAttr:{
                xField: charts[crk].labelField,
                yField: charts[crk].singleSeriesField,
                functionName: charts[crk].dataSourceName
              }
            };
          }
          newobj.columnRight.push(chartObj);
        }
        this.chartDatas = newobj;
        this.getChartsMsg();
      }else {
        //一屏
        let newobj = {
          columnSelf: []
        };
        for(let csk in charts){
          let chartObj = {};
          if(charts[csk].type == 'bar'){
            chartObj = {
              title: charts[csk].description,
              chartAttr:{
                xField: charts[csk].categoryAxisField,
                yField: charts[csk].valueAxisFields[0],
                functionName: charts[csk].dataSourceName
              }
            };
          }else if(charts[csk].type == 'pie'){
            chartObj = {
              title: charts[csk].description,
              chartAttr:{
                xField: charts[csk].labelField,
                yField: charts[csk].singleSeriesField,
                functionName: charts[csk].dataSourceName
              }
            };
          }
          newobj.columnSelf.push(chartObj);
        }
        this.chartDatas = newobj;
        this.getChartsMsg();
      }
    },
    //获取图表数据
    getChartsMsg(){
      for(let k in this.chartDatas) {
        this.chartDatas[k].forEach((v, i) => {
          this.$http
          .get('/dashboardController/getData?xField=' + v.chartAttr.xField +
            '&yField=' + v.chartAttr.yField +
            '&functionName=' + v.chartAttr.functionName)
          .then(info => {
              v.chartAttr = info.data;
          })
          .catch(err => {
            v.chartAttr = {};
          })
        })
      }
      console.log(this.chartDatas);
    },
    //绘制图表
    drawLine(index, value){//category, legend, series
      let _this = this;
      let echarts = require('echarts');
      if(value.chartAttr.category){
        //初始化实例
        let mChart = echarts.init(document.getElementById('mChart'+index));
        //绘制
        mChart.setOption({
          title: {
            text: value.title
          },
          tooltip: {},
          legend: {
            data: value.chartAttr.legend
          },
          xAxis :{
            data: value.chartAttr.category
          },
          yAxis: {},
          series: value.chartAttr.series
        });
      }else {
        document.getElementById('mChart'+index).innerHTML = "暂无数据"
      }

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
