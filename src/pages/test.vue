<template>
  <Dropdown trigger="click">
    <a href="javascript:void(0)">
      北京小吃
      <Icon type="arrow-down-b"></Icon>
    </a>
    <DropdownMenu slot="list">

      <Dropdown placement="right-start">
        <DropdownItem>
          <Checkbox :value="apple" true-value="true" false-value='false' @on-change="changeA(this)">
            苹果
          </Checkbox>
        </DropdownItem>
        <DropdownMenu slot="list">
          <DropdownItem>
            <Input v-model="appleVal" size="small" placeholder="请输入..."></Input>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>

      <Dropdown placement="right-start">
        <DropdownItem>
          <Checkbox :value="banana" true-value="banana" @on-change="changeA(this)">
            香蕉
          </Checkbox>
        </DropdownItem>
        <DropdownMenu slot="list">
          <DropdownItem>
            <Input v-model="bananaVal" size="small" placeholder="请输入..."></Input>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      
    </DropdownMenu>
  </Dropdown>
</template>
<script>
  export default {
    data() {
      return {
        apple:"",
        appleVal: "",
        banana: false,
        bananaVal: "",
      }
    },
    methods: {
      changeA(a) {
        console.log(a);
      },
    }
  }

</script>
