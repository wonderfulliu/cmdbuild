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
      <Form :model="formItem" :label-width="80">
          <FormItem label="Input">
              <Input v-model="formItem.input" placeholder="Enter something..."></Input>
          </FormItem>
          <FormItem label="Select">
              <Select v-model="formItem.select">
                  <Option value="beijing">New York</Option>
                  <Option value="shanghai">London</Option>
                  <Option value="shenzhen">Sydney</Option>
              </Select>
          </FormItem>
          <FormItem label="DatePicker">
              <Row>
                  <Col span="11">
                      <DatePicker type="date" placeholder="Select date" v-model="formItem.date"></DatePicker>
                  </Col>
                  <Col span="2" style="text-align: center">-</Col>
                  <Col span="11">
                      <TimePicker type="time" placeholder="Select time" v-model="formItem.time"></TimePicker>
                  </Col>
              </Row>
          </FormItem>
          <FormItem label="Radio">
              <RadioGroup v-model="formItem.radio">
                  <Radio label="male">Male</Radio>
                  <Radio label="female">Female</Radio>
              </RadioGroup>
          </FormItem>
          <FormItem label="Checkbox">
              <CheckboxGroup v-model="formItem.checkbox">
                  <Checkbox label="Eat"></Checkbox>
                  <Checkbox label="Sleep"></Checkbox>
                  <Checkbox label="Run"></Checkbox>
                  <Checkbox label="Movie"></Checkbox>
              </CheckboxGroup>
          </FormItem>
          <FormItem label="Switch">
              <i-switch v-model="formItem.switch" size="large">
                  <span slot="open">On</span>
                  <span slot="close">Off</span>
              </i-switch>
          </FormItem>
          <FormItem label="Slider">
              <Slider v-model="formItem.slider" range></Slider>
          </FormItem>
          <FormItem label="Text">
              <Input v-model="formItem.textarea" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="Enter something..."></Input>
          </FormItem>
          <FormItem>
              <Button type="primary">提交</Button>
              <Button type="ghost" style="margin-left: 8px">取消</Button>
          </FormItem>
      </Form>
    </div>
  </div>
    
</template>
<script>
export default {
  data() {
    return {
      formItem: {
        input: "",
        select: "",
        radio: "male",
        checkbox: [],
        switch: true,
        date: "",
        time: "",
        slider: [20, 50],
        textarea: ""
      }
    };
  },
  created () {
    this.renderMsg();
  },
  methods: {
    // 返回按钮事件
    backWard(){
      this.$router.go(-1);
    },
    renderMsg(){
      let editMsg = this.$store.state.editMsg;//拿到要编辑的数据
      let titleData = editMsg.titleData;//arr
      titleData.pop();//删除action
      let contentData = editMsg.contentData;//obj
      let i = 0;
      for(var k in contentData){
        titleData[i].content = contentData[k];
      }
      console.log(titleData);
      console.log(contentData);
    }
  }
};
</script>

<style lang="scss" scoped>
#editContainer {
  overflow-y: scroll;
  .head{
    h2{
      text-align: left;
      padding-left: 55px;
      padding-top: 15px;
    }
  }
  .body {
    width: 50%;
    padding: 15px 40px 30px 20px;
    margin: 30px auto;
  }
}
</style>

// 根据不同的数据类型动态创建数据
  // 1. varchar
  // 2. reference
  // 3. lookup
  // 4. date
