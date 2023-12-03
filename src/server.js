const path = require('path')
const http = require('http')
const ejs = require('ejs');
const express = require('express')
const open = require('open');
let port = 30000
module.exports = function ({stats}) {
    // 启动一个服务器来显示统计结果
    const app = express()
    app.set('view engine', 'ejs')
    app.set('views', path.resolve(__dirname, '../views')) // 设置视图目录
    app.use(express.static(path.resolve(__dirname, '../public'))) // 托管静态文件

    app.get('/', (req, res) => {
        res.render('index', { ...stats });
    });

    const server = http.createServer(app)
    server.listen(port)
    server.on('error', (error) => {
        if (error.code === 'EADDRINUSE') {
            console.log(`Port ${port} is in use, trying another one...`)
            port++
            server.close()
            server.listen(port)
        } else {
            throw error
        }
    })
    server.on('listening', () => {
        console.log(`Server is running at http://localhost:${port}`)
        open(`http://localhost:${port}`)
    })
}