<template>
  <div id="editContainer">
    <div class="head">
      <h2>编辑信息</h2>
    </div>
    <div class="body">
      <Form :label-width="100">
          <FormItem :label="item.title" v-for="(item, index) in editMsg" :key="index">  
              <Input v-if="item.type == 'varchar'" v-model="item.content" placeholder="Enter something..."></Input>
              <Select v-if="item.type == 'lookup'" v-model="item.content">
                  <Option v-for="(attr, i) in item.lookupContent" :key="i" :value="attr.Id">{{attr.Description}}</Option>
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
              <Input v-if="item.type == 'reference'" v-model="item.content" icon="document" placeholder="Enter something..." @on-click='getreferenceData(item.relationTable)'></Input>
              <RadioGroup v-if="item.type == 'bool'" v-model="item.content">
                  <Radio label="true">是</Radio>
                  <Radio label="false">否</Radio>
              </RadioGroup>
          </FormItem>
          <FormItem>
              <Button type="ghost" style="margin-left: 8px" @click="cancel">取消</Button>
              <Button type="primary" @click="submit">提交</Button>
          </FormItem>
      </Form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      formItem1: {
        input: "",
        select: "",
        radio: "male",
        checkbox: [],
        switch: "false",
        date: "",
        time: "",
        slider: [20, 50],
        textarea: ""
      },
      editMsg: "",//用于渲染的数据
      lookupMsg: "",
      // 以下是表格相关数据
      relationcnameTitle: "",
      tableName: "",//该条记录所在表的表名, 已获取
      relationTable: "",//与上表有关的关系表
      NorOne: "",//关系表与原表的对应关系
      // 分页的各种数据
      pageNum: "",
      // loading: true,
      total: "", //表格数据总条数
      totalBar: 0,
      pageSize: 20 //每页显示的数量
    };
  },
  created() {
    this.renderMsg();
  },
  methods: {
    // 渲染form表单数据
    renderMsg() {
      let relationTable = this.$store.state.refrelationTable;
      let chooseMsg = this.$store.state.chooseMsg;
      let editMsg = this.$store.state.editMsg; //拿到要编辑的数据
      this.tableName = editMsg.tableName; //获取到传过来的表名
      this.editMsg = editMsg.titleDatanoId;
      console.log(this.editMsg);
      console.log(chooseMsg);
      console.log(relationTable);
      if (chooseMsg) {
        this.editMsg.forEach(function (v, i) {
          if (v.type == "reference" && v.relationTable == relationTable) {
            v.content = chooseMsg.description;
            v.Id = chooseMsg.Id;
          }
        })
      }
      this.getdomainList();//一进来就为reference数据做准备
    },

    // 获取关系表名, 为下面获取关系表的数据
    getdomainList(){
      let data = '?table=' + this.tableName;
      this.$http.get('/relationController/getDomainList' + data).then(info => {
        // console.log(info.data);
        if (info.status == 200) {
          // 拿到对应的关系表之后, 取出每个reference数据对应的表
          let relationTableList = info.data;
          this.editMsg.forEach(function (v, i) {
            if (v.type == "reference") {
              relationTableList.forEach(function (val, index) {
                if (val.domainname == v.lr) {
                  v.relationTable = v.table==val.domainclass2?val.domainclass1:val.domainclass2;
                }
              })
            }
          })
        }
      })
    },
    // 获取reference数据
    getreferenceData(relationTable) {
      this.$store.commit('getrefrelationTable', relationTable);
      this.relationTable = relationTable;
      let data = "?table=" + relationTable + "&pageNum=" + this.pageNum;
      this.$http.get("/cardController/getCardList" + data).then(info => {
        if (info.status == 200) {
          let thisInfo = info;
          this.getrelationCtitle(thisInfo);
          // 跳转到editTable页面
          this.$router.push({path: 'editTable'});
        }
      });
    },
    // 获取该关系表对应的中文名
    getrelationCtitle(thisInfo){
      let data = { table: this.relationTable };
      console.log(data);
      this.$http.post('/cardController/getAttributeList', data).then(info => {
        if (info.status == 200) {
          this.relationcnameTitle = info.data;
          this.dataProcess(thisInfo);
        }
      });
    },
    //表格数据的处理
    dataProcess(info) {
      this.totalBar = info.data.totalRecord;
      let dataArr = info.data.list; //要处理和渲染的表格数据
      // 设置开头多选
      let start = {
        type: "index",
        width: 60,
        align: "center"
      };
      
      // 设置每个td的宽度(写在此处)
      let width = 200;
      //判断返回的表格数据是否有Id
      let flag = this.hasId(dataArr[0]);
      //获取表头
      // console.log(this.relationcnameTitle);
      let newtitleArr = []; //存储最终要给columns的表头数据
      newtitleArr.push(start);
      let j = 0;
      this.relationcnameTitle.forEach(function(v, i) {
        v.title = v.cname;
        v.key = ++j;
        v.width = width;
        newtitleArr.push(v);
      });
      if (flag) {
        var Id = {
          title: "Id",
          key: "Id",
          width: 200
        };
        newtitleArr.push(Id);
      }
      // 渲染表格数据
      let newcontentArr = []; //存储最终要赋给表格的数据
      dataArr.forEach(function(v, i) {
        //v表示待过滤数据中的每个对象, 一共6个对象
        let newObj = {};
        for (var key in v) {
          //key表示每个待过滤对象的键
          if (key == "Id") {
            newObj.Id = v[key];
          } else {
            newtitleArr.forEach(function(val, index) {
              //val表示表头每个字段对象
              if (key == val.attribute) {
                if (v[key] != null && typeof v[key] == "object") {
                  //如果是对象, 那么值为123
                  newObj[val.key] = v[key].Description;
                } else if (v[key] == null) {
                  newObj[val.key] = v[key];
                } else {
                  newObj[val.key] = v[key];
                }
              }
            });
          }
        }
        newcontentArr.push(newObj);
      });
      let edittableMsg = {
        columns: newtitleArr,
        data: newcontentArr,
        totalRecord: info.data.totalRecord,
      }
      this.$store.commit('getedittableMsg', edittableMsg);
    },
    // 判断返回的数据中是否包含Id
    hasId(info) {
      let flag = false;
      for (var k in info) {
        if (k == "Id") {
          flag = true;
        }
      }
      return flag;
    },

    // 模态框控制函数
    submit() {
      // this.$Message.info('Clicked ok');
    },
    cancel() {
      this.$router.push({path: '/result'});
    },
  }
};
</script>

<style lang="scss" scoped>
#editContainer {
  overflow-y: scroll;
  .head {
    h2 {
      text-align: left;
      padding-left: 55px;
      padding-top: 15px;
    }
  }
  .body {
    width: 50%;
    padding: 15px 40px 30px 20px;
    margin: 30px auto;
    .ivu-input-icon {
      cursor: pointer;
    }
  }
}
</style>
