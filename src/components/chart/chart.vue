<template>
    <div :id="'chart'+random1+'a'+random2" style="height:320px">
        <Spin fix v-show="spinShow">
            <Icon type="load-a" size=18 class="spinLoading"></Icon>
            <div>Loading</div>
        </Spin>
    </div>
</template>

<style>

</style>

<script>
    export default {
        props: {
            chartdata: {
                type: Object,
                required: true
            }
        },
        data () {
            return {
                spinShow: false,
                random1: Math.floor(Math.random()*100000),
                random2: Math.floor(Math.random()*100000)
            }
        },
        watch:{
            'chartdata': function(newValue, oldValue){
                this.getChartsMsg(this.chartdata);
            }
        },
        mounted(){
            this.getChartsMsg(this.chartdata);
        },
        methods: {
            //获取图表数据
            getChartsMsg(msg){
                this.spinShow = true;
                this.$http
                        .get('/dashboardController/getData?xField=' + msg.chartAttr.xField +
                                '&yField=' + msg.chartAttr.yField +
                                '&functionName=' + msg.chartAttr.functionName)
                        .then(info => {
                    this.drawLine(msg.title, msg.chartAttr.type, info.data);
            })
            .catch(err => {
                    this.drawLine(msg.title, msg.chartAttr.type, null);
            })

            },
            //绘制图表
            drawLine(title, type, chartAttr){
                let _this = this;
                let echarts = require('echarts');
                let mChart = echarts.init(document.getElementById('chart'+_this.random1+'a'+_this.random2));
                //mChart.showLoading();
                let option = {};
                if(chartAttr != null){
                    //初始化实例
                    if(type == 'bar'){
                        //绘制柱状图
                        option = {
                            title: {
                                text: title,
                                textStyle: {
                                    color: '#333',
                                    fontSize: 15
                                }
                            },
                            legend:{
                                type: 'scroll',
                            },
                            xAxis :{
                                data: chartAttr.category,
                                axisLabel: {
                                    rotate:40
                                }
                            },
                            tooltip: {},
                            toolbox:{
                                show: true,
                                feature: {
                                    saveAsImage: {},
                                    dataView: {
                                        readOnly: false,
                                        buttonColor: 'rgb(26, 187, 156)'
                                    },
                                    magicType: {
                                        type: ['bar', 'line']
                                    }
                                }
                            },
                            yAxis: {},
                            series : [{
                                type: type,
                                barMaxWidth: 35,
                                itemStyle: {
                                    normal:{
                                        color: '#1abb9c',
                                    },
                                },
                                name: chartAttr.series[0].name,
                                data: chartAttr.series[0].data,
                            }]
                        };
                    }else if(type == 'pie'){
                        //绘制饼图
                        let dataArr = [];
                        for(let i in chartAttr.category){
                            let newO = {
                                value: chartAttr.series[0].data[i],
                                name: chartAttr.category[i]
                            }
                            dataArr.push(newO);
                        };
                        option = {
                            title: {
                                text: title,
                                textStyle: {
                                    color: '#333',
                                    fontSize: 15
                                }
                            },
                            color:['rgb(38,185,154)','rgb(231,76,60)','rgb(52,152,219)','rgb(189,195,199)','rgb(155,89,182)'],
                            tooltip: {},
                            toolbox:{
                                show: true,
                                feature: {
                                    saveAsImage: {},
                                    dataView: {
                                        readOnly: false,
                                        buttonColor: 'rgb(26, 187, 156)'
                                    },
                                }
                            },
                            series : [{
                                type: type,
                                name: chartAttr.series[0].name,
                                data: dataArr
                            }]
                        };
                    }else if(type == 'line'){
                        //绘制线图
                        option = {
                            title: {
                                text: title,
                                textStyle: {
                                    color: '#333',
                                    fontSize: 15
                                }
                            },
                            legend:{
                                orient: 'vertical'
                            },
                            xAxis :{
                                data: chartAttr.category,
                            },
                            tooltip: {},
                            toolbox:{
                                show: true,
                                feature: {
                                    saveAsImage: {},
                                    dataView: {
                                        readOnly: false,
                                        buttonColor: 'rgb(26, 187, 156)'
                                    },
                                    magicType: {
                                        type: ['bar', 'line']
                                    }
                                }
                            },
                            series : [{
                                type: type,
                                cursor: 'pointer',
                                itemStyle: {
                                    normal:{
                                        color: '#96ca59'
                                    }
                                },
                                name: chartAttr.series[0].name,
                                data: chartAttr.series[0].data
                            }]
                        };
                    }
                }else {
                    document.getElementById('chart'+_this.random1+'a'+_this.random2).innerHTML = "暂无数据"
                }
                mChart.clear();//清空画布，防止缓存
                mChart.setOption(option);
                this.spinShow = false;
                //mChart.hideLoading();

            }
        }
    }
</script>
