// PROXY TO CONNECT FRONT END SERVER AND BACK END
// module.exports = {
//   devServer: {
//     proxy: {
//       "*":{
//         target: "http://localhost:5001",
//         changeOrigin: true,
//       }
//     }
//   }
// };


module.exports = {
  devServer: {
    proxy: "http://localhost:5001"
  }
};
// BELOW - ORIGINAL CODE THAT IS NOT BEING CURRENTLY USED

// const { defineConfig } = require('@vue/cli-service')
// module.exports = defineConfig({
//   transpileDependencies: true
// })