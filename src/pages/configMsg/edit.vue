<template>
  <Layout>
    <div id="editContainer">
      <Header class="layout-header-bar">
        <Row>
          <Col span="6" offset="1">
            <h3 style="text-align: left">编辑信息 </h3>
          </Col>
          <Col span="12" offset="5">
          <div class="floatRight">
            <Button type="primary" style="margin-right: 8px" @click="cancel">取消</Button>
            <Button type="success" @click="submit">提交</Button>
          </div>
          </Col>
        </Row>
      </Header>
      <Content class="contentForm">
        <Form :label-width="100" class="formContainer">
          <FormItem :label="item.cname" v-for="(item, index) in editMsg" :key="index" v-if="item.title != 'Id'">
            <Input v-if="item.type == 'varchar'" v-model="item.content" placeholder="Enter something..."></Input>
            <Select v-if="item.type == 'lookup'" v-model="item.content">
              <Option v-for="(attr, i) in item.lookupMsg" :key="i" :value="attr.Id">{{attr.Description}}</Option>
            </Select>
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
          <!--<FormItem>
            <Button type="primary" style="margin-left: 8px" @click="cancel">取消</Button>
            <Button type="success" @click="submit">提交</Button>
          </FormItem>-->
        </Form>
      </Content>
    </div>
  </Layout>
</template>
<script>
export default {
  data() {
    return {
      editMsg: "",//用于渲染的数据
      tableName: '',//表名
      reftableMsg: '',//传到下一页的表格数据
      reftitleMsg: '',//传到下一页的表头中文名数据
      chooseMsg: '',//存储editTable页面传来的数据
      jiluId: '',//记录id
    };
  },
  created() {
    this.getchooseMsg();
    this.getaddMsg();
  },
  mounted () {
    this.getHeight();
  },
  methods: {
    // 获取公共仓库的要渲染的数据
    getaddMsg(){
      this.editMsg = this.$store.state.addMsg.titleMsg;//待渲染的数据
      // console.log(this.$store.state.addMsg.titleMsg);
      this.jiluId = this.$store.state.addMsg.Id;//获取记录id
      this.tableName = this.$store.state.addMsg.tableName;//表名
      if (this.chooseMsg) {//如果有editTable中被选中的数据, 将变化的数据更新至双向绑定的数据
        this.editMsg.forEach((v, i) => {
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
            this.$router.push({path: 'editTable'});//两个数据都拿到之后再推送
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
            this.$router.push({path: 'editTable'});//两个数据都拿到之后再推送
          }
        }
      });
    },

    // 当从editTable页面跳回时传来的数据
    getchooseMsg(){
      this.chooseMsg = this.$store.state.chooseMsg;
    },

    // 模态框控制函数
    submit() {
      let data = {};
      data.table = this.tableName;
      data.Id = this.jiluId;
      // console.log(this.editMsg);
      this.editMsg.forEach((v, i) => {
        if (v.attribute) {
          if (v.type == "reference" && v.Id) {
            data[v.attribute] = v.Id;
          } else if (v.type == "lookup" && typeof v.content === 'number') {
            data[v.attribute] = v.content;
          } else if (v.type == "date" && v.content) {
            data[v.attribute] = this.transformTime(v.content);
          }
          else if (v.type != "reference" && v.type != "lookup" && v.type != "date") {
            data[v.attribute] = v.content;
          }
        } else {
          data[v.title] = v.content;
        }
      })
      
      // console.log(data);
      // return false;
      // console.log(JSON.stringify(data));
      this.$http.put('/cardController/card', data).then(info => {
          // console.log(info);
        // 成功的回调
        if (info.status == 200 && info.data == 'ok') {
          this.$Message.success({
            content: '修改成功',
          });
          this.$store.commit('getchooseMsg', '');//取消编辑的时候, 清空editTable可能传的chooseMsg值
          this.$router.go(-1);
        } else {
          this.$Message.error({
            content: '修改失败',
          })
        }
      }, info => {
        // 失败的回调
        this.$Message.error({
          content: '修改失败',
        })
      })
    },
    cancel() {
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
      this.height = document.querySelector('#addContainer').offsetHeight - 74 + 'px';
    },
  }
};
</script>

<style lang="scss" scoped>
#editContainer {
  overflow-y: auto;
  height: 100%;
  
}
</style>
