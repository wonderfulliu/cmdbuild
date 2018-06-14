<template>
  <div class="byexcel">
    <div style="width: 100%;">
      <Row>
        <Col span="8">
        <Upload multiple type="drag" action="此处填写上传地址" style="margin-left: 20px;">
          <div style="padding: 20px;">
            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
            <p>点击或文件拖拽至此处</p>
          </div>
        </Upload>
        </Col>
      </Row>
      <Row>
        <Col span="8" offset="8" style="text-align: left">
        <Button type="primary" style="margin-left: 20px">下载模板</Button>
        </Col>
      </Row>
    </div>
  </div>
</template>
<script>
export default {};
</script>
 
<style lang="scss">

</style>