<template>
  <Layout>
    <Content :style="{margin: '20px', background: '#fff', minHeight: '260px'}">
      <div class="downloadForm">
        <Form label-position="right" :model="importRelateForm" :label-width="100">
          <FormItem label="选择关系">
            <Select v-model="importRelateForm.table">
              <Option :value="v.domainname"
                      v-for="v in relateInfo">
                {{ v.domainname }}</Option>
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
            <div class="fileCon" v-if="importRelateForm.file !== null">
              文件名: {{ importRelateForm.file.name }}
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
        importRelateForm: {
          table: '',
          file: null
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
      handleUpload (file) {
        this.importRelateForm.file = file;
        return false;
      },
      formSubmit (e) {
        let _this = this;
        e.preventDefault();
        let formData = new FormData();
        formData.append('table', _this.importRelateForm.table);
        formData.append('file', _this.importRelateForm.file);
        let config = {
          headers: {
            'content-Type': 'multipart/form-data'
          }
        };
        _this.$http.post('/relationController/upLoadRelationExcel', formData, config)
          .then(function(res){
            _this.loading = false;
            _this.importRelateForm.file = null;
            _this.$Message.success('Success');
          })
          .catch(function(error){
            _this.loading = false;
            _this.importRelateForm.file = null;
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
