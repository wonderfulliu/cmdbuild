<template>
  <Layout>
    <Content :style="{margin: '20px', background: '#fff', minHeight: '260px'}">
      <div class="downloadForm">
        <Form label-position="right" :model="exportXLSForm" :label-width="100">
          <FormItem label="选择类">
            <Select v-model="exportXLSForm.table">
              <Option :value="attr"
                      v-for="(v, attr) in xlsInfo">
                {{ v }}</Option>
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

<style>

</style>

<script>
    export default {
        data () {
            return {
              exportXLSForm: {
                table: ''
              },
              loading: false,
              xlsInfo: ''
            }
        },
      created () {
        let _this = this;
        _this.$http.get('/cardController/getTableList')
          .then(function(info){
            _this.xlsInfo = info.data;
          })
      },
      methods: {
        formSubmit () {
          let _this = this;
          window.open('/cardController/downLoadExcel?table=' + _this.exportXLSForm.table);
        }
      }
    }
</script>
