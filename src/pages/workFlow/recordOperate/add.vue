<template>
    <Layout>
        <Header ref="conBhead" style="padding: 0;height: 64px;" class="layout-header-bar">
            <Steps :current="current">
                <Step :key="index"
                      :title="item.TableName"
                      v-for="(item, index) in currentScene"></Step>
                <Step title="完成"></Step>
            </Steps>
        </Header>
        <Content style="overflow-y: auto">
            <Form :label-width="100" class="formContainer">

            </Form>
        </Content>
    </Layout>
</template>

<style>

</style>

<script>
    export default {
        props: {},
        data () {
            return {
                current: 0,
                currentScene: [],
            }
        }
    }
</script>
