<template>
  <div id="loginContainer">
    <header>统一配置管理系统</header>
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
              min: 6,
              message: "密码长度不能小于6位",
              trigger: "blur"
            }
          ],
          select: [{ required: true, message: "请选择分组", trigger: "blur" }]
        },
        groupInfo: ''
      };
    },
    methods: {
      login:function() {
        let _this = this;
        if (_this.formInline.select == ''){
          _this.$Message.warning({
            content: '请先选择分组'
          })
        }else {
          _this.groupInfo.forEach(function(v, i){
            if( v.Code == _this.formInline.select){
              let arra = v;
              arra.user = _this.formInline.user;
              _this.getAuthority(arra.Description);//将获取到的权限信息推送到公共仓库
              sessionStorage.setItem('groupInfo', JSON.stringify(arra)); //分组信息存入session
            }
          });
          //跳转页面
          _this.$router.push({ path: '/search' });
        }
      },
      getGroup: function () {
        let _this = this;
        if (_this.formInline.user && _this.formInline.password) {
          _this.$http.post('/authorityController/login?username=' + _this.formInline.user + '&password=' + _this.formInline.password)
          .then(function (info) {
            // console.log(info);
            if (info.status == 200) {
              if (info.data.Status == 0) {
                _this.$Message.error({
                  content: info.data.data,
                  duration: 2
                })
              } else if (info.data.Status == 1) {
                _this.$Message.error({
                  content:  info.data.data,
                })
              } else if (info.data.Status == 2) {
                _this.$Message.success({
                  content: "请选择分组",
                })
                _this.groupInfo = info.data.data;
              }
            }
          })
        } else {
          _this.$Message.warning({
            content: '请输入账号或密码'
          })
        }
        
      },
      inpChange: function(){
        let _this = this;
        _this.groupInfo = '';
      },
      // 获取权限
      getAuthority(groupName) {
        let data = "?groupName=" + groupName;
        this.$http.post("/authorityController/getGroup" + data)
          .then(info => {
          if (info.status == 200) {
            this.$store.commit('getMode', info.data);
            sessionStorage.setItem('Mode', JSON.stringify(info.data));
          }
        });
    },
    }
  };
</script>

<style lang="scss">
  #loginContainer {
    transition: .2s;
    width: 350px;
    // padding: 40px 65px 30px;
    padding: 20px 20px 20px;
    border-radius: 10px;
    background-color: rgba(255, 255, 255, .5);
    margin: 145px auto;
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
      position: absolute;
      left: 0;
      top: 0;
      font-size: 28px;
      margin-top: 15px;
      margin-left: 20px;
      text-shadow: 7px 4px 4px #6b5959;
      cursor: pointer;
    }
  }
  #loginContainer:hover{
    margin-top: 140px;
    // box-shadow: 0px 0px 25px #ccc;
  }
</style>




