<template>
  <div id="searchContainer">
    <div class="layout">
        <Layout>
            <Sider ref="side1" hide-trigger collapsible :collapsed-width="0" v-model="isCollapsed">
                <Menu active-name="1-2" theme="dark" width="auto" :class="menuitemClasses">
                    <Submenu name="1">
                        <template slot="title">
                            <Icon type="ios-navigate"></Icon>
                            Item 1
                        </template>
                        <MenuItem name="1-1">
                            <Icon type="clipboard"></Icon>
                            <span>Option 1</span>
                        </MenuItem>
                        <MenuItem name="1-2">
                            <Icon type="clipboard"></Icon>
                            Option 2
                        </MenuItem>
                        <MenuItem name="1-3">
                            <Icon type="clipboard"></Icon>
                            Option 3
                        </MenuItem>
                    </Submenu>
                    <MenuItem name="1-1">
                        <Icon type="clipboard"></Icon>
                        <span>Option 1</span>
                    </MenuItem>
                </Menu>
            </Sider>
            <Layout>
                <Header :style="{padding: 0}" class="layout-header-bar">
                    <Icon @click.native="collapsedSider" :class="rotateIcon" :style="{margin: '20px 20px 0'}" type="navicon-round" size="24"></Icon>
                    <div class="btnContainer">
                        <Button type="primary" size="large" icon="ios-search">Search</Button>
                        <Input v-model="msg" size="large" placeholder="Enter something..." clearable style="width: 280px"></Input>
                    </div>
                </Header>
                <Content :style="{margin: '15px'}">
                    <Table stripe height="410" border :columns="columns2" :data="data4" ref="table"></Table>
                    <div style="margin-top: 10px;margin-right: 30px;float:right;">
                        <Page :current="2" :total="50" simple></Page>
                    </div>
                    <br>
                    <div class="btn">
                      <Button type="primary" size="small" @click="exportData(1)"><Icon type="ios-download-outline"></Icon> 原始</Button>
                      <Button type="primary" size="small" @click="exportData(2)"><Icon type="ios-download-outline"></Icon> 排序/过滤</Button>
                      <Button type="primary" size="small" @click="exportData(3)"><Icon type="ios-download-outline"></Icon> 自定义</Button>
                    </div>
                </Content>
            </Layout>
        </Layout>
      </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      msg: "",
      isCollapsed: false,
      columns2: [
        {
          title: "Name",
          key: "name",
          width: 100,
          fixed: "left",
          sortable: true,
          render: (h, params) => {
            return h("div", [
              h("Icon", {
                props: {
                  type: "person"
                }
              }),
              h("strong", params.row.name)
            ]);
          }
        },
        {
          title: "Age",
          key: "age",
          width: 100,
          filters: [
            {
              label: "More than 24",
              value: 1
            },
            {
              label: "Less than 24",
              value: 2
            },
            {
              label: "same with 24",
              value: 3
            }
          ],
          filterMultiple: false,
          filterMethod(value, row) {
            if (value === 1) {
              return row.age > 24;
            } else if (value === 2) {
              return row.age < 24;
            } else if (value === 3) {
              return row.age == 24;
            }
          }
        },
        {
          title: "Province",
          key: "province",
          width: 100
        },
        {
          title: "Province",
          key: "province",
          width: 100
        },
        {
          title: "Province",
          key: "province",
          width: 100
        },
        {
          title: "Province",
          key: "province",
          width: 100
        },
        {
          title: "City",
          key: "city",
          width: 100
        },
        {
          title: "Address",
          key: "address",
          width: 200
        },
        {
          title: "Address",
          key: "address",
          width: 200
        },
        {
          title: "Address",
          key: "address",
          width: 200
        },
        {
          title: "Address",
          key: "address",
          width: 200
        },
        {
          title: "Postcode",
          key: "zip",
          width: 100
        },
        {
          title: "Action",
          key: "action",
          fixed: "right",
          width: 120,
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "text",
                    size: "small"
                  },
                  style: {},
                  on: {
                    click: () => {
                      this.show(params.index);
                    }
                  }
                },
                "View"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "text",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.remove(params.index);
                    }
                  }
                },
                "Delete"
              )
            ]);
          }
        }
      ],
      data4: [
        {
          name: "John Brown",
          age: 18,
          address: "New York No. 1 Lake Park",
          province: "America",
          city: "New York",
          zip: 100000
        },
        {
          name: "John Brown",
          age: 18,
          address: "New York No. 1 Lake Park",
          province: "America",
          city: "New York",
          zip: 100000
        },
        {
          name: "John Brown",
          age: 18,
          address: "New York No. 1 Lake Park",
          province: "America",
          city: "New York",
          zip: 100000
        },
        {
          name: "John Brown",
          age: 18,
          address: "New York No. 1 Lake Park",
          province: "America",
          city: "New York",
          zip: 100000
        },
        {
          name: "John Brown",
          age: 18,
          address: "New York No. 1 Lake Park",
          province: "America",
          city: "New York",
          zip: 100000
        },
        {
          name: "Jim Green",
          age: 24,
          address: "Washington, D.C. No. 1 Lake Park",
          province: "America",
          city: "Washington, D.C.",
          zip: 100000
        },
        {
          name: "Joe Black",
          age: 30,
          address: "Sydney No. 1 Lake Park",
          province: "Australian",
          city: "Sydney",
          zip: 100000
        },
        {
          name: "Jon Snow",
          age: 26,
          address: "Ottawa No. 2 Lake Park",
          province: "Canada",
          city: "Ottawa",
          zip: 100000
        },
        {
          name: "John Brown",
          age: 18,
          address: "New York No. 1 Lake Park",
          province: "America",
          city: "New York",
          zip: 100000
        },
        {
          name: "Jim Green",
          age: 24,
          address: "Washington, D.C. No. 1 Lake Park",
          province: "America",
          city: "Washington, D.C.",
          zip: 100000
        },
        {
          name: "Joe Black",
          age: 30,
          address: "Sydney No. 1 Lake Park",
          province: "Australian",
          city: "Sydney",
          zip: 100000
        },
        {
          name: "Jon Snow",
          age: 26,
          address: "Ottawa No. 2 Lake Park",
          province: "Canada",
          city: "Ottawa",
          zip: 100000
        }
      ]
    };
  },
  computed: {
    rotateIcon() {
      return ["menu-icon", this.isCollapsed ? "rotate-icon" : ""];
    },
    menuitemClasses() {
      return ["menu-item", this.isCollapsed ? "collapsed-menu" : ""];
    }
  },
  methods: {
    collapsedSider() {
      this.$refs.side1.toggleCollapse();
    },
    show(index) {
      this.$Modal.info({
        title: "User Info",
        content: `Name：${this.data4[index].name}<br>Age：${
          this.data4[index].age
        }<br>Address：${this.data4[index].address}`
      });
    },
    remove(index) {
      this.data4.splice(index, 1);
    },
    exportData(type) {
      if (type === 1) {
        this.$refs.table.exportCsv({
          filename: "The original data"
        });
      } else if (type === 2) {
        this.$refs.table.exportCsv({
          filename: "Sorting and filtering data",
          original: false
        });
      } else if (type === 3) {
        this.$refs.table.exportCsv({
          filename: "Custom data",
          columns: this.columns2.filter((col, index) => index < 4),
          data: this.data4.filter((data, index) => index < 4)
        });
      }
    }
  }
};
</script>
 
<style lang="scss">
#searchContainer {
  height: 100%;
  margin-left: -1px;
  .layout {
    height: 100%;
    .btnContainer {
      overflow: hidden;
      padding-top: 20px;
      padding-right: 145px;
      .ivu-input-wrapper {
        float: right;
      }
      button {
        float: right;
        margin-left: 5px;
        .ivu-icon {
          margin-top: 3px;
        }
      }
    }
    .ivu-layout {
      height: 100%;
      .btn {
        float: left;
        overflow: hidden;
        margin-left: 15px;
        .ivu-btn-primary {
          float: left;
          margin-right: 10px;
        }
      }
    }
  }
  .ivu-table-wrapper {
    width: 100%;
  }
}

// 以下是原生样式
.layout {
  border: 1px solid #d7dde4;
  background: #f5f7f9;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
}
.layout-header-bar {
  background: #fff;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
}
.layout-logo-left {
  width: 90%;
  height: 30px;
  background: #5b6270;
  border-radius: 3px;
  margin: 15px auto;
}
.menu-icon {
  transition: all 0.3s;
}
.rotate-icon {
  transform: rotate(-90deg);
}
.menu-item span {
  display: inline-block;
  overflow: hidden;
  width: 69px;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: bottom;
  transition: width 0.2s ease 0.2s;
}
.menu-item i {
  transform: translateX(0px);
  transition: font-size 0.2s ease, transform 0.2s ease;
  vertical-align: middle;
  font-size: 16px;
}
.collapsed-menu span {
  width: 0px;
  transition: width 0.2s ease;
}
.collapsed-menu i {
  transform: translateX(5px);
  transition: font-size 0.2s ease 0.2s, transform 0.2s ease 0.2s;
  vertical-align: middle;
  font-size: 22px;
}
</style>
