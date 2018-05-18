<template>
  <Layout>
    <div id="passwordContainer">
      <Form :label-width="formwidth">
        <FormItem label="旧密码">
            <Input type="password" v-model="oldPasswd"></Input>
        </FormItem>
        <FormItem label="新密码">
            <Input type="password" v-model="newPasswd"></Input>
        </FormItem>
        <FormItem label="确认密码">
            <Input type="password" v-model="passwdCheck"></Input>
        </FormItem>
        <FormItem>
            <Button type="primary" @click="Submit">提交</Button>
            <Button type="ghost" @click="back" style="margin-left: 8px">取消</Button>
        </FormItem>
      </Form>
    </div>
  </Layout>
</template>
<script>
export default {
  data() {
    return {
      formwidth: 80,//form表单宽度
      oldPasswd: "",
      newPasswd: "",
      passwdCheck: "",
    };
  },
  methods: {
    // 提交密码
    Submit(){
      // 密码校验
      if (this.newPasswd !== this.passwdCheck) {
        this.$Message.warning({
          content: '请确认两次密码输入一致',
          duration: 2
        })
      } else {
        let data = 'oldPassword=' + this.oldPasswd + '&newPassword=' + this.newPasswd + '&confirmPassword=' + this.passwdCheck;
        this.$http.post('/authorityController/changePassword', data).then(info => {
          if (info.status == 200) {
            if (info.data.Status == 0) {
              this.$Message.success({
                content: "密码修改成功, 请重新登录!" 
              })
              this.$router.push({ path: '/' });
            }
            if (info.data.Status == 1) {
              this.$Message.warning({
                content: "旧" + info.data.data 
              })
            }
          }
        })
      }
    },
    // 重置密码
    back(){
      this.$router.go(-1);
    },
  }
};
</script>

<style lang="scss">
#passwordContainer {
  width: 40%;
  margin: 0 auto;
  margin-top: 60px;
}
</style>

