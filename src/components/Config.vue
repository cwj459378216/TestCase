<template>
<div>
  <el-form :model="form">
    <el-form-item label="Host" :label-width="formLabelWidth">
      <el-input v-model="form.host" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="Port" :label-width="formLabelWidth">
      <el-input v-model="form.port" autocomplete="off"></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="cancel">Cancel</el-button>
    <el-button type="primary" @click="save">Save</el-button>
  </div>
</div>
</template>

<script>
export default {
  data () {
    return {
      form: {
        host: '',
        port: 0,
        active: false
      },
      formLabelWidth: '60px',
      labelPosition: 'right'
    }
  },
  methods: {
    cancel () {
      this.$emit('cancel', false)
    },
    async save () {
      const { data: res } = await this.$http.put('/targetServer/', this.form)
      if (res.code !== 200) return this.$message('Host add failed')
      this.$message('Host add succeed')
      this.$emit('save', false)
    }
  }
}
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
}
</style>
