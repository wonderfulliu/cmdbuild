<template>
  <Layout>
    <Layout>
      <Content>
        <h1 style="text-align: left;font-family: 'Microsoft JhengHei';padding-left: 15px;">任务列表</h1>
        <Table border
               stripe
               size="small"
               :height="tableHeight"
               :highlight-row="highlight"
               :loading="tLoading"
               :columns="wfColumns"
               :data="wfData">
        </Table>
      </Content>
    </Layout>
  </Layout>
</template>

<script>
export default {
  data() {
    return {
      //表格数据
      wfColumns: [],
      wfData: [],
      //表格配置
      tableHeight: '',
      highlight: true,
      tLoading: false,
    }
  },
  created() {
    this.wfColumns = [
      {
        title: '变更单号',
        key: 'bgdh'
      },
      {
        title: '变更类型',
        key: 'bglx'
      },
      {
        title: '工作流单号',
        key: 'gzldh'
      },
      {
        title: '工作流状态',
        key: 'gzlzt'
      },
      {
        title: '工作流生成时间',
        key: 'gzlscsj'
      },
      {
        title: '工作流完成时间',
        key: 'gzlwcsj'
      },
      {
        title: '执行人',
        key: 'zxr'
      },
    ];
    this.wfData = [
      {
        bgdh: '000000001',
        bglx: '变更应用',
        gzldh: '00000000101',
        gzlzt:'正在进行',
        gzlscsj: '2017-08-16 08:00:00',
        gzlwcsj: '',
        zxr: '王峰'
      },
      {
        bgdh: '000000002',
        bglx: '设备迁移',
        gzldh: '00000000102',
        gzlzt:'未开始',
        gzlscsj: '',
        gzlwcsj: '',
        zxr: '石书豪'
      },
      {
        bgdh: '000000003',
        bglx: '机柜调整',
        gzldh: '00000000103',
        gzlzt:'已完成',
        gzlscsj: '2017-08-17 08:32:16',
        gzlwcsj: '2017-08-17 08:36:02',
        zxr: '徐迪'
      },
    ];

  },
  mounted () {

  },
  methods: {

  }
}
</script>

<style>

</style>
