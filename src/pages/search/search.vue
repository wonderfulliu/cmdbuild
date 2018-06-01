<template>
    <div id="searchContainer">
      <div class="btnContainerAll">
          <Row>
            <Col span="10" offset="7">
              <Input v-model="searchMsg"
                 size="large"
                 placeholder="Search for..."
                 style=" height: 46px"
                 icon="arrow-right-c"
                 @on-click='getsearchMsg'
                 @on-enter="getsearchMsg"></Input>
            </Col>
          </Row>
      </div>
    </div>
</template>
<script>
export default {
  data() {
    return {
      searchMsg: "",
      tableMsg: "",
      searchasideMsg: ""
    };
  },
  created() {
    this.$store.commit('getIndex', 0);//清空result时存的点击的侧边栏的序列
    this.tableMsg = this.$store.state.tableMsg;
  },
  methods: {
    // 根据搜索的内容查询所有符合的表与记录
    getsearchMsg() {
      //清除获取到的内容的空格
      let data = this.searchMsg.replace(/\s+/g, "");
      if (data == "") {
        //输入为空时, 停止发送请求, 清空input内容
        this.searchMsg = "";
        return false;
      }
      data = "?key=" + data;
      this.$http.get("/luceneController/search" + data).then(
        info => {
          // 成功的回调
          if (info.status == 200) {
            // 如果对象为空 Object.keys(info.data).length == 0是ES6新方法
            if (Object.keys(info.data).length == 0) {
              this.alertMsg();
            } else {
              // 清空搜索内容
              this.searchMsg = "";
              // 将搜索到的数据改为需要的数据格式
              let arrsearchMsg = [];
              let i = 0; //判断第一个对象, 并给他加选中状态
              for (let k in info.data) {
                let obj = {};
                obj.idElementClass = k;
                obj.recordIdes = info.data[k];
                for (let kTable in this.tableMsg) {
                  if (k == '"' + kTable + '"') {
                    obj.Description = this.tableMsg[kTable];
                  }
                }
                arrsearchMsg.push(obj);
              }
              this.searchasideMsg = arrsearchMsg;
              // console.log(this.searchasideMsg);
              // return false;
              this.$store.commit('getsearchMsg', this.searchasideMsg);
              sessionStorage.setItem('searchMsg', JSON.stringify(this.searchasideMsg));
              this.$router.push({path: '/result'});
            }
          }
        },
        info => {
          // 失败的回调
        }
      );
    },
    //提示信息
    alertMsg() {
      this.$Message.warning({
        content: "您搜索的内容为空"
      });
    }
  }
};
</script>

<style lang="scss">
#searchContainer {
  background: url('../../img/search.jpg') no-repeat;
  background-size: cover;
  height: 100%;
  .btnContainerAll {
    margin-top: 150px;
    .ivu-input-wrapper {
      .ivu-input-large {
        font-size: 18px;
        height: 46px;
        padding-left: 20px;
        padding-right: 46px;
        border-radius: 23px;
      }
      input.ivu-input-large::placeholder {
        font-size: 16px;
      }
      i.ivu-input-icon {
        height: 46px;
        width: 46px;
        line-height: 46px;
        font-size: 24px;
        border-radius: 0 23px 23px 0;
        cursor: pointer;
      }
      i.ivu-input-icon:hover {
        background-color: #ededed;
        transition: 0.5s;
      }
    }
  }
}
</style>
