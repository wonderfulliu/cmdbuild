<template>
  <div id="loginContainer">
    <i-form v-ref:form-inline :model="formInline" :rules="ruleInline">
        <Form-item prop="user">
            <i-input type="text" v-model="formInline.user" placeholder="Username">
                <Icon type="ios-person-outline" slot="prepend"></Icon>
            </i-input>
        </Form-item>
        <Form-item prop="password">
            <i-input type="password" v-model="formInline.password" placeholder="Password">
                <Icon type="ios-locked-outline" slot="prepend"></Icon>
            </i-input>
        </Form-item>
        <Form-item label="请选择分组" v-if="groupInfo.length != 0">
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
          ]
        },
        groupInfo: ''
      };
    },
    methods: {
      login:function() {
        let _this = this;
        _this.groupInfo.forEach(function(v, i){
          if( v.Code == _this.formInline.select){
            let arra = v;
            arra.user = _this.formInline.user;
            sessionStorage.setItem('groupInfo', JSON.stringify(arra)); //分组信息存入session
          }
        });

        //跳转页面

      },
      getGroup: function () {
        let _this = this;
        let user = _this.formInline.user;
        let  pwd = _this.formInline.password;
        _this.$http.post('/authorityController/login?username=' + user + '&password=' + pwd)
          .then(function (info) {
            _this.groupInfo = info.data.data;
          })
      }
    }
  };
</script>

<style lang="scss">
  #loginContainer {
    transition: .2s;
    width: 35%;
    padding: 40px 65px 30px;
    background-color: #fff;
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
  }
  #loginContainer:hover{
    margin-top: 140px;
    box-shadow: 0px 0px 25px #ccc;
  }
</style>




