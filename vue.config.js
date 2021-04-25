module.exports =  {
  devServer: {
      proxy: {
          '/api': {
              target: 'http://192.168.0.22:8080',
              changeOrigin: true,
              pathRewrite: {
                "^/api": "" // 必须替换为空,不然会导致接口出错,因为拼接了api, ****文档中没有说明****
            }
          }
      }
  }
}
