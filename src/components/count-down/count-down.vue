<template>
    <span :style="{color:fontColor}">{{ newCount+1 }}</span>
</template>

<script>
    export default {
        name: 'CountDown',
        props: {
            count: {
                type: Number,
                default: 5
            },
            fontColor: {
                type: String,
                default: '#ff8733'
            }
        },
        data () {
            return {
                newCount: this.count
            }
        },
        created () {
            if ( this.timeOut ) {
                clearTimeout(this.timeOut);
            }
            this.countDown();
        },
        methods: {
            countDown() {
                // 这里是一个http的异步请求
                if(this.newCount>0){
                    this.newCount--;
                }else {
                    this.$router.push({ path: "/workflow/wfList" }); //跳转至列表页
                }
                if ( this.$route.path == '/workflow/operate/byself' ) {
                    let _this = this;
                    this.timeOut = setTimeout(() => {
                                _this.countDown();
                }, 1000);
                } else {
                    this.timeOut = '';
                }
            },
        }
    }
</script>
