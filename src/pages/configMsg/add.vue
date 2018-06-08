<template>
<Layout>
  <div id="addContainer">
    <Header class="layout-header-bar">
      <Row>
        <Col span="1">
          <Icon @click.native="collapsedSider" :class="rotateIcon" class="menuCtrl" type="navicon-round" size="24"></Icon>
        </Col>
        <Col span="9" offset="1" style="text-align: left">
          <Breadcrumb>
            <BreadcrumbItem to="/config/tableList">配置信息</BreadcrumbItem>
            <BreadcrumbItem to="/config/tableList">{{tableCname}}</BreadcrumbItem>
            <BreadcrumbItem>新增</BreadcrumbItem>
          </Breadcrumb>
        </Col>
        <Col span="9" offset="4">
        <div class="floatRight">
          <Button type="primary" style="margin-right: 8px"  @click="cancel">取消</Button>
          <Button type="success" @click="submit">提交</Button>
        </div>
        </Col>
      </Row>
    </Header>
    <Content ref="conBbody"  class="contentForm" :style="{height:contHeight}" style="overflow-y: auto">
      <Form :label-width="100" class="formContainer">
        <FormItem :label="item.cname" v-for="(item, index) in addMsg" :key="index" v-if="item.title != 'Id'">
          <Input v-if="item.type == 'varchar' && item.attribute != 'BusinessType'" v-model="item.content" placeholder="Enter something..."></Input>
          <Select v-if="item.type == 'varchar' && item.attribute == 'BusinessType'" v-model="item.content" multiple filterable>
            <Option v-for="(attr, i) in item.lookupMsg" :key="i" :value="attr.value">{{attr.label}}</Option>
          </Select>
          <Cascader v-if="item.type == 'lookup'" :data="item.lookupMsg" v-model="item.content">
          </Cascader>
          <Row v-if="item.type == 'date'">
            <Col span="11">
            <DatePicker type="date" placeholder="请选择日期" v-model="item.content"></DatePicker>
            </Col>
          </Row>
          <Row v-if="item.type == 'time'">
            <Col span="11">
            <TimePicker type="time" placeholder="请选择时间" v-model="item.content"></TimePicker>
            </Col>
          </Row>
          <Input v-if="item.type == 'reference'" v-model="item.content" icon="document" placeholder="Enter something..." @on-click='getrefMsg(item.relationTable), getrefctMsg(item.relationTable)'></Input>
          <Checkbox v-if="item.type == 'bool'" v-model="item.content"></Checkbox>
          <InputNumber v-if="item.type == 'int4'" :min="0" v-model="item.content"></InputNumber>
        </FormItem>
      </Form>
    </Content>
    <div class="body">

    </div>
  </div>
  </Layout>
</template>

<script>
export default {
  props: {
    collapsedSider: {
      type: Function,
      default: null
    },
    rotateIcon: {
      type: Array,
      default: null
    },
    clientH:{
      type: Number,
      default: 0
    },
    clientW:{
      type: Number,
      default: 0
    },
  },
  watch: {
    'clientH': function (newValue, oldValue) {
      this.getHeight();
    },
    'clientW': function (newValue, oldValue) {
      this.getHeight();
    },
  },
  data() {
    return {
      addMsg: '',//需要双向绑定的数据
      tableName: '',//表名
      tableCname: '',//表中文名
      reftableMsg: '',//传到下一页的表格数据
      reftitleMsg: '',//传到下一页的表头中文名数据
      chooseMsg: '',//存储editTable页面传来的数据
      contHeight: ''//content内容区
    }
  },
  created() {
    this.getchooseMsg();
    this.getaddMsg();
    this.getHeight();
  },
  mounted () {
    let _this = this;
    window.onresize = () => {
      _this.getHeight();
    }
  },
  methods: {
    // 获取公共仓库的要渲染的数据
    getaddMsg(){
      this.addMsg = this.$store.state.addMsg.titleMsg;//待渲染的数据
      this.tableName = this.$store.state.addMsg.tableName;//表名
      this.tableCname = this.$store.state.addMsg.tableCname;//表中文名
      // console.log(this.$store.state.addMsg);
      if (this.chooseMsg) {//如果有editTable中被选中的数据, 将变化的数据更新至双向绑定的数据
        this.addMsg.forEach((v, i) => {
          if (v.type == "reference" && v.relationTable == this.chooseMsg.relationTable) {
            v.content = this.chooseMsg.description;
            v.Id = this.chooseMsg.Id;
          }
        })
      }
    },
    // 获取reference表头中文名数据
    getrefctMsg(relationTable){
      let data = { table: relationTable };
      this.$http.post('/cardController/getAttributeList', data).then(info => {
        if (info.status == 200) {
          this.reftitleMsg = info.data;
          if (this.reftableMsg) {
            let refMsg = {
              reftitleMsg: this.reftitleMsg,
              reftableMsg: this.reftableMsg,
              relationTable: relationTable
            }
            this.$store.commit('getrefMsg', refMsg);//不论哪个函数先执行, 都会只执行一次
            this.$router.push({path: '/config/configEdit'});//两个数据都拿到之后再推送
          }
        }
      });
    },
    // 获取reference表格数据
    getrefMsg(relationTable){
      let data = "?table=" + relationTable + "&pageNum=" + 1;
      this.$http.get("/cardController/getCardList" + data).then(info => {
        if (info.status == 200) {
          this.reftableMsg = info.data;
          if (this.reftitleMsg) {
            let refMsg = {
              reftitleMsg: this.reftitleMsg,
              reftableMsg: this.reftableMsg,
              relationTable: relationTable
            }
            this.$store.commit('getrefMsg', refMsg);//不论哪个函数先执行, 都只会执行一次
            this.$router.push({path: '/config/configEdit'});//两个数据都拿到之后再推送
          }
        }
      });
    },

    // 当从editTable页面跳回时传来的数据
    getchooseMsg(){
      this.chooseMsg = this.$store.state.chooseMsg;
    },

    // 提交按钮
    submit(){
      let submitMsg = {};
      submitMsg.table = this.tableName;
      this.addMsg.forEach((v, i) => {
        if (v.attribute) {
          if (v.type == "lookup" && v.content) {
            let len = v.content.length - 1;
            submitMsg[v.attribute] = v.content[len];
          } else if (v.type == "varchar" && v.attribute == "BusinessType" && v.content) {
            let newArr = [];
            v.content.forEach((value, i) => {
              v.lookupMsg.forEach((val, index) => {
                if (value == val.value) {
                  if (val.label) {
                    newArr.push(val.label);
                  } else {
                    // newArr.push(undefined);
                  }
                }
              })
            })
            submitMsg[v.attribute] = newArr.join('、');
          } else if (v.type == "date" && v.content) {//时间格式的数据
            submitMsg[v.attribute] = this.transformTime(v.content);
          } else if (v.type == "reference" && v.content) {//reference格式的数据
            submitMsg[v.attribute] = v.Id;
          } else { //其它数据类型可能还需要修改
            submitMsg[v.attribute] = v.content;
          }
        }
      })
      
      this.$http.post('/cardController/card', submitMsg).then(info => {
          // 成功的回调
          if (info.status == 200 && info.data == 'ok') {
            this.$Message.success({
              content: '添加成功',
            });
            this.$store.commit('getchooseMsg', '');//取消编辑的时候, 清空editTable可能传的chooseMsg值
            this.$router.go(-1);
          } else if (info.status == 200 && info.data == 'failed') {
            this.$Message.error({
              content: '添加失败',
            });
          }
        }, info => {
          // 失败的回调
          this.$Message.error({
            content: '添加失败',
          })
      })
    },
    // 取消按钮
    cancel(){
      this.$store.commit('getchooseMsg', '');//取消编辑的时候, 清空editTable可能传的chooseMsg值
      this.$router.go(-1);
    },
    //日期格式转化
    transformTime(time){
      time = new Date(time);
      let year = time.getFullYear();
      let month = time.getMonth() + 1;
      let date = time.getDate();
      let totalTime = year + '-' + month + '-' + date;
      return totalTime;
    },
    // 获取高度
    getHeight(){
      this.contHeight = (this.clientH - 64 - 74) + 'px';
//      this.height = document.querySelector('#addContainer').offsetHeight - 74 + 'px';
    },
  }
};
</script>

<style lang="scss">
  #addContainer {
  overflow-y: auto;
  height: 100%;
}
</style>
