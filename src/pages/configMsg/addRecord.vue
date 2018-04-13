<template>
  <Layout>
    <Header :offset-top="64" :style="{padding: 0}" class="layout-header-bar">
      <div class="btnItem btnItemLeft">
        <Icon @click.native="collapsedSider" :class="rotateIcon" :style="{margin: '4px 20px'}" type="navicon-round" size="24"></Icon>
      </div>
      <div class="btnItem btnItemRight floatRight">
        <Button type="info">提交</Button>
        <Button type="ghost" @click="backBtn">返回</Button>
      </div>
    </Header>

    <Content :style="{margin: '20px', background: '#fff', minHeight: '260px'}">
      <div class="contentBody">

        <div class="formContainer">
          <Form :label-width="100">
            <FormItem :label="attr.cname" v-for="attr in attributes" :key="attr.attribute">
              <Input placeholder="Enter something..." v-if="attr.type=='varchar'" :name="attr.attribute"></Input>
              <Input placeholder="Enter something..." v-if="attr.type=='int4'" :name="attr.attribute"></Input>
              <Select v-if="attr.type=='lookup'" :name="attr.attribute">
                <Option v-for="a in lookupInfo[attr.attribute]" :value="a.Id" :key="a.Id">{{ a.Description }}</Option>
              </Select>
              <Row v-if="attr.type=='date'">
                <Col span="24">
                <DatePicker type="date" placeholder="Select date" :name="attr.attribute"></DatePicker>
                </Col>
              </Row>
              <Input v-if="attr.type=='reference'" :name="attr.attribute">
              <Button slot="append" icon="ios-search"></Button>
              </Input>
            </FormItem>
          </Form>
        </div>


      </div>
    </Content>
  </Layout>
</template>

<script>
    export default {
        props: {
          'tableName':{
            type: String,
            required: true
          },
          'collapsedSider': {
            type: Function,
            default: null
          },
          'rotateIcon': {
            type: Function,
            default: null
          }
        },
        data () {
            return {
              isCollapsed: false,
              attributes: '',   //记录的字段 中英文
              lookupInfo: '',   //当前表中lookup信息
            }
        },
      created: function(){
        this.lookupInfo = JSON.parse(sessionStorage.getItem('config_' + this.tableName + '_lookup'));
        this.attributes = JSON.parse(sessionStorage.getItem('config_' + this.tableName + '_attribute'));
      },
      methods:{
        backBtn(){
          this.$router.go(-1);
        }
      }
    }
</script>

<style>
  .formContainer{
    width: 60%;
    height: 100%;
    margin: 15px auto;
  }
</style>
