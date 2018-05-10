<template>
    <div>
      <col span="3">
        <Dropdown>
            <Button type="primary">
              字段筛选
              <Icon type="arrow-down-b"></Icon>
            </Button>
            <DropdownMenu slot="list">
                <DropdownItem>驴打滚</DropdownItem>
                <Dropdown placement="right" v-for="(item, index) in arr" :key="index">
                    <DropdownItem @click.native="gg">
                        <Checkbox>{{item.cname}}</Checkbox>
                        <Icon type="ios-arrow-right"></Icon>
                    </DropdownItem>
                    <DropdownMenu slot="list">
                        <Input></Input>
                    </DropdownMenu>
                </Dropdown>
            </DropdownMenu>
        </Dropdown>
      </Col>
    </div>
</template>
<script>
export default {
  data() {
    return {
      arr: [{cname: 'a'}, {cname: 'b'}]
    };
  },
  methods: {
    gg(){
      console.log(1);
    },
  }
};
</script>
