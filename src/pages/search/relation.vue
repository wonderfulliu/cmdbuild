<template>
  <Layout>
    <div id="relationContainer">
      <Header style="padding: 0" class="layout-header-bar">
        <Form :label-width="80">
          <Row>
            <Col span="2">
              <Icon @click.native="collapsedSider" :class="rotateIcon" class="menuCtrl" type="navicon-round" size="24"></Icon>
            </Col>
            <Col class="bread" span="7">
              <Breadcrumb>
                <BreadcrumbItem to="/config/tableList">配置信息</BreadcrumbItem>
                <!-- 原表名 -->
                <BreadcrumbItem v-if="tableCname" to="">{{tableCname}}</BreadcrumbItem>
                <!-- 关系表名 -->
                <BreadcrumbItem v-if="relationTable && relationTableCname">{{relationTableCname}}</BreadcrumbItem>
                <BreadcrumbItem v-else-if="relationTable && !relationTableCname">{{relationTable}}</BreadcrumbItem>
              </Breadcrumb>
            </Col>
            <Col span="3">
              <!-- <FormItem label="查看:">
                <Select @on-change="selectN" :placeholder="placeholder" v-model="selectNow" clearable filterable not-found-text>
                  <Option v-for="(item, index) in now" :value="item.value" :key="index">{{ item.label }} </Option>
                </Select>
              </FormItem> -->
              <Dropdown class="fieldSearch" style="margin-left: 20px" trigger="click" @on-click="selectN">
                  <Button type="primary">
                      查看
                      <Icon type="arrow-down-b"></Icon>
                  </Button>
                  <DropdownMenu slot="list">
                      <DropdownItem v-for="(item, index) in now" :key="index" :name="item.value" :selected="item.selected">{{ item.label }}</DropdownItem>
                  </DropdownMenu>
              </Dropdown>
            </Col>
            <Col span="3" offset="1">
              <!-- <FormItem label="新增:">
                <Select @on-change="selectF" label-in-value v-model="selectFuture" clearable filterable>
                  <Option v-for="(item, index) in future" :value="item.value" :key="index">{{ item.label }}</Option>
                </Select>
              </FormItem>  -->
              <Dropdown class="fieldSearch" style="margin-left: 20px" trigger="click" @on-click="selectF">
                  <Button type="primary">
                      新增
                      <Icon type="arrow-down-b"></Icon>
                  </Button>
                  <DropdownMenu slot="list">
                      <DropdownItem v-for="(item, index) in future" :key="index" :name="item.value">{{ item.label }}</DropdownItem>
                  </DropdownMenu>
              </Dropdown>
            </Col>
            <Col span="3" offset="5">
              <Button type="ghost" title="返回" icon="reply" @click="back"></Button>
            </Col>
          </Row>
        </Form>
      </Header>
      <Content class="contentTable">
        <div class="contentBody">
          <Table :height="tableHeight" :columns="columns" :data="data" no-data-text="请选择要查看的数据"></Table>
        </div>
      </Content>
    </div>
  </Layout>
</template>

<script>
export default {
  data() {
    return {
      CEtableMsg: "", //中英文对照表
      relationMsg: "", //待渲染的关系数据
      preMsg: '', //上个页面出来的包含表名, 表记录id和是否禁用的信息
      domainListMsg: "", //待渲染的中间表数据
      tableId: "",//表的Id, 注意这个不是关系表的Id, 而是原表的Id
      tableName: '',// 原表表名
      tableCname: '', //原表中文名
      // now的关系表名
      relationTable: '',
      relationTableCname: '',//关系表中文名
      // 下拉框数据
      selectNow: "",
      selectFuture: "",
      domainname: '',//selectF的某个中间表名
      domainnamen: '', //selectN的某个中间表
      zhongjianbiao: '',//纯中间表
      now: [],
      placeholder: '请选择', //当 now 为空的时候, 显示的内容
      future: [],
      isdisable: '', //权限
      // 表格数据
      columns: [
        {
          title: "Description",
          key: "Description"
        },
        {
          title: "BeginDate",
          key: "BeginDate"
        },
        {
          title: "操作",
          key: "operating",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small",
                    disabled: this.isdisable
                  },
                  style: {},
                  on: {
                    click: () => {
                        this.del(params, params.index)
                    }
                  }
                },
                "删除"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginLeft: '5px'
                  },
                  on: {
                    click: () => {
                      this.relationJump(params, params.index);
                    }
                  }
                },
                "位置"
              ),
            ]);
          }
        }
      ],
      data: [],
      isExist: false,//判断该关系表是否存在
      tableHeight: '550',
    };
  },
  props: {
    ConfigTreeData: {
      type: Array
    },
    collapsedSider: {
      type: Function,
      default: null
    },
    rotateIcon: {
      type: Array,
      default: null
    },
  },
  created() {
    this.getMsg();
    // 获取下 relationTableCname
    if (this.$store.state.relationTableCE) {
      
    }
  },
  methods: {
    // 获取到公共仓库的数据: 表Id 表名 关系表表名与内容---1
    getMsg() {
      this.CEtableMsg = JSON.parse(sessionStorage.getItem("gettableMsg")); //获取中英文对照表名
      this.preMsg = this.$store.state.relationMsg; //获取到待渲染的关系数据
      console.log(this.preMsg);
      this.tableName = this.preMsg.tableName;//原表表名
      this.tableCname = this.EtoC(this.CEtableMsg, this.tableName);
      this.tableId = this.preMsg.Id;//原表的纪录的Id
      this.isdisable = this.preMsg.disabled;//关系的权限状态
      this.getrelationMsg();//获取到表名和id后在请求已经关联的表和相应的记录
    },
    // 获取和选中记录有关系表的表和表中有关系的记录
    getrelationMsg(){
      let data = { table: this.tableName, Id: this.tableId };
      this.$http.post('/relationController/getRelationList', data).then(info => {
        this.relationMsg = info.data;
        this.getDomainList();//本函数和this.relationMsg本身没什么关系, 只不过该函数中要调用的函数需要用到this.relationMsg, 所以这个函数写在这里
      })
    },
    // 一进入页面, 就请求表的关系表的数据, 获取到的是中间表, 需要处理数据获取到关系表
    getDomainList() {
      let data = "?table=" + this.tableName;
      this.$http.get("/relationController/getDomainList" + data).then(info => {
        if (info.status == 200 && Object.keys(info.data).length != 0) {
          // 找到关系表名, 找到n:1关系, 找到中文名, 并且拼在英文表名后面
          this.zhongjianbiao = info.data;//中间表集合, 里面的 v.domainname 是中间表名字, 与该条记录有关的表的集合
          let relationArr = [];//用来存储与该表的该条纪录有关系的表(多)
          info.data.forEach((v, i) => {
            let obj = {};//用来存储与该表的该条纪录有关系的表(单)
            let NandOne = v.domaincardinality.split(":"); //这是个数组, 存储的是表与关系表的 N:N 关系
            if (this.tableName == v.domainclass2) {
              obj.relationTable = v.domainclass1;//关系表名
              obj.crelationTable = this.EtoC(this.CEtableMsg, v.domainclass1, v.domainname);//关系表中文名, 用于渲染
              obj.domainname = v.domainname;//中间表名
              obj.NorOne = NandOne[0];//关系表与该表对应的关系
            } else {
              obj.relationTable = v.domainclass2;
              obj.crelationTable = this.EtoC(this.CEtableMsg, v.domainclass2, v.domainname);
              obj.domainname = v.domainname;
              obj.NorOne = NandOne[1];
            }
            relationArr.push(obj);
          });
          this.domainListMsg = relationArr;//所有表的关系表详情的集合, 新增关系的时候会用得到
          this.$store.commit('getdomainlistMsg', info.data);
          this.getfutureSelectdata();//没有放在getMsg里面时因为获取不到this.domainListMsg的数据
          this.getnowSelectdata();
        } else if (info.status == 200 && Object.keys(info.data).length == 0) {
          this.$Message.error({
            content: "没有对应的关系表"
          });
        }
      });
    },
    // 获取future select数据---2
    getfutureSelectdata(){
      let data = this.domainListMsg;
      let future = [];
      data.forEach((v, i) => {
        let obj = {};
        obj.value = v.relationTable + '_' + v.NorOne;
        obj.label = v.crelationTable;
        future.push(obj);
      })
      this.future = future;
    },
    // 获取now select框数据---2
    getnowSelectdata(){
      let data = this.relationMsg;
      let now = [];
      // 因为没有关系时也能跳转过来, 所以传来的数据可能为空
      if (Object.keys(data).length != 0) {
        for (let k in data) {
          let obj = {};
          this.domainListMsg.forEach((v, i) => {
            if (v.domainname == k.split('Map_')[1]) {
              obj.value = k.split('Map_')[1];
              obj.label = v.crelationTable;//用到 this.domainListMsg 的原因就是要获取带有中文名的数据 crelationTable
            }
          })
          now.push(obj);
        }
        this.now = now;
        // console.log(this.relationTableCname);
        // 此处首次获取到this.now, 默认显示第一个关系表的纪录
        if (this.now.length != 0 && !this.$store.state.relationTableCE) {
          this.selectN(this.now[0].value);
        } else {
          this.selectN(this.$store.state.relationTableCE);
          this.$store.commit('getRtcname', '');
        }
      } else {
        this.placeholder = '暂无数据';
      }
    },
    // 查看下拉框变化时触发---3
    selectN(value){
      this.domainListMsg.forEach((v, i) => {
        if (v.domainname == value) {
          this.relationTable = v.relationTable;
        }
      })
      // 获取关系表的中文名, 为了渲染面包屑
      for(let k in this.CEtableMsg) {
        if (k == this.relationTable) {
          this.relationCtable = this.CEtableMsg[k];
        }
      }
      this.getTabledata(value);
      this.relationTableCname = this.EtoC(this.CEtableMsg, this.relationTable);
    },
    // 添加数据下拉框变化的时候---3
    selectF(value){
      let relationTable = value.substring(0, value.length - 2);
      let NorOne = value.substring(value.length - 1, value.length);
      let userea;
      this.domainListMsg.forEach((v, i) => {
        if (relationTable == v.relationTable) {
          this.domainname = v.domainname;//关系表名, 下面请求表格详细数据的时候要用
          userea = v.domainname;
        }
      })
      
      this.$store.commit('getRtcname', userea);// 待编辑的关系表明存到公共仓库中, 方便添加完关系之后显示当前添加的页面
      this.getrefctMsg(relationTable, NorOne);
      this.getrefMsg(relationTable, NorOne);
    },
    // 获取查看表格数据
    getTabledata(tableName) {
      // 根据传入的关系表的表名, 查找对应的信息
      let data = this.relationMsg; //有关系的表
      let arr = [];
      for (let k in data) { 
        if (k.split('Map_')[1] == tableName) {
          this.domainnamen = k.split('Map_')[1]; //选中的要显示的关系表, 删除关系时会用到
          data[k].forEach(function(v, i) {
            let obj = {};
            obj.Description = v.Description;
            obj.BeginDate = v.BeginDate;
            obj.Id = v.Id;
            arr.push(obj);
          });
        }
      }
      this.data = arr;
    },

    //点击选中的关系表, 请求数据, 并且根据 N:1 关系判断表格是单选还是多选
    // 获取reference表头中文名数据---4
    getrefctMsg(relationTable, num) {
      let data = { table: relationTable };
      this.$http.post("/cardController/getAttributeList", data).then(info => {
        if (info.status == 200) {
          this.reftitleMsg = info.data;
          if (this.reftableMsg) {
            let refMsg = {
              reftitleMsg: this.reftitleMsg,
              reftableMsg: this.reftableMsg,
              relationTable: relationTable,
              NorOne: num,
              tableId: this.tableId
            };
            this.$store.commit("getrefMsg", refMsg); //不论哪个函数先执行, 都会只执行一次
            this.$router.push({ path: "/config/relationTable" }); //两个数据都拿到之后再推送
          }
        }
      });
    },
    // 获取reference表格数据---4
    getrefMsg(relationTable, num) {
      let data = "?table=" + relationTable + '&domain=' + this.domainname;
      this.$http.get("/cardController/getRelationCardList" + data).then(info => {
        if (info.status == 200) {
          this.reftableMsg = info.data;
          if (this.reftitleMsg) {
            let refMsg = {
              reftitleMsg: this.reftitleMsg,
              reftableMsg: this.reftableMsg,
              relationTable: relationTable,
              NorOne: num,
              tableId: this.tableId
            };
            this.$store.commit("getrefMsg", refMsg); //不论哪个函数先执行, 都只会执行一次
            this.$router.push({ path: "/config/relationTable" }); //两个数据都拿到之后再推送
          }
        }
      });
    },
    // 删除
    del(value, index){
      let thisId;//要删除的关系的Id
      let Description = value.row.Description;//描述信息
      let data = this.relationMsg;// 所有已经产生关联的关系表
      let tableName = this.tableName;//表名
      // console.log(Description);
      // 找出要删除的关系的Id
      for(let k in data){
        if (this.domainnamen == k.split('Map_')[1]) {
          data[k].forEach((v, i) => { //data[k]指要显示的关系表, 里面有 N 条记录
            if (v.Description == Description) {
              thisId = v.Id;
            }
          })
        }
      }
      // 找出要发送给后台的数据
      let delData = {};
      this.zhongjianbiao.forEach((v, i) => {
        if (v.domainname == this.domainnamen) {
          if (v.domainclass1 == tableName) {
            delData = {domainname: this.domainnamen, idobj1: this.tableId, idobj2: thisId};
          }
          if (v.domainclass2 == tableName) {
            delData = {domainname: this.domainnamen, idobj1: thisId, idobj2: this.tableId};
          }
        }
      })
      this.$http.delete('/relationController/relation', {data: delData}).then(info => {
        if (info.status == 200) {
          if (info.data == 'ok') {
            // 删掉双向绑定中的数据
            this.data.forEach((v, i) => {
              if (v.Description == Description) {
                this.data.splice(i, 1);
              }
            })
            // 删掉双向绑定的原数据
            for (let k in this.relationMsg) {
              if (k.split('Map_')[1] == delData.domainname) {
                this.relationMsg[k].forEach((v, i) => {
                  if (v.Description == Description) {
                    this.relationMsg[k].splice(i, 1);
                  }
                });
              }
            }
            this.$Message.success({
              content: '删除成功'
            })
          } else if (info.data == "failed") {
            this.$Message.error({
              content: '删除失败'
            })
          }
        }
      })
    },
    // 关系记录跳转到对应表的所在的位置
    relationJump(value){
      // 参数是为了获取记录的 id
      // 先查看是否能看到这张表
      this.gettableEname(this.ConfigTreeData, this.relationCtable);
      if (!this.isExist) {
        this.$Message.warning('您暂无权限查看该表');
        return false;//如果表不存在, 那么不进行跳转
      }
      let relationCtable = '';//存储中文表名
      let pageNum = 1;//存储记录所在的页数
      let jiluId = value.row.Id;//最终定位该条记录的位置
      //1.根据英文表名, 获取中文表名, 方便跳转后侧边栏的搜索
      for(let k in this.CEtableMsg){
        if (k == this.relationTable) {
          relationCtable = this.CEtableMsg[k];
        }
      } 
      
      let data = '?table=' + this.relationTable + '&pageSize=20&id=' + value.row.Id;
      this.$http.get('/cardController/getPageCardByIndex' + data).then(info => {
        // console.log(info);
        if (info.status == 200) {
          pageNum = info.data;
          let msg = {
            relationCtable: relationCtable,//侧边栏搜索使用
            pageNum: pageNum,// 分页跳转使用
            jiluId: jiluId//最终定位使用
          }
          this.$emit('sTof', msg);
          this.$router.push({ path: "/config/tableList" });
        }
      })
    },
    // 工具函数
    // 拼接中英文名字, 返回的是中间表英文名与关系表的中文名
    EtoC(CEtable, ename, domainname) {
      let cEname;
      for (let k in CEtable) {
        if (ename == k) {
          if (domainname) {
            cEname = domainname + `(` + CEtable[k] + `)`;
          } else {
            cEname = CEtable[k];
          }
        }
      }
      return cEname;
    },
    // 返回按钮
    back() {
      this.$router.push({path: '/config/tableList'});
    },
    // 获取对应表的英文名
    gettableEname(tableMenu, tableCname){
      tableMenu.forEach((v, i) => {
        if (v.children && v.children.length > 0) {
          this.gettableEname(v.children, tableCname);
        } else {
          if (v.title == tableCname) {
            // 找到了
            this.isExist = true;
          }
        }
      })
    },
    // 高度自适应
    heightAdaptive() {
      this.contentH =  this.clientH - 65 +'px';
      this.contentbodyH = this.clientH - 138 + 'px';
      this.tableHeight = this.clientH - 222; //64:导航高；140：包括搜索, margin-top, 分页所在区域高
    },
  }
};
</script>

<style lang="scss">
#relationContainer {
  .ivu-layout-header{
    .ivu-form{
      .ivu-col{
        .ivu-form-item{
          margin-bottom: 0px;
          padding-top: 15px;
        }
      }
    }
  }
  .ivu-breadcrumb{
    text-align: left;
    margin-left: 20px;
  }
  .ivu-form-item-label{
    padding: 10px 0 10px 10px;
    margin-left: 5px;
    width: 50px !important;
    text-align: left;
  }
  .ivu-form-item-content{
    margin-left: 55px !important;
  }
}
</style>
