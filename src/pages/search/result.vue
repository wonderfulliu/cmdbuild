<template>
  <div id="searchforContainer">
    <Layout>
      <!-- 侧边栏 -->
      <Sider ref="side1" hide-trigger collapsible width="240" :collapsed-width="0" v-model="isCollapsed">
        <Menu theme="dark"
              width="auto"
              :class="menuitemClasses"
              :active-name="menuIndex"
              :style="{height:menuContentH,overflowY:'auto'}">
            <MenuItem :key="index"
                      :name="['1-']+[index+1]"
                      style="padding-left: 25px"
                      v-for="(item, index) in sideMenuData"
                      @click.native="menuSelected(item, index)">
              {{item.Description}}
            </MenuItem>
        </Menu>
      </Sider>
      <!-- 内容区域 -->
      <Layout :style="{height:contentbodyH}">
        <Header class="layout-header-bar">
          <Row>
            <Col span="1">
              <Icon @click.native="collapsedSider" :class="rotateIcon" :style="{margin: '20px 20px 0'}" type="navicon-round" size="24"></Icon>
            </Col>
          </Row>
        </Header>
        <Content>
          <div class="contentBody" style="position: relative;">
            <Table border
                   stripe
                   ref="table"
                   size="small"
                   no-data-text=""
                   @on-row-click="getrowMsg"
                   :height="tableHeight"
                   :highlight-row="highlight"
                   :columns="columns"
                   :data="data"></Table>
            <Spin fix v-show="loading">
              <Icon type="load-a" size=18 class="spinLoading"></Icon>
              <div>Loading</div>
            </Spin>
            <div style="line-height: 64px;height:auto;">
              <Row>
                <Col :xs="{span:23,offset:1}" :sm="{span:23,offset:1}" :md="{span:12,offset:1}" :lg="{span:14,offset:1}" style="text-align: left">
                  <ButtonGroup>
                    <Button type="ghost" title="" icon="ios-eye" @click="show">查看</Button>
                    <Button type="ghost" title="" icon="ios-compose-outline" @click="edit" :disabled='isdisable'>编辑</Button>
                    <Button type="ghost" title="" icon="ios-plus-empty" @click="add" :disabled='isdisable'>新增</Button>
                    <Button type="ghost" title="" icon="ios-trash-outline" @click="remove" :disabled='isdisable'>删除</Button>
                    <Button type="ghost" title="" icon="ios-download-outline" @click="exportData">下载</Button>
                    <Button type="ghost" title="" icon="location" @click="relationJump">跳转</Button>
                    <!-- <Button type="ghost" title="历史" icon="ios-paper-outline" @click="ctrlHistory"></Button>
                    <Button type="ghost" title="关系" icon="ios-infinite" @click="ctrlRelete"></Button> -->
                  </ButtonGroup>
                </Col>
                <Col :xs="{span:23,offset:1}" :sm="{span:23,offset:1}" :md="{span:10}" :lg="{span:8}" style="text-align: right">
                  <Row>
                    <Col span="6">
                      共 {{ totalBar }} 条
                    </Col>
                    <Col span="2">
                      <!--<Button type="text" icon="chevron-left" @click="pageFirst" :disabled="firstCl" title="首页"></Button>-->
                      <button title="首页" type="button" class="pageBtn" :class="{'disableBtn':firstCl}" :disabled="firstCl" @click="pageFirst">
                        <i class="zIcon firstPage"></i>
                      </button>
                    </Col>
                    <Col span="14" style="width: 190px;text-align: center">
                    <Page simple
                          show-total
                          :page-size=20
                          :total="totalBar"
                          :current="pageNum"
                          @on-change="pageChange"></Page>
                    </Col>
                    <Col span="2">
                      <!--<Button type="text" icon="chevron-right" @click="pageLast" :disabled="lastCl" title="尾页"></Button>-->
                      <button title="尾页" type="button" class="pageBtn" :class="{'disableBtn':lastCl}" :disabled="lastCl" @click="pageLast">
                        <i class="zIcon lastPage"></i>
                      </button>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>
          </div>
        </Content>
      </Layout>
    </Layout>
    <Modal v-model="modal" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>删除提示</span>
      </p>
      <div style="text-align:center">
        <p>该记录删除后无法恢复</p>
        <p>是否确认删除?</p>
      </div>
      <div slot="footer">
        <Button type="error" size="large" long @click="del()">删除</Button>
      </div>
    </Modal>
    <!-- 显示详情 -->
    <Modal v-model="resultViewModal" :closable="false">
      <p slot="header">
        <span>查看记录</span>
      </p>
      <div class="modalBody" :style="{maxHeight:modalMaxHeight}">
        <Row v-if="resultViewData.length >= 20">
          <Col span="12">
          <ul>
            <li v-if="index%2==0" v-for="(item ,index) in resultViewData" :key="index">{{ item.Description }} : {{ item.value }}</li>
          </ul>
          </Col>
          <Col span="12">
          <ul>
            <li v-if="index%2!=0" v-for="(item ,index) in resultViewData" :key="index">{{ item.Description }} : {{ item.value }}</li>
          </ul>
          </Col>
        </Row>
        <Row v-if="resultViewData.length < 20">
          <Col span="24">
          <ul>
            <li v-for="(item ,index) in resultViewData" :key="index">{{ item.Description }} : {{ item.value }}</li>
          </ul>
          </Col>
        </Row>
      </div>
      <div slot="footer">
        <Button type="primary" @click="ViewModalCancel">关闭</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tableName: "",
      tableCname: '',
      sideMenuData: [],//侧栏菜单全部数据
      ids: "",
      pageNum: 1,
      pageSize: 20, //每页显示的数量
      totalPage: "", //总页数
      totalBar: 0,//总条数
      searchMsg: "",
      isCollapsed: false,
      // 表格列
      columns: [],
      // 表格详细数据
      data: [],
      lookupMsg: "",
      loading: true,
      cnameTitle: "", // 存储表头中英文对照信息
      relationTable: "",
      Mode: "", //权限
      Authority: "", //权限表
      isdisable: "", //是否禁用
      contentbodyH: "", //内容区域高度
      tableHeight: "", //表格高度
      isClick: false, //判断行是否被点击
      index: "" ,//存储被点击的行的序列(就是点击了哪一行)
      highlight: true,//选中行高亮
      //设置
      menuIndex: sessionStorage.getItem('searchMenuIndex'),    //侧栏默认选中对应索引
      firstCl: true,//首页是否禁用
      lastCl: false,//尾页是否禁用
      clickWhichone: 0,// 点击侧边栏哪个表格
      menuContentH: "",//侧栏高度
      modalMaxHeight: "",//模态框内容高度
      //modal
      resultViewModal: false,//详情模态框是否显示
      resultViewData: [],   //记录详情
      modal: false,
      delData: {
        delData: "",
        index: ""
      }, //删除的数据
      isExist: false,//判断该关系表是否存在
      recordId: '', // 被点击的记录的 id, 用于跳转
    };
  },
  created() {
    let searchMenuIndex = sessionStorage.getItem('searchMenuIndex')
    if(!searchMenuIndex){
      sessionStorage.setItem('searchMenuIndex', "1-1");
    }
    this.getAuthority();
    this.getasideMsg();
    this.heightAdaptive();
  },
  mounted () {
    let _this = this;
    window.onresize = () => {
      _this.heightAdaptive();
    }
  },
  computed: {
    rotateIcon() {
      return ["menu-icon", this.isCollapsed ? "rotate-icon" : ""];
    },
    menuitemClasses() {
      return ["menu-item", this.isCollapsed ? "collapsed-menu" : ""];
    }
  },
  methods: {
    //点击侧栏获取表信息
    menuSelected(msg, index){
      this.menuIndex = "1-" + (index + 1);
      sessionStorage.setItem('searchMenuIndex', "1-" + (index + 1))
      // console.log(this.menuIndex);
      //console.log(msg.Description);//获取中文表名
      //console.log(msg.idElementClass);//获取英文表名
      // 把点击的表的序列存入公共仓库
      this.$store.commit('getIndex', index);
      // 获取到点击的表的中文名
      this.tableCname = msg.Description;
      // 单击侧边栏时, 分页改为1
      this.pageNum = 1;
      // 更新完表名后再获取权限
      this.tableName = msg.idElementClass.replace(/\"/g, "");
      this.ids = msg.recordIdes;

      // 获取表格权限
      this.Authority.forEach((v, i) => {
        if (v.table_name == this.tableName) {
        this.Mode = v.Mode;
      }
      });
      // console.log(this.Mode);
      // 判断是否禁用
      this.isdisable = this.Mode == "r" ? true : false;
      this.getcnameTitle();
      this.gettableMsg();
      this.getSelect();
      this.getrelationTable();
    },
    //表格数据的处理
    dataProcess(info) {
      this.totalBar = info.data.totalRecord;
      this.totalPage = info.data.totalPage;
      let dataArr = info.data.list; //要处理和渲染的表格数据
      // 设置表格宽度
      let len = this.cnameTitle.length;
      let theadWidth = document.querySelector(".ivu-table-wrapper .ivu-table-header").offsetWidth + 240 - 17;
      let width = theadWidth / len > 150 ? theadWidth / len : 150;
      this.cnameTitle.forEach((v, i) => {
        v.width = width;
      });
      //获取表头
      let newtitleArr = []; //存储最终要给columns的表头数据
      let j = 0;
      // console.log(this.cnameTitle);
      this.cnameTitle.forEach(function(v, i) {
        v.title = v.cname;
        v.key = ++j;
        v.width = width;
        v.ellipsis = true;
        newtitleArr.push(v);
      });
      // 表头字段排序
      newtitleArr.sort(function(a, b) {
        return Number(a.position) - Number(b.position);
      });

      // console.log(newtitleArr);
      this.columns = newtitleArr; //将获取到的表头字段赋值给table的columns
      this.initTableColumn(this.columns);
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
    // 获取侧边栏数据
    getasideMsg() {
      //给侧边栏赋search页面传来的侧边栏数据
      // 应该是进入该表后遍历所有侧边栏数据, 显示selected的那一项
      this.sideMenuData = this.$store.state.searchMsg
        ? this.$store.state.searchMsg
        : JSON.parse(sessionStorage.getItem("searchMsg"));
      // 刚进来, 先获取公共仓库的存储的数据, 判断选中哪一个表(是方便编辑等操作返回时还在原来的表上)
      this.clickWhichone = this.$store.state.clickWhichone;
      this.sideMenuData.forEach((v, i) => {
      if (i == this.clickWhichone) {
          this.tableCname = v.Description;
          this.tableName = v.idElementClass.replace(/\"/g, "");
          this.ids = v.recordIdes;

          // 刚进来的时候也要获取一下权限, 因为没有点击侧边栏
          this.Authority.forEach((v, i) => {
            if (v.table_name == this.tableName) {
              this.Mode = v.Mode;
            }
          });
          this.isdisable = this.Mode == "r" ? true : false;
        }
      });

      this.getcnameTitle();
      this.gettableMsg();
      this.getSelect(); //防止刚进来的时候没有lookup数据
      this.getrelationTable();
    },
    // 获取表格数据
    gettableMsg() {
      this.loading = true;
      let data =
        `?table=` +
        this.tableName +
        `&ids=` +
        this.ids +
        `&pageNum=` +
        this.pageNum +
        `&pageSize=` +
        this.pageSize;
      this.$http
        .get("/luceneController/pageSearch" + data)
        .then(info => {
            if (info.status == 200) {
              // console.log(info.data);
              this.dataProcess(info);
            }
          },
        )
        .catch(error => {
          console.log(error);
        });
    },
    // 点击侧边栏每个表触发的事件
    getSelectedNodes(value) {
      // console.log(value);
      // 获取到点击的表的中文名
      this.tableCname = value[0].title;
      // 单击侧边栏时, 分页改为1
      this.pageNum = 1;
      // 更新完表民后再获取权限
      for (var k in value[0]) {
        this.tableName = k.replace(/\"/g, "");
        this.ids = value[0][k];
        break; //只获取第一个键与值
      }

      // 获取表格权限
      this.Authority.forEach((v, i) => {
        if (v.table_name == this.tableName) {
          this.Mode = v.Mode;
        }
      });
      // console.log(this.Mode);
      // 判断是否禁用
      this.isdisable = this.Mode == "r" ? true : false;
      this.getcnameTitle();
      this.gettableMsg();
      this.getSelect();
      this.getrelationTable();
    },
      // 获取不同表格的表头字段所对应的中文名结合(需要筛选)
    getcnameTitle() {
      let data = { table: this.tableName };
      this.$http.post("/cardController/getAttributeList", data).then(info => {
        if (info.status == 200) {
          // console.log(info.data);
          this.cnameTitle = info.data;
        }
      });
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
    // 页面跳转
    pageChange(page) {
      this.pageNum = page;
      this.pageDisabled();
      this.gettableMsg();
    },
    pageDisabled(){
      if(this.pageNum == 1){
        this.firstCl = true;
        this.lastCl = false;
      }else if(this.pageNum == this.totalPage){
        this.firstCl = false;
        this.lastCl = true;
      }else {
        this.firstCl = false;
        this.lastCl = false;
      }
    },
    pageFirst() {
      this.pageNum = 1;
      this.pageDisabled();
      this.gettableMsg();
    },
    pageLast() {
      this.pageNum = this.totalPage;
      this.pageDisabled();
      this.gettableMsg();
    },
    // 侧边栏收起功能
    collapsedSider() {
      this.$refs.side1.toggleCollapse();
    },
    // 点击表格每一行获取一些信息
    getrowMsg(value, index) {
      this.recordId = value.Id;
      this.isClick = true;
      this.index = index;
    },
    // 表详情展示
    show() {
      if (this.isClick == true) {
        let newArrc = [];
        for (let i = 0; i < this.columns.length; i++) {
          let newObjc = {};
          newObjc.Description = this.columns[i].title;
          newObjc.value = this.data[this.index][i + 1];
          newArrc.push(newObjc);
        }
        this.resultViewData = newArrc;
        this.resultViewModal = true;
      } else {
        this.$Message.error({
          content: "您未选中行！"
        });
      }
    },
    ViewModalCancel(){
      this.resultViewModal = false;
      this.resultViewData = '';
    },
    // 删除提示
    remove() {
      if (this.isClick == true) {
        this.modal = true;
        //先发送请求, 根据返回的结果判断是否删除成功
        let data = "?table=" + this.tableName + "&Id=" + this.data[this.index].Id;
        this.delData.delData = data;
        this.delData.index = this.index;
      } else {
        this.$Message.error({
          content: '您未选中行!'
        })
      }

    },
    //实现删除
    del() {
      this.modal = false;
      this.$http
        .delete("/cardController/card" + this.delData.delData)
        .then(info => {
          // console.log(info);//删除的info
          if (info.status == 200) {
            if (info.data == "ok") {
              this.$Message.success({
                //提示用户删除成功
                content: "删除成功"
              });
              this.data.splice(this.delData.index, 1); //删除该元素
              // 重新获取数据
              this.gettableMsg();
            } else {
              this.$Message.error({
                content: "删除失败"
              });
            }
          }
        });
    },
    // 获取lookup数据
    getSelect() {
      let newlookup = {};
      let _this = this;
      if (this.tableName == 'WAN_Line') {
        this.$http.post('/relationController/lookupQuery' + '?lookup=WAN_LINE.BUSINESS_TYPE').then(info => {
          newlookup.BusinessType = _this.transformObj(info.data);
        })
      }
      let data = "?table=" + this.tableName;
      this.$http.post("/relationController/getLookuplistByTable" + data).then(info => {
        if (info.status == 200) {
          for(let i in info.data){
            newlookup[i] = _this.transformObj(info.data[i]);
          }
          this.lookupMsg = newlookup;
        }
      });
    },
    // 处理 lookup 数据
    transformObj(arr){
      let arrb = [];
      arr.forEach((v, i) => {
        let obja = {};
        if(v.Description){
          obja.label = v.Description;
        }
        obja.value = v.Id;
        if(v.child){
          obja.children =[];
          if(v.child.length != 0){
            obja.children = this.transformObj(v.child);
          }
        }
        arrb.push(obja);
      });
      return arrb;
    },
    // 下载功能
    exportData() {
      let data = "?ids=" + this.ids + "&table=" + this.tableName;
      // console.log(data);
      this.$http.get("/cardController/downLoadExcelByIds" + data).then(
        info => {
          if (info.status == 200) {
            window.open("/cardController/downLoadExcelByIds" + data, "_self");
          }
        },
        info => {
          console.log(info);
        }
      );
    },
    // 编辑功能
    edit() {
      if (this.isClick == true) {
        // 获取到表头的数据(主要获取改数据的格式), 并处理action
        let titleMsg = this.columns;
        let editcontentMsg = this.data[this.index];
        let thisjiluId;
        // 将editcontentMsg的内容整合到titleMsg中
        for (var k in editcontentMsg) {
          if (k != "Id") {
            titleMsg[k - 1].content = editcontentMsg[k];
          } else if (k == "Id") {
          //titleMsg[titleMsg.length - 1].content = editcontentMsg[k];
            thisjiluId = editcontentMsg[k];
          }
        }
        // 添加lookup数据
        console.log(titleMsg);
        console.log(this.lookupMsg);
        // return false;
        titleMsg.forEach((v, i) => {
          // 这个是专门处理 BusinessType 这个字段, 以方便编辑的时候使用, 将汉字转换成 value
          if (v.attribute == 'BusinessType') {
            v.lookupMsg = this.lookupMsg[v.attribute];
            if (v.content == null) {
              v.content = [];
            } else {
              let arr = [];
              v.content.split('、').forEach((val, index) => {
                v.lookupMsg.forEach((value, j) => {
                  if (value.label == val) {
                    arr.push(value.value);
                  }
                })
              })
              v.content = arr;
            }
          }
          // 下面也要修改
          if (v.type == "lookup") {
            for (let k in this.lookupMsg) {
              if (k == v.attribute) {
                v.lookupMsg = this.lookupMsg[k];
                let conStr = v.content;
                let conArry;
                if(typeof v.content == 'string'){
                  conArry = conStr.split('-');
                }else {
                  conArry = [null];
                }
                v.content = this.findId(v.lookupMsg, conArry, 0, []);
              }
            }
          }
          if (v.type == "reference") {
            this.relationTable.forEach((val, index) => {
              if (v.lr == val.domainname) {
                v.relationTable = v.table == val.domainclass2 ? val.domainclass1 : val.domainclass2;
              }
            });
          }
        });
        let data = {
          tableName: this.tableName,
          tableCname: this.tableCname,
          titleMsg: titleMsg,
          thisjiluId: thisjiluId
        };
        this.$store.commit("getaddMsg", data); //将整合好的数据推至公共仓库
        this.$router.push({ path: "/edit" }); //跳转至新增页面
      } else {
        this.$Message.error({
          content: '您未选中行!'
        })
      }
    },
    // 不知道处理啥的
    findId(obj, conArry, q, newArry){
      for(let val in obj){
        if(obj[val].label && obj[val].label == conArry[q]){
          newArry.push(obj[val].value);
          q++;
          if(q<conArry.length){
            findId(obj[val].children, conArry, q, newArry);
          }
        }
      }
      return newArry;
    },
    // 点击添加的时候调用的函数
    add() {
      // 添加时表头数据处理:
      // 1. 处理掉表头最后的action
      // 2. 关系表名放置到对应的reference中
      // 处理掉表头最后的action
      let titleMsg = this.columns.slice(0, this.columns.length - 1);
      // console.log(titleMsg);
      // return false;
      // 这一步是将关系表名放置到对应的reference数据中, lookup数据放置到对应的lookup数据中
      titleMsg.forEach((v, i) => {
        if (v.type == "reference") {
          this.relationTable.forEach(function(val, index) {
            if (v.lr == val.domainname) {
              v.relationTable = v.table == val.domainclass2 ? val.domainclass1 : val.domainclass2;
            }
          });
        }
        if (v.type == "lookup" || v.attribute == "BusinessType") {
          v.lookupMsg = this.lookupMsg[v.attribute];
          if (v.attribute == "BusinessType") {
            v.content = [];
          }
        }
      });
      let data = {
        tableName: this.tableName,
        tableCname: this.tableCname,
        titleMsg: titleMsg
      };
      //console.log(data);
      this.$store.commit("getaddMsg", data); //将整合好的数据推至公共仓库
      this.$router.push({ path: "/add" }); //跳转至新增页面
    },
    // 关系记录跳转到对应表的所在的位置
    relationJump(){
      if (this.isClick == true) {
        let relationCtable = '';
        let pageNum = 1;
        let jiluId = this.recordId;
        
        let data = '?table=' + this.tableName + '&pageSize=20&id=' + this.recordId;
        this.$http.get('/cardController/getPageCardByIndex' + data).then(info => {
          if (info.status == 200) {
            pageNum = info.data;
            let msg = {
              relationCtable: this.tableCname,//侧边栏搜索使用
              pageNum: pageNum,// 分页跳转使用
              jiluId: jiluId//最终定位使用
            }
            this.$store.commit('getsearchRelation', msg);
            this.$router.push({ path: "/config/tableList" });
          }
        })
      } else {
        this.$Message.error({
          content: '您未选中行!'
        })
      }
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
    // 一进入该页面, 就获取关系表的表名
    getrelationTable() {
      let data = "?table=" + this.tableName;
      this.$http.get("/relationController/getDomainList" + data).then(info => {
        if (info.status == 200) {
          this.relationTable = info.data;
        }
      });
    },
    // 获取权限
    getAuthority() {
      this.Authority = this.$store.state.Mode?this.$store.state.Mode:JSON.parse(sessionStorage.getItem('Mode'));
    },
    // 高度自适应
    heightAdaptive(){
      let clientH = document.documentElement.clientHeight;
      this.contentbodyH = clientH - 65 + "px";
      this.tableHeight = clientH - 65 - 145; //133包括按钮区域, margin-top, 分页所在区域
      this.menuContentH = clientH - 65 + 'px';
      this.modalMaxHeight = clientH - 300 + 'px';
    },
    // 获取当前行详细信息
    initTableColumn(columnName){
      for(let i = 0; i < columnName.length; i++){
        if(!columnName[i].render) {
          this.$set(columnName[i], 'ellipsis', true);
          this.$set(columnName[i], 'render', (h, params) => {
            return h('span', {attrs: {title: params.row[params.column.key]}}, params.row[params.column.key]);
          });
        }
      }
    },
  }
};
</script>
<style lang="scss">
#searchforContainer {
  height: 100%;
  margin-left: -1px;
  .layout {
    height: 100%;
    .ivu-layout-sider {
      background-color: #f5f7f9;
      overflow: scroll;
    }

    .btnContainer {
      overflow: hidden;
      padding-top: 20px;
      padding-right: 145px;
      .ivu-input-wrapper {
        float: right;
      }
    }
  }
  .ivu-table-wrapper {
    width: 100%;
  }
}

/* 模态框样式*/
.ivu-modal-confirm-body {
  padding-left: 66px;
  padding-top: 4px;
  font-size: 16px;
  line-height: 28px;
}
</style>
