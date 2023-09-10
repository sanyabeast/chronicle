const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: '',

  pages: {
    chronicle: {
      entry: 'src/main.ts',
      template: 'public/index.html',
      filename: 'index.html',
      title: 'chronicle',
    },
    sitemap: {
      entry: 'src/sitemap.ts',
      template: 'public/sitemap.html',
      filename: 'sitemap.html',
      title: 'sitemap',

    }
  },


  chainWebpack: (config) => {
    // Add a new rule to handle YAML files
    config.module
      .rule('yaml')
      .test(/\.ya?ml$/)
      .use('yaml-loader')
      .loader('yaml-loader')
      .end();
  },
})