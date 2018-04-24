<template>
  <Layout>
    <Content :style="{margin: '20px', background: '#fff', minHeight: '260px'}">
      <div class="downloadForm">
        <Form label-position="right":model="importXLSForm" :label-width="100">
          <FormItem label="选择类">
            <Select v-model="importXLSForm.table">
              <Option :value="attr"
                      v-for="(v, attr, index) in xlsInfo" :key="index">
                {{ v }}</Option>
            </Select>
          </FormItem>
          <FormItem label="XLS文件">
            <Upload
              action=""
              :before-upload="handleUpload">
              <Button type="ghost" icon="ios-cloud-upload-outline">
                上传文件
              </Button>
            </Upload>
            <div class="fileCon" v-if="importXLSForm.file !== null">
              文件名: {{ importXLSForm.file.name }}
            </div>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="formSubmit($event)" :loading="loading">提交</Button>
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
              importXLSForm: {
                file: null,
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
        handleUpload (file) {
          this.importXLSForm.file = file;
          return false;
        },
        formSubmit (e) {
          let _this = this;
          e.preventDefault();
          let formData = new FormData();
          formData.append('table', _this.importXLSForm.table);
          formData.append('file', _this.importXLSForm.file);
          let config = {
            headers: {
              'content-Type': 'multipart/form-data'
            }
          };
          _this.$http.post('/cardController/upLoadExcel', formData, config)
            .then(function(res){
              _this.loading = false;
              _this.importXLSForm.file = null;
              _this.$Message.success('Success');
            })
            .catch(function(error){
              _this.loading = false;
              _this.importXLSForm.file = null;
              _this.$Message.error('error');
            });
        }
      }
    }
</script>

<style>
  .downloadForm{
    text-align: left;
    margin: 15px 0;
    width: 60%;
  }
</style>
