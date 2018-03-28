<template>
  <div id="loginContainer">
    <i-form v-ref:form-inline :model="formInline" :rules="ruleInline">
        <Form-item prop="user">
            <i-input type="text" :value.sync="formInline.user" placeholder="Username">
                <Icon type="ios-person-outline" slot="prepend"></Icon>
            </i-input>
        </Form-item>
        <Form-item prop="password">
            <i-input type="password" :value.sync="formInline.password" placeholder="Password">
                <Icon type="ios-locked-outline" slot="prepend"></Icon>
            </i-input>
        </Form-item>
        <Form-item label="请选择分组">
            <i-select :model.sync="formInline.select" placeholder="请选择分组">
                <i-option value="beijing">北京市</i-option>
                <i-option value="shanghai">上海市</i-option>
                <i-option value="shenzhen">深圳市</i-option>
            </i-select>
        </Form-item>
        <Form-item>
            <i-button type="primary" long @click="handleSubmit('formInline')">登录</i-button>
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
        formItem: {
          select: '',
        }
      };
    },
    methods: {
      handleSubmit(name) {
        this.$refs[name].validate(valid => {
          if (valid) {
            this.$Message.success("提交成功!");
          } else {
            this.$Message.error("表单验证失败!");
          }
        });
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




