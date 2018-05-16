<template>
  <div>
    <button @click="gettableEname">查找</button>
  </div>
</template>
<script>
export default {
  data() {
    return {
      data: [
        {
          name: "tab-1",
          selected: false,
          children: [
            {
              name: "hehe",
              id: "tab-1-hehe-1",
              selected: false,
              children: [
                {
                  name: "haha",
                  id: "1",
                  selected: false
                },
                {
                  name: "haha1",
                  selected: false
                },
                {
                  name: "haha2",
                  selected: false
                }
              ]
            },
            {
              name: "hehe2",
              id: "tab-1-hehe2-1",
              selected: false,
              children: [
                {
                  name: "haha",
                  id: "2",
                  selected: false
                },
                {
                  name: "haha3",
                  selected: false
                },
                {
                  name: "haha4",
                  selected: false
                }
              ]
            },
            {
              name: "hehe3",
              selected: false,
              children: [
                {
                  name: "haha5",
                  selected: false
                },
                {
                  name: "haha6",
                  selected: false
                },
                {
                  name: "haha27",
                  selected: false
                }
              ]
            }
          ]
        },
        {
          name: "tab-2",
          selected: false,
          children: [
            {
              name: "hehe4",
              selected: false,
              children: [
                {
                  name: "haha33",
                  selected: false
                },
                {
                  name: "haha64",
                  selected: false
                },
                {
                  name: "haha28",
                  selected: false
                }
              ]
            },
            {
              name: "hehe244",
              selected: false,
              children: [
                {
                  name: "haha666",
                  selected: false
                },
                {
                  name: "haha00",
                  selected: false
                },
                {
                  name: "haha42",
                  selected: false
                }
              ]
            },
            {
              name: "hehe345",
              id: "tab-2-hehe345-3",
              selected: false,
              children: [
                {
                  name: "haha22233",
                  selected: false
                },
                {
                  name: "haha",
                  id: "3",
                  selected: false
                },
                {
                  name: "haha33443",
                  selected: false
                }
              ]
            }
          ]
        }
      ],
      flag: true,
      tableDetailmsg: [],
    };
  },
  methods: {
    search(){
      this.flag = true;
      this.tableDetailmsg = [];
      this.gettableEname(this.data, 'haha666');
    },
    gettableEname(tableMenu, tableCname) {
      let len = tableMenu.length;
      tableMenu.forEach((v, i) => {
        if (!this.flag) {
          this.tableDetailmsg.push(v);
          return false; //从内层开始往数组里面 push
        }
        if (v.children && v.children.length > 0) {
          // 如果有子元素, 那么就一直往下遍历
          this.gettableEname(v.children, tableCname);
        } else {
          // 直到找到最内层
          if (v.name == tableCname) {
            // 找到了
            console.log("找到了!");
            this.tableDetailmsg.push(v);
            this.flag = false;
            return false; //结束当前循环
          }
        }
      });
    }
  }
};
</script>
