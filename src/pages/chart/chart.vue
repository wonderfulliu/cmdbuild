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
              <Col span="24" :key="ci" v-for="(ck, ci) in sideMenu.currentItem.columns[0].charts">
                <Card style="margin:15px">
                  <p slot="title" style="text-align: left">
                    {{sideMenu.currentItem.charts[ck].description}}
                  </p>
                  <a href="#" slot="extra">
                    <Icon type="ios-loop-strong"></Icon>
                    刷新
                  </a>
                  <div>
                    <Chart :xField="sideMenu.currentItem.charts[ck].categoryAxisField"
                           :yField="sideMenu.currentItem.charts[ck].valueAxisFields[0]"
                           :functionName="sideMenu.currentItem.charts[ck].dataSourceName"></Chart>
                  </div>
                </Card>
              </Col>
            </Row>
          </Col>

          <Col span="12">
            <Row>
              <Col span="24" :key="ci" v-for="(ck, ci) in sideMenu.currentItem.columns[1].charts">
              <Card style="margin:15px">
                <p slot="title" style="text-align: left">
                  {{sideMenu.currentItem.charts[ck].description}}
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
                _this.sideMenu.currentItem = oItem;
                _this.contentRender(_this.sideMenu.currentItem);
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
      console.log(item);
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
    }
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
