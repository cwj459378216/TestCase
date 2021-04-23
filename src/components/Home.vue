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
                      <el-select v-model="value" clearable placeholder="请选择">
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </div>
                  <div class="nav-right-button">
                    <el-button type="success" @click="openFullScreen1">Save</el-button>
                    <el-button type="primary" @click="openFullScreen1">Test</el-button>
                    <el-button type="danger" @click="openFullScreen1">Delete</el-button>
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
                :data="data"
                :props="defaultProps"
                default-expand-all
                @node-click="dialogVisible = true"
                :filter-node-method="filterNode"
                ref="tree">
              </el-tree>
            </el-card>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
    <el-dialog title="File Diff" :visible.sync="dialogVisible" center>
        <el-table
          :data="tableData"
          border
          style="width: 100%">
          <el-table-column
            label="Source File"
            >
            <template>
             <json-viewer
                :value="{'aa': 'aaaa', 'cc': 'dddd', 'd': [ {'a': 'b'}]}"
                :expand-depth="4" copyable
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
                :value="{'aa': 'aaaa', 'cc': 'dddd', 'd': [ {'a': 'b'}]}"
                :expand-depth="4" copyable
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
    }
  },
  data () {
    return {
      options: [{
        value: '选项1',
        label: '1.pcap'
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
      data: [{
        id: 1,
        label: 'Dashboard',
        children: [{
          id: 4,
          label: 'NetWork',
          children: [{
            id: 9,
            label: 'Api-1'
          }, {
            id: 10,
            label: 'Api-2'
          }]
        }]
      }, {
        id: 2,
        label: '一级 2',
        children: [{
          id: 5,
          label: '二级 2-1'
        }, {
          id: 6,
          label: '二级 2-2'
        }]
      }, {
        id: 3,
        label: '一级 3',
        children: [{
          id: 7,
          label: '二级 3-1'
        }, {
          id: 8,
          label: '二级 3-2'
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      tableData: [{
        data: "{'aa': 'aaaa', 'cc': 'dddd', 'd': [ {'a': 'b'}]}",
        name: '{"bb": "bbbb"}'
      }]
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
</style>
