<template>
  <div>
    <el-container>
      <el-header>
        <el-row :gutter="20">
          <el-col :span="18" :offset="3">
            <div class="grid-content bg-purple">
              <div class="nav-left">
               <img src="../assets/NetEyez_2.png" aria-roledescription="logo" />
                <span class="nav-left-txt">NetEyez</span>
              </div>
              <div class="nav-right">
                  <div class="nav-input">
                      <el-select v-model="value" clearable placeholder="Select Pcap" @change="selectChange">
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </div>
                  <div class="nav-right-button">
                    <el-button type="success" @click="save">Save</el-button>
                    <el-button type="primary" @click="test">Test</el-button>
                    <el-button type="danger" @click="deleteFile">Delete</el-button>
                  </div>
              </div>
            </div>
            </el-col>
        </el-row>
      </el-header>
      <el-main>
        <el-row :gutter="20">
          <el-col :span="18" :offset="3">
            <el-card shadow="always">
              <el-input
                placeholder="输入关键字进行过滤"
                v-model="filterText">
              </el-input>
              <el-tree
                v-loading="fullscreenLoading"
                class="filter-tree"
                :data="dataTree"
                :props="defaultProps"
                default-expand-all
                @node-click="showDialog"
                :filter-node-method="filterNode"
                :render-content="renderContent"
                ref="tree">
              </el-tree>
            </el-card>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" center>
        <el-table
          :data="tableData"
          border
          :cell-style="rowStyle"
          style="width: 100%">
          <el-table-column
            label="Source File"
            >
            <template>
             <json-viewer
                :value="tableData[0].successJSON"
                :expand-depth="2" copyable
                :expanded="true"
                boxed
                sort></json-viewer>
            </template>
          </el-table-column>
          <el-table-column
            label="New File"
            >
            <template>
             <json-viewer
                :value="tableData[0].testJSON"
                :expand-depth="2" copyable
                :expanded="true"
                boxed
                sort></json-viewer>
            </template>
          </el-table-column>
        </el-table>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created () {
    this.getTree()
    this.selectList()
  },
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val)
    }
  },
  computed: {
    toJson (txt) {
      console.log(txt)
      txt.Substring(0, txt.length - 1)
      txt.Substring(0, 1)
      return txt
    }
  },
  methods: {
    filterNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    open (data) {
      this.$alert(`<div><strong>${data.label}</strong></div> <div><strong>${data.label}</strong></div>`, 'File Diff', {
        dangerouslyUseHTMLString: true
      })
    },
    openFullScreen1 () {
      this.fullscreenLoading = true
      setTimeout(() => {
        this.fullscreenLoading = false
      }, 2000)
    },
    async getTree () {
      const { data: res } = await this.$http.get('/test/loadYaml')
      if (res.code !== 200) return this.$message.error('Tree loading error')
      this.dataTree = res.data
    },
    async showDialog (dataRow, node) {
      if (dataRow.children) return
      if (!this.value) return this.$message.error('Please select pcap')
      this.fullscreenLoading = true
      const { data: res } = await this.$http.get(`/test/checkResult?datasource=${this.value}&path=neteyez-dashboard-neteyez/alarm`)
      this.dialogVisible = true
      this.fullscreenLoading = false
      this.tableData[0].successJSON = JSON.parse(res.data.successJSON)
      this.tableData[0].testJSON = JSON.parse(res.data.testJSON)
      this.dialogTitle = dataRow.label
    },
    async save () {
      if (!this.value) return this.$message.error('Please select a pcap')
      this.fullscreenLoading = true
      const { data: res } = await this.$http.post(`/test/saveResult/${this.value}`)
      if (res.code !== 200) return this.$message.error('Save error')
      this.fullscreenLoading = false
      this.$message.success('Save success')
    },
    async test () {
      if (!this.value) return this.$message.error('Please select a pcap')
      this.fullscreenLoading = true
      const { data: res } = await this.$http.post(`/test/testApi/${this.value}`)
      if (res.code !== 200) return this.$message.error('Test error')
      this.fullscreenLoading = false
      this.dataTree = res.data
      this.$message.success('Test success')
    },
    async deleteFile () {
      if (!this.value) return this.$message.error('Please select a pcap')
      this.fullscreenLoading = true
      const { data: res } = await this.$http.get(`/test/delete?datasource=${this.value}`)
      if (res.code !== 200) return this.$message.error('Delete error')
      this.fullscreenLoading = false
      this.getTree()
      this.$message.success('Delete success')
    },
    renderContent (h, { node, data, store }) {
      if (!data.children) {
        if (!data.success) {
          return (
            <span class="custom-tree-node">
              <span style="color: #F56C6C;">{node.label}</span>
            </span>)
        }
      }
      return (
        <span class="custom-tree-node">
          <span>{node.label}</span>
        </span>)
    },
    selectChange () {
      this.fullscreenLoading = true
      this.getTree()
      this.fullscreenLoading = false
    },
    async selectList () {
      const { data: res } = await this.$http.get('/test/getAllDataSource')
      if (res.code !== 200) return this.$message('Data source loading failed')
      const pcapList = res.data.map(e => ({ value: e.split('/').pop(), label: e.split('/').pop() }))
      this.options = pcapList.slice(2, pcapList.length)
      console.log(this.options)
    },
    rowStyle ({ row, column, rowIndex, columnIndex }) {
      return 'vertical-align: top;'
    }
  },
  data () {
    return {
      options: [{
        value: '1619173955336-3752_NetEyez_Demo_2021.pcapng',
        label: '1619173955336-3752_NetEyez_Demo_2021.pcapng'
      }, {
        value: '选项2',
        label: '2.pcap'
      }, {
        value: '选项3',
        label: '3.pcap'
      }],
      fullscreenLoading: false,
      value: '',
      filterText: '',
      dialogVisible: false,
      jsonText: '',
      dataTree: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      tableData: [{
        successJSON: "{'aa': 'aaaa', 'cc': 'dddd', 'd': [ {'a': 'b'}]}",
        testJSON: '{"bb": "bbbb"}'
      }],
      dialogTitle: 'File Diff'
    }
  }
}
</script>

<style scoped>
  .grid-content {
    min-height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
  }
  img {
    width: 50px;
    height: 50px;
  }
  .nav-right {
    display: flex;
  }
  .nav-input {
    margin-right: 10px;
  }
  .nav-right-button {
    display: flex;
    justify-content: space-around;
  }
  .el-table {
    margin-top: 0px;
  }
  .el-input {
    margin-bottom: 20px;
  }
  .nav-left {
    display: flex;
  }
  .nav-left-txt {
    display: flex;
    align-items: center;
    font-size: 30px;
    margin-left: 10px;
    color: #544c81;
  }
  .td-top {
    vertical-align: top;
  }
</style>
