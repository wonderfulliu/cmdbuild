<template>
  <Layout>
    <Content :style="{margin: '20px', background: '#fff', minHeight: '260px'}">
      <div class="downloadForm">
        <Form label-position="right" :model="exportRelateForm" :label-width="100">
          <FormItem label="选择关系">
            <Select v-model="exportRelateForm.table">
              <Option :value="v.domainname"
                      v-for="(v, index) in relateInfo" :key="index">
                {{ v.domainname }}</Option>
            </Select>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="formSubmit" :loading="loading">导出</Button>
          </FormItem>
        </Form>
      </div>
    </Content>
  </Layout>
</template>

<script>
  export default {
    data () {
      return {
        exportRelateForm: {
          table: ''
        },
        loading: false,
        relateInfo: ''
      }
    },
    created () {
      let _this = this;
      _this.$http.get('/relationController/getAllDomainList')
        .then(function(info){
          _this.relateInfo = info.data;
        })
    },
    methods: {
      formSubmit () {
        let _this = this;
        window.open('/relationController/downLoadRelationExcel?table=' + _this.exportRelateForm.table);
      }
    }
  }
</script>

<style>

</style>
