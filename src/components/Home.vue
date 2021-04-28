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
                <div class="nav-input product-select">
                      <el-select v-model="currentProduct" clearable placeholder="Select Producet" @change="changeProduct">
                      <el-option value="NetEyez">NetEyez 1.0</el-option>
                      <el-option value="ThunderBot">ThunderBot 4.5</el-option>
                      <el-option value="Synesis">Synesis 6.0</el-option>
                      <el-option value="Omnix">Omnix 3.0</el-option>
                    </el-select>
                  </div>
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
                    <el-button type="info" @click="dialogFormVisible = true" :disabled="fullscreenLoading">Setting</el-button>
                    <el-button type="success" @click="save" :disabled="fullscreenLoading">Save</el-button>
                    <el-button type="primary" @click="test" :disabled="fullscreenLoading">Test</el-button>
                    <el-button type="danger" @click="deleteFile" :disabled="fullscreenLoading">Delete</el-button>
                    <el-button @click="saveAll" :disabled="fullscreenLoading">Save All</el-button>
                    <el-button @click="testAll" :disabled="fullscreenLoading">Test All</el-button>
                    <el-button @click="uploadFileVisible = true" :disabled="fullscreenLoading">Upload File</el-button>
                    <el-button type="warning" @click="deleteAll" :disabled="fullscreenLoading">Delete All</el-button>
                  </div>
              </div>
            </div>
            </el-col>
        </el-row>
      </el-header>
      <el-main>
        <el-row :gutter="20">
          <el-col :span="18" :offset="3"  class="box-content">
            <el-col :span="7" class="hostTable">
              <el-card shadow="always" class="min-h">
                  <el-table
                    ref="singleTable"
                    :data="hostTable"
                    highlight-current-row
                    @current-change="handleCurrentChange"
                    style="width: 100%"
                    >
                    <el-table-column
                      label="Host List">
                        <template slot-scope="scope">
                            {{scope.row.host}}:{{scope.row.port}}
                        </template>
                    </el-table-column>
                     <el-table-column
                        fixed="right"
                        label="操作"
                        width="150">
                        <template slot-scope="scope">
                          <el-button @click="updateHost(scope.row.id)" v-if="scope.row.active"  type="text" size="small">Open</el-button>
                          <el-button @click="updateHost(scope.row.id)" v-else  type="text" size="small">Close</el-button>
                          <!-- <el-button type="text" size="small">Synchronize</el-button> -->
                        </template>
                      </el-table-column>
                  </el-table>
              </el-card>
            </el-col>
            <el-col :span="18">
              <el-card shadow="always" class="min-h">
                <el-input
                  placeholder="Enter keywords to filter"
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
          </el-col>
        </el-row>
      </el-main>
    </el-container>
    <el-dialog :title="dialogTitle" width="70%" top="5vh" :visible.sync="dialogVisible" center>
        <el-table
          :data="tableData"
          border
          :cell-style="rowStyle"
          style="width: 100%">
          <el-table-column
            label="Source File"
            >
             <template slot-scope="scope">
                <div v-html="scope.row.successJSON"></div>
             </template>
            <!-- <template>
             <json-viewer
                :value="tableData[0].successJSON"
                :expand-depth="2" copyable
                :expanded="true"
                boxed
                sort></json-viewer>
            </template> -->
          </el-table-column>
          <el-table-column
            label="New File"
            prop="testJSON"
            >
            <template slot-scope="scope">
                {{scope.row.testJSON}}
             </template>
          </el-table-column>
          <el-table-column
            label="Diff File"
            >
             <template slot-scope="scope">
                <div v-html="scope.row.diffJSON"></div>
             </template>
          </el-table-column>
        </el-table>
    </el-dialog>
    <el-dialog title="Setting" width="30%" :visible.sync="dialogFormVisible">
      <config @cancel="settingCancel" @save="settingSave"></config>
    </el-dialog>
    <el-dialog title="Upload" width="30%" :visible.sync="uploadFileVisible">
      <el-upload
        width="100%"
        class="upload-demo"
        accept="pcap"
        drag
        action="https://jsonplaceholder.typicode.com/posts/"
        multiple>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">Drag the file here，or<em> Click upload</em></div>
        <!-- <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div> -->
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
import Config from './Config'
import './home.css'

export default {
  components: { Config },
  created () {
    this.getTree()
    this.selectList()
    this.getHostList()
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
      if (res.code !== 200) return this.$message.error({ showClose: true, message: 'Tree loading error' })
      this.dataTree = res.data
    },
    async showDialog (dataRow, node) {
      console.log(dataRow)
      if (dataRow.children) return
      // if (!this.value) return this.$message.error({ showClose: true, message: 'Please select pcap' }) // 需要修改为根据dataSource请求,等待api接口
      this.fullscreenLoading = true
      const { data: res } = await this.$http.get(`/test/checkResult?datasource=${dataRow.datasource}&path=${dataRow.caller.path}`)
      this.dialogVisible = true
      this.fullscreenLoading = false
      this.tableData[0].successJSON = res.data.successJSON ? res.data.successJSON : ''
      this.tableData[0].testJSON = res.data.testJSON ? res.data.testJSON : ''
      const diff = this.diff(this.tableData[0].successJSON, this.tableData[0].testJSON)
      console.log(this.tableData)
      console.log(diff)
      console.log(this.nodeToString(diff))
      this.tableData[0].diffJSON = this.nodeToString(diff)
      this.dialogTitle = dataRow.label
    },
    async save () {
      if (!this.value) return this.$message.error({ showClose: true, message: 'Please select a pcap' })
      this.fullscreenLoading = true
      const { data: res } = await this.$http.post(`/test/saveResult?datasource=${this.value}`)
      if (res.code !== 200) return this.$message.error({ showClose: true, message: 'Save error' })
      this.fullscreenLoading = false
      this.$message.success({ showClose: true, message: 'Save success' })
    },
    async test () {
      if (!this.value) return this.$message.error({ showClose: true, message: 'Please select a pcap' })
      this.fullscreenLoading = true
      const { data: res } = await this.$http.post(`/test/testApi?datasource=${this.value}`)
      if (res.code !== 200) return this.$message.error('Test error')
      this.fullscreenLoading = false
      this.dataTree = res.data
      this.$message.success({ showClose: true, message: 'Test success' })
    },
    async deleteFile () {
      if (!this.value) return this.$message.error({ showClose: true, message: 'Please select a pcap' })
      this.fullscreenLoading = true
      const { data: res } = await this.$http.get(`/test/delete?datasource=${this.value}`)
      if (res.code !== 200) return this.$message.error({ showClose: true, message: 'Delete error' })
      this.fullscreenLoading = false
      this.getTree()
      this.$message.success({ showClose: true, message: 'Delete success' })
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
    changeProduct () {
      console.log(this.currentProduct)
    },
    async selectList () {
      const { data: res } = await this.$http.get('/test/getAllDataSource')
      if (res.code !== 200) return this.$message('Data source loading failed')
      // const pcapList = res.data.map(e => ({ value: e, label: e.split('/').pop() }))
      // this.options = pcapList.slice(2, pcapList.length)
      this.options = res.data.map(e => ({ value: e, label: e }))
      console.log(this.options)
    },
    rowStyle ({ row, column, rowIndex, columnIndex }) {
      return 'vertical-align: top;'
    },
    diff (oldJson, newJson) {
      let color = ''
      let span = ''
      let bold = 0
      const diff = this.$diff.diffChars(oldJson, newJson)
      console.log(diff)
      const fragment = document.createDocumentFragment()
      diff.forEach(function (part) {
        color = part.added ? 'red' : part.removed ? 'green' : 'grey'
        bold = part.added ? 900 : part.removed ? 700 : 0
        span = document.createElement('span')
        span.style.color = color
        span.style.fontWeight = bold
        span.appendChild(document.createTextNode(part.value))
        fragment.appendChild(span)
      })
      return fragment
    },
    nodeToString (node) {
      let tmpNode = document.createElement('div')
      tmpNode.appendChild(node.cloneNode(true))
      const str = tmpNode.innerHTML
      tmpNode = node = null
      return str
    },
    async saveAll () {
      this.fullscreenLoading = true
      const urls = []
      for (const i of this.options) {
        urls.push(this.$http.post(`/test/saveResult?datasource=${i.value}`))
      }
      this.$http.all(urls).then(res => {
        console.log(res)
        for (const b of res) {
          if (b.status !== 200) return this.$message.error({ showClose: true, message: 'Save error' })
        }
        this.fullscreenLoading = false
        this.$message.success({ showClose: true, message: 'Save success' })
      })
    },
    deleteAll () {
      this.fullscreenLoading = true
      const urls = []
      for (const i of this.options) {
        urls.push(this.$http.get(`/test/delete?datasource=${i.value}`))
      }
      this.$http.all(urls).then(res => {
        for (const b of res) {
          if (b.status !== 200) return this.$message.error({ showClose: true, message: 'Save error' })
        }
        this.fullscreenLoading = false
        this.getTree()
        this.$message.success({ showClose: true, message: 'Delete success' })
      })
    },
    testAll () {
      this.fullscreenLoading = true
      const urls = []
      const treeData = []
      for (const i of this.options) {
        urls.push(this.$http.post(`/test/testApi?datasource=${i.value}`))
      }
      this.$http.all(urls).then(res => {
        for (const b of res) {
          if (b.status !== 200) return this.$message.error('Test error')
          treeData.push({ label: b.data.data[0].datasource, children: b.data.data })
        }
        this.fullscreenLoading = false
        console.log(res)
        console.log(treeData)
        this.dataTree = treeData
        this.$message.success({ showClose: true, message: 'Test success' })
      })
    },
    settingCancel (bool) {
      this.dialogFormVisible = bool
    },
    settingSave (bool) {
      this.dialogFormVisible = bool
      this.getHostList()
    },
    async getHostList () {
      const { data: res } = await this.$http.get('/setting/all')
      if (res.code !== 200) return this.$message('Host list loading failed')
      this.hostTable = res.data
      this.hostTable.forEach(e => {
        if (e.active) this.setCurrent(e)
      })
    },
    changeCurrentHost () {
      this.$confirm('This will change the test server and continue?', 'Prompt', {
        confirmButtonText: 'Ok',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: 'Successfully modified!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'Cancelled!'
        })
      })
    },
    setCurrent (row) {
      this.$refs.singleTable.setCurrentRow(row)
    },
    handleCurrentChange (val) {
      this.currentRow = val
    },
    handleClick (row) {
      console.log(row)
    },
    async updateHost (id) {
      const { data: res } = await this.$http(`/setting/active?id=${id}`)
      if (res.code !== 200) return this.$message('Host update failed')
      this.$message('Host update succeed')
      this.getHostList()
    }
  },
  data () {
    return {
      options: [
        {
          value: '/datastore/admin/pcap/sho-san.pcap',
          label: 'sho-san.pcap'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }
      ],
      fullscreenLoading: false,
      value: '',
      filterText: '',
      dialogVisible: false,
      dialogFormVisible: false,
      uploadFileVisible: false,
      jsonText: '',
      dataTree: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      tableData: [{
        successJSON: "{'aa': 'aaaa', 'cc': 'dddd', 'd': [ {'a': 'b'}]}",
        testJSON: '{"bb": "bbbb"}',
        diffJSON: ''
      }],
      dialogTitle: 'File Diff',
      hostTable: [
        { id: 0, host: '192.168.1.1', port: 8009, active: true }
      ],
      currentRow: null,
      currentProduct: 'NetEyez'
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
  .box-content {
    display: flex;
    justify-content: space-between;
  }
  .min-h {
    min-height: 360px;
  }
</style>
