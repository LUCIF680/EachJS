const fs = require('fs');
const Handlebars = require("handlebars");
require('dotenv').config()
const chokidar = require('chokidar');

(async () => {  
    try {
        await fs.promises.access(process.env.BUILD_FOLDER_PATH);
    }catch(err) { 
        await fs.promises.mkdir(process.env.BUILD_FOLDER_PATH);
    }   

    const directories = ['views', 'viewModels', 'models']
    await directories.forEach(async (directory) => {
        try {
            await fs.promises.access(`${process.env.BUILD_FOLDER_PATH}/${directory}`);
        }catch(err) { 
            await fs.promises.mkdir(`${process.env.BUILD_FOLDER_PATH}/${directory}`);
        }   
    })
})()

chokidar.watch('src/').on('add', async (srcPath) => {
    const buildPath = srcPath.replace('src',process.env.BUILD_FOLDER_PATH);
    const data = await fs.promises.readFile(srcPath,'utf8')
    const template = Handlebars.compile(data)
    fs.promises.writeFile(
        buildPath,
        template({
            "staticUrl" : process.env.STATICURL,
            "baseUrl" : process.env.BASEURL
        })
        ,{ flag: 'w+' }
    )
});

    