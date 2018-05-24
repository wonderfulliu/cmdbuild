<template>
  <Layout class="miniWindow" :style="{height:contentH}">
    <Row v-if="chartDatas.columnSelf">
      <Col span="24" :key="csi" v-for="(csv, csi) in chartDatas.columnSelf">
      <Card style="margin:15px">
        <div>
          <Chart :chartdata="csv"></Chart>
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
            <Chart :chartdata="clv"></Chart>
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
            <Chart :chartdata="crv"></Chart>
          </div>
        </Card>
        </Col>
      </Row>
      </Col>

    </Row>
  </Layout>
</template>

<script>
  export default {
    props: {
      dashboardName: {
        type: String,
        required: true
      }
    },
    data () {
        return {
          chartDatas: {},
          contentH: ''
        }
    },
    created () {
      this.getCurrentMsg();
      this.heightAdaptive();
    },
    mounted(){
      let _this = this;
      window.onresize = () => {
        _this.heightAdaptive();
      }
    },
    methods: {
      //获取当前信息
      getCurrentMsg(){
        let _this = this;
        let menuList = JSON.parse(sessionStorage.getItem("DashboardMenuList"));
        menuList.forEach(function(v, i){
          if(v.description == _this.dashboardName){
            _this.contentRender(v);
          }
        });
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
                  type: charts[clk].type,
                  xField: charts[clk].categoryAxisField,
                  yField: charts[clk].valueAxisFields[0],
                  functionName: charts[clk].dataSourceName
                }
              };
            }else if(charts[clk].type == 'pie'){
              chartObj = {
                title: charts[clk].description,
                chartAttr:{
                  type: charts[clk].type,
                  xField: charts[clk].labelField,
                  yField: charts[clk].singleSeriesField,
                  functionName: charts[clk].dataSourceName
                }
              };
            }else if(charts[clk].type == 'line'){
              chartObj = {
                title: charts[clk].description,
                chartAttr:{
                  type: charts[clk].type,
                  xField: charts[clk].categoryAxisField,
                  yField: charts[clk].valueAxisFields[0],
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
                  type: charts[crk].type,
                  xField: charts[crk].categoryAxisField,
                  yField: charts[crk].valueAxisFields[0],
                  functionName: charts[crk].dataSourceName
                }
              };
            }else if(charts[crk].type == 'pie'){
              chartObj = {
                title: charts[crk].description,
                chartAttr:{
                  type: charts[crk].type,
                  xField: charts[crk].labelField,
                  yField: charts[crk].singleSeriesField,
                  functionName: charts[crk].dataSourceName
                }
              };
            }else if(charts[crk].type == 'line'){
              chartObj = {
                title: charts[crk].description,
                chartAttr:{
                  type: charts[crk].type,
                  xField: charts[crk].categoryAxisField,
                  yField: charts[crk].valueAxisFields[0],
                  functionName: charts[crk].dataSourceName
                }
              };
            }
            newobj.columnRight.push(chartObj);
          }
          this.chartDatas = newobj;
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
                  type: charts[csk].type,
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
            }else if(charts[csk].type == 'line'){
              chartObj = {
                title: charts[csk].description,
                chartAttr:{
                  type: charts[csk].type,
                  xField: charts[csk].categoryAxisField,
                  yField: charts[csk].valueAxisFields[0],
                  functionName: charts[csk].dataSourceName
                }
              };
            }
            newobj.columnSelf.push(chartObj);
          }
          this.chartDatas = newobj;
        }
      },
      heightAdaptive() {
        let clientH = document.documentElement.clientHeight;
        this.contentH = clientH - 64 + 'px';
      },
    }
    }
</script>
