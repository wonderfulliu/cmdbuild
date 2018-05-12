<template>
  <div>
    <Sider ref="side1" hide-trigger collapsible width="240" :collapsed-width="0" v-model="isCollapsed">
        <Menu active-name="1-2" theme="dark" width="auto" :open-names="['1']" accordion>
          <Submenu name="1">
            <template slot="title">
              配置信息列表
            </template>
            <div class="treeContent">
              <Tree :data="data1" @on-select-change="getTreeNodes"></Tree>
            </div>
          </Submenu>
        </Menu>
      </Sider>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isCollapsed: false,
      data1: [
        {
          title: "parent 1",
          expand: true,
          children: [
            {
              title: "parent 1-1",
              expand: true,
              children: [
                {
                  title: "leaf 1-1-1",
                  expand: true,
                  selected: true
                },
                {
                  title: "leaf 1-1-2",
                  expand: true
                }
              ]
            },
            {
              title: "parent 1-2",
              expand: false,
              children: [
                {
                  title: "leaf 1-2-1",
                  expand: true
                },
                {
                  title: "leaf 1-2-2",
                  expand: true
                }
              ]
            }
          ]
        }
      ],
      which: '',
    };
  },
  methods: {
    getTreeNodes(select) {
      console.log(select);
      if (select.length != 0) {
        if (select[0].children && select[0].children.length != 0) {
          // 不是最终表
          select[0].selected = false;
          select[0].expand = !select[0].expand;
          // 将本来选中的表还保持选中状态
          this.keepSelected(select[0].children);
        } else {
          // 最终表
          this.which = select[0].title;
          console.log(this.which);
        }
      }
    },
    keepSelected(arr){
      // arr == select[0].children;
      arr.forEach((v, i) => {
        if (v.children && v.children.length != 0) {
          this.keepSelected(v.children);
        } else {
          if (v.title == this.which) {
            v.selected = true;
          }
        }
      })
    },
  },
};
</script>
