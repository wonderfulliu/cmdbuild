<template>
    <div :style="{height:contentTabsH,padding: '15px'}">
        <Tabs type="card" v-model="currentTab" v-if="!tabShow">
            <TabPane label="手动新增/修改CI内容" name="tab1">
                <!-- 手动新增/修改CI内容 -->
                <div class="miniTable" style="position: relative;padding: 0 15px;">
                    <Table :height="tableHeight"
                           size="small"
                           :columns="columns"
                           no-data-text=""
                           :data="data"></Table>
                    <Spin fix v-show="tbLoading">
                        <Icon type="load-a" size=18 class="spinLoading"></Icon>
                        <div>Loading</div>
                    </Spin>
                </div>
            </TabPane>
            <TabPane label="Excel批量新增/修改CI内容" name="tab2">
                <!-- Excel批量新增/修改CI内容 -->
                <Row>
                    <Col span="12" offset="6">
                    <Upload multiple type="drag" action="此处填写上传地址" style="margin-left: 20px;">
                        <div style="padding: 40px;">
                            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                            <p>请点击或将文件拖拽至此处</p>
                        </div>
                    </Upload>
                    </Col>
                </Row>
            </TabPane>
            <div v-if="btnGroupShow" slot="extra">
                <Button type="primary" size="small" @click="addRecord">新增</Button>
                <Button type="primary" size="small" @click="alterRecord">修改</Button>
                <Button type="primary" size="small" @click="deleteRecord">删除</Button>
            </div>
            <div v-if="!btnGroupShow" slot="extra">
                <Button type="primary" size="small">下载模板</Button>
            </div>
        </Tabs>
        <div class="successPrompt" v-if="tabShow">
            <h2>
                <Icon type="checkmark-circled"></Icon><span>您已完成该流程!</span>
            </h2>

            <p>若有待修改的流程请在未退出该流程前进行修改，已完成的流程一旦离开将无法再进行操作!<br>是否退出该流程？
                <Button class="orange"
                        type="text"
                        size="small"
                        @click="showTips">退出该流程</Button></p>
        </div>
        <Modal v-model="escTip" width="360">
            <p slot="header" style="color:#2d8cf0;text-align:center">
                <Icon type="information-circled"></Icon>
                <span>跳转提示</span>
            </p>
            <div style="text-align:center">
                <div style="padding: 16px;">
                    <p>此页面跳转后，该流程将无法执行任何操作。</p>
                    <p>是否继续跳转？</p>
                </div>
            </div>
            <div slot="footer">
                <Button type="primary" size="large" long @click="pageJump">跳转</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    export default {
        props: {
            Type: {
                type: String,
                required: true
            },
            TableEName: {
                type: String,
                required: true
            },
            tabShow: {
                type: Boolean,
                default: false
            },
        },
        data () {
            return {
                //数据
                columns: [], //表头数据
                data: [], //表格数据
                //参数配置
                currentTab: 'tab1', //标签页
                tbLoading: false,   //表格加载等待
                escTip: false,      //modal是否显示
                //页面样式
                contentTabsH: '',  //选项卡的高度
                tableHeight: 100,  //表格的高度
            }
        },
        created () {
            this.getThead();
        },
        watch: {
            'TableEName': function(newValue, oldValue){
                this.currentTab = 'tab1';
                this.getThead();
            },
        },
        computed: {
            btnGroupShow() {
                return this.currentTab == 'tab1'?true:false
            }
        },
        mounted () {
            let _this = this;
            _this.heightAdaptive();
            window.onresize = () => {
                _this.heightAdaptive();
            }
        },
        methods: {
            //获取表头
            getThead() {
                this.tbLoading = true;
                let tHead = sessionStorage.getItem("config_" + this.TableEName + "_thead");
                if(!tHead){
                    if(this.Type == "table"){
                        let data = {
                            'table': this.TableEName
                        };
                        this.$http
                            .post('/cardController/getAttributeList', data)
                            .then(info => {
                                let newArra = [];
                                info.data.forEach(function(v, i){
                                    let newObja = {
                                        title: v.cname,
                                        key: v.attribute,
                                        width: 160,
                                        position: v.position,
                                        ellipsis: true,

                                    };
                                    newArra.push(newObja);
                                });
                                sessionStorage.setItem("config_" + this.TableEName + "_thead", JSON.stringify(newArra));
                                this.columns = newArra;
                            });
                    }else if(this.Type == "relation"){
                        this.columns = [];
                    }
                }else {
                    this.columns = JSON.parse(tHead);
                    console.log(this.columns);
                }
                this.tbLoading = false;
            },
            //添加表记录
            addRecord(){
                console.log('添加了一条记录');
                //存储表名
                //存储正在进行的步骤
                //跳转路由
                this.$router.push({path: '/workflow/wfRecordAdd'});
            },
            //修改表记录
            alterRecord() {
                console.log('修改了一条记录');
                //存储表名
                //存储选中的记录id
                //存储正在进行的步骤
                //跳转路由
                this.$router.push({path: '/workflow/wfRecordAlter'});
            },
            //删除表记录
            deleteRecord() {
                console.log('删除了一条记录');
            },
            //完成流程后离开页面提示
            showTips() {
                this.escTip = true;
            },
            pageJump() {
                this.$router.push({ path: "/workflow/wfList" }); //跳转至列表页
            },
            // 高度自适应
            heightAdaptive() {
                let clientH = document.documentElement.clientHeight;
                let clientW = document.documentElement.clientWidth;
                this.contentTabsH = clientH - 205 + 'px';
                this.tableHeight = clientH - 295;
            },
        }
    }
</script>
