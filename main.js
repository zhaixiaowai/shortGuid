const http = require('http');
const fs = require("fs");
const url = require("url"); 
const server = http.createServer();
const HTTP_PORT = 3456; 
/**
 * 
 * @param {http.IncomingMessage} req request 
 * @param {http.ServerResponse} res response
 * @param {string} url_path url路径部分
 * @param {string} url_ext url扩展名 
 */
const onGet= function(req,res,url_path,url_ext){  
    let contentType;
    switch(url_ext){
        case "html":{
            contentType = "text/html";
            break;
        }
        case "js":{
            contentType = "text/javascript";
            break;
        }
        case "css":{
            contentType = "text/css";
            break;
        }
        case "png":case "jpg":case "jpeg":case "gif":case "icon":{
            contentType = `image/${url_ext}`;
            break;
        }
        default:{
            return false;
        }
    } 
    const filepath=`${__dirname}${url_path}`;
    fs.exists(filepath,exists=>{
        if(exists){
            var file = fs.createReadStream(filepath);
            res.writeHead(200, {'Content-Type' : contentType});
            file.pipe(res); 
        }else{
            output404(req,res,contentType);
        }
    }); 
    return true;
} 
/**
 * 
 * @param {http.IncomingMessage} req 
 * @param {http.ServerResponse} res 
 */
const output404 = (req,res,contentType)=>{
    if(!contentType){
        contentType = "text/plain";
    }
    res.setHeader("content-type",contentType);
    res.statusCode = 404; 
    res.write('404,url=');
    res.write(req.url);
    res.end();
};

server.on('request',
(req,res)=>{
    let url_path = url.parse(req.url).pathname; 
    if(url_path[url_path.length-1]==="/"){
        url_path += "index.html";
    } 
    let extindex = url_path.lastIndexOf(".");
    let ext;
    if(extindex===-1){
        ext = "";
    }else{
        ext = url_path.substr(extindex+1).toLowerCase();
    }
    switch(req.method){
        case "GET":{
            if(onGet(req,res,url_path,ext))return; 
            break;
        }
    }
    output404(req,res);
});

server.listen(HTTP_PORT,()=>{
    console.log(`服务端已开启,访问地址 http://127.0.0.1:${HTTP_PORT}/ `);
});