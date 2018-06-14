
// 经常使用的公共函数写在这里, 方便使用, 调用方式: this.util.方法名
export default {
  // 公共函数放置处
  
  // 1. 提示信息
  //  1. 未选中行提示
  unselectedLine(){
    this.$Message.warning({
      content: '尚未选中行',
      duration: 1.5
    })
  },
}