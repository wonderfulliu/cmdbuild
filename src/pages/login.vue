<template>
  <div id="loginContainer">
    <header>
      <img src="../img/logo.jpg" alt="外汇交易中心">
      统一配置管理系统
    </header>
    <i-form ref="formInline" :model="formInline" :rules="ruleInline">
        <Form-item prop="user">
            <i-input type="text" v-model="formInline.user" placeholder="Username" @input="inpChange()">
                <Icon type="ios-person-outline" slot="prepend"></Icon>
            </i-input>
        </Form-item>
        <Form-item prop="password">
            <i-input type="password" v-model="formInline.password" placeholder="Password" @input="inpChange()">
                <Icon type="ios-locked-outline" slot="prepend"></Icon>
            </i-input>
        </Form-item>
        <Form-item prop="select" label="请选择分组" v-if="groupInfo.length != 0" id="selectContainer">
            <i-select v-model="formInline.select" placeholder="请选择分组">
                <i-option :value="info.Code" :key="info.Code" v-for="info in groupInfo">{{ info.Description }}</i-option>
            </i-select>
        </Form-item>
        <Form-item v-if="groupInfo.length == 0">
            <i-button type="primary" long @click="getGroup">确定</i-button>
        </Form-item>
        <Form-item v-if="groupInfo.length != 0">
            <i-button type="primary" long @click="login">登录</i-button>
        </Form-item>
    </i-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formInline: {
        user: "",
        password: "",
        select: ""
      },
      ruleInline: {
        user: [{ required: true, message: "请填写用户名", trigger: "blur" }],
        password: [
          { required: true, message: "请填写密码", trigger: "blur" },
          {
            type: "string",
            // min: 6,
            // message: "密码长度不能小于6位",
            trigger: "blur"
          }
        ],
        select: [{ required: true, message: "请选择分组", trigger: "blur" }]
      },
      groupInfo: ""
    };
  },
  methods: {
    login: function() {
      let _this = this;
      _this.groupInfo.forEach(function(v, i) {
        if (v.Code == _this.formInline.select) {
          let arra = v;
          arra.user = _this.formInline.user;
          _this.getAuthority(arra.Description); //将获取到的权限信息推送到公共仓库
          _this.gettableName();
          sessionStorage.setItem("groupInfo", JSON.stringify(arra)); //分组信息存入session
        }
      });
      //跳转页面 
      _this.$router.push({ path: "/search" });
    }, 
    getGroup: function() {
      let _this = this;
      if (_this.formInline.user && _this.formInline.password) {
        _this.$http
          .post(
            "/authorityController/login?username=" +
              _this.formInline.user +
              "&password=" +
              _this.formInline.password
          )
          .then(function(info) {
            // console.log(info);
            if (info.status == 200) {
              if (info.data.Status == 0) {
                _this.$Message.error({
                  content: info.data.data,
                  duration: 2
                }); 
              } else if (info.data.Status == 1) {
                _this.$Message.error({
                  content: info.data.data
                });
              } else if (info.data.Status == 2) {
                _this.formInline.select = info.data.data[0].Code; //默认显示第一个组
                _this.groupInfo = info.data.data;
                if (info.data.data.length == 1) {
                  //如果只有一个分组, 直接登录进去
                  _this.login();
                }
              }
            }
          });
      } else {
        _this.$Message.warning({
          content: "请输入账号或密码"
        });
      }
    },
    inpChange: function() {
      let _this = this;
      _this.groupInfo = "";
    },
    // 获取权限 
    getAuthority(groupName) {
      let data = "?groupName=" + groupName;
      this.$http.post("/authorityController/getGroup" + data).then(info => {
        if (info.status == 200) {
          // console.log(info);
          this.$store.commit("getMode", info.data);//表名与该登录人员的权限信息
          sessionStorage.setItem("Mode", JSON.stringify(info.data));
        }
      });
    },
    // 获取所有表的中文名
    gettableName() {
      this.$http.get("/cardController/getTableList").then(info => {
        if (info.status == 200) {
          this.tableMsg = info.data;
          this.$store.commit('gettableMsg', this.tableMsg);//把tableMsg放置到公共数据仓库
          sessionStorage.setItem("gettableMsg", JSON.stringify(info.data));
        }
      });
    },
  }
};
</script>

<style lang="scss">
#loginContainer {
  transition: 0.2s;
  width: 350px;
  // padding: 40px 65px 30px;
  padding: 20px 20px 20px;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.5);
  margin: 200px auto;
  div.ivu-form-item:nth-child(2) {
    margin-bottom: 30px;
  }
  .ivu-input-group {
    height: 36px;
    .ivu-input {
      height: 36px;
    }
  }
  header {
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
    font-size: 26px;
    color: #4e6f7b;
    text-align: right;
    padding: 15px 30px;
    cursor: pointer;
    img{
      float: left;
      width: 11%;
    }
    p{
      float: left;
    }
  }
}
</style>




