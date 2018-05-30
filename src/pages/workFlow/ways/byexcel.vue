<template>
  <div class="byexcel">
    <div class="btn">
      <div class="download">
        <Button type="primary">下载模板</Button>
      </div>
      <div class="upload">
        <Upload multiple type="drag" action="此处填写上传地址">
          <div style="padding: 20px 0">
            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
            <p>点击或文件拖拽至此处</p>
          </div>
        </Upload> 
      </div>
    </div>
  </div>
</template>
<script>
export default {};
</script>
 
<style lang="scss">
.byexcel {
  .btn {
    overflow: hidden;
    position: relative;
    padding-left: 270px;
    .download {
      position: absolute;
      left: 130px;
      bottom: 8px;
    }
    .upload {
      float: left;
      width: 400px;
    }
  }
}
</style>