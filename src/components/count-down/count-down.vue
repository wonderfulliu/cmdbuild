<template>
    <span :style="{color:fontColor}">{{second}}</span>
</template>

<script>
    const defaultSecond = 5;
    const defatltColor = '#ff8733';
    export default {
        name: 'CountDown',
        props: {
            second: {
                type: Number,
                default: defaultSecond
            },
            fontColor: {
                type: String,
                default: defatltColor
            }
        },
        data () {
            return {

            }
        },
        mounted () {
            setInterval(this.countDown, 1000);
        },
        methods: {
            //倒计时  --秒
             countDown() {
                 //second--为初始值
                 if (this.second > 0) {
                    this.second--;
                 }else{
                    this.overRun();
                 }

             },
             overRun(){
                 this.$router.push({ path: "/workflow/wfList" }); //跳转至新增页面
             }
        }
    }
</script>
