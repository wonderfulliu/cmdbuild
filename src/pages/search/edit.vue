<template>
  <div id="editContainer">
    <div class="head">
      <h2>编辑信息</h2>
      <Button type="primary" @click="backWard">
          <Icon type="chevron-left"></Icon>
          Backward
      </Button>
    </div>
    <div class="body">
      <Form :model="formItem" :label-width="100">
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
              <Input v-if="item.type == 'reference'" v-model="item.content" icon="document" placeholder="Enter something..." @on-click='getreferenceData'></Input>
              <RadioGroup v-if="item.type == 'bool'" v-model="item.content">
                  <Radio label="true">是</Radio>
                  <Radio label="false">否</Radio>
              </RadioGroup>
          </FormItem>
          <FormItem>
              <Button type="primary">提交</Button>
              <Button type="ghost" style="margin-left: 8px">取消</Button>
          </FormItem>
      </Form>
    </div>
    <Modal v-model="modal" title="请选择" width='900' @on-ok="ok" @on-cancel="cancel">
      <Table :loading='loading' stripe height="300" border ref="selection" :columns="columns" :data="data"></Table>
    </Modal>
  </div>
</template>
<script>
export default {
  data() {
    return {
      columns: [],
      data: [],
      formItem: {
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
      editMsg: "",
      lookupMsg: "",
      modal: false,
      // 以下是表格相关数据
      relationcnameTitle: "",
      tableName: "",//该条记录所在表的表名, 已获取
      relationTable: "",//与上表有关的关系表
      NorOne: "",//关系表与原表的对应关系
      // 分页的各种数据
      pageNum: "",
      loading: true,
      total: "", //表格数据总条数
      totalBar: 0,
      pageSize: 20 //每页显示的数量
    };
  },
  created() {
    this.getlookupMsg();
    this.renderMsg();
    this.getdomainList();
  },
  methods: {
    // 返回按钮事件
    backWard() {
      this.$router.go(-1);
    },
    // 渲染form表单数据
    renderMsg() {
      let editMsg = this.$store.state.editMsg; //拿到要编辑的数据
      let IdtitleData = editMsg.titleData.slice(
        0,
        editMsg.titleData.length - 1
      ); //arr 删除最后一个action
      let titleData = IdtitleData.slice(0, IdtitleData.length - 1); //arr 删除最后id
      this.tableName = editMsg.tableName; //获取到传过来的表名
      let contentData = editMsg.contentData; //obj
      let lookupMsg = this.lookupMsg;

      for (var k in contentData) {
        if (k != "Id") {
          titleData[k - 1].content = contentData[k];
        }
      }
      // 添加lookup数据
      titleData.forEach(function(v, i) {
        if (v.type == "lookup") {
          for (var k in lookupMsg) {
            if (k == v.attribute) {
              v.lookupContent = lookupMsg[k];
            }
          }
        }
        if (v.type == "bool") {
          v.content = v.content == true ? "true" : "false";
        }
      });
      this.editMsg = titleData;
      // console.log(titleData);
    },
    // 获取到lookup数据
    getlookupMsg() {
      this.lookupMsg = this.$store.state.lookupMsg;
    },

    // 获取关系表名
    getdomainList(){
      let data = '?table=' + this.tableName;
      this.$http.get('/relationController/getDomainList' + data).then(info => {
        if (info.status == 200) {
          let middleTable = info.data[0];
          let NandOne = middleTable.domaincardinality.split(':');
          // 取出跟这张表有关系的表的名字, 还要注意n:1的关系
          if (middleTable.domainclass2 == this.tableName) {
            this.relationTable = middleTable.domainclass1;
            this.NorOne = NandOne[0];
          } else {
            this.relationTable = middleTable.domainclass2;
            this.NorOne = NandOne[1];
          }
          this.getrelationCtitle();
        }
      })
    },
    // 获取该关系表对应的中文名
    getrelationCtitle(){
      let data = { table: this.relationTable };
      this.$http.post('/cardController/getAttributeList', data).then(info => {
        if (info.status == 200) {
          this.relationcnameTitle = info.data;
        }
      });
    },
    // 获取模态框中的reference数据
    getreferenceData() {
      this.modal = true; //显示模态框
      let data = "?table=" + this.relationTable + "&pageNum=" + this.pageNum;
      this.$http.get("/cardController/getCardList" + data).then(info => {
        if (info.status == 200) {
          console.log(info.data);
          console.log();
          this.dataProcess(info);
        }
      });
    },
    //表格数据的处理
    dataProcess(info) {
      this.totalBar = info.data.totalRecord;
      let dataArr = info.data.list; //要处理和渲染的表格数据
      // 设置开头多选
      let start = {
        type: "selection",
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
      // newtitleArr.push(end);
      this.columns = newtitleArr; //将获取到的表头字段赋值给table的columns
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
      this.data = newcontentArr;
      this.loading = false;
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
    ok() {
      // this.$Message.info('Clicked ok');
    },
    cancel() {
      // this.$Message.info('Clicked cancel');
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
