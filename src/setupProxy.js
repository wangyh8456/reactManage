const proxy = require('http-proxy-middleware')

module.exports=function(app){
    app.use(
        proxy.createProxyMiddleware('/api',{
            // target:'http://192.168.11.2:8890',
            target:'http://123.56.85.203:8890',
            changeOrigin:true,
            pathRewrite:{'^/api':''}
        }),
    )
}