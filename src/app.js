const express = require('express');
const morgan = require('morgan');
const path = require('path');
const { exec } = require("child_process");
const app = express();

//Settings
app.set('port', process.env.PORT || 3000)

//Middlewares
app.use(morgan('dev'));
app.use(express.json());

//Routes
app.get('/carpeta', (req, res) => {
    const dir = req.query.dir
    let directoryPath = path.join(__dirname+'/root/'+dir)
    exec('ls -l', {cwd: directoryPath}, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        let filesDirectorys = stdout.split("\n")
        filesDirectorys = filesDirectorys.slice(1, filesDirectorys.length-1)
        let result = []
        filesDirectorys.map( element =>{
            let fileDirectory = element.split(" ")
            result.push({
                permissions: fileDirectory[0].split(''),
                owner:  fileDirectory[2],
                fileDirName: fileDirectory[fileDirectory.length-1]
            })
        })
        res.json(result)
    });
})

app.post('/api/addFileOrDirectory', (req, res) => {
    const dir = req.body.dir
    const type = req.body.type
    const name = req.body.name
    let directoryPath = path.join(__dirname+'/root/'+dir)
    let command = 'mkdir '+ name
    if(type =="Archivo"){
        command = 'touch '+ name
    }
    exec(command, {cwd: directoryPath}, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });
    
    res.json('Hello world')
})

app.post('/api/action', (req, res) => {
    const currentDir = req.body.currentDir
    const action = req.body.action
    const detinationDir = req.body.detinationDir
    const fileDirectoryName = req.body.fileDirectoryName
    let directoryPath = path.join(__dirname+'/root/'+currentDir)
    let command = ''
    if(action == "copy"){
        command = 'cp -R '+ fileDirectoryName + ' ' + detinationDir
    }
    else if(action == "moveCut"){
        command = 'mv '+ fileDirectoryName + ' ' + detinationDir
    }
    exec(command, {cwd: directoryPath}, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });
    
    res.json('Hello world')
})

app.post('/api/delete', (req, res) => {
    const dir = req.body.dir
    const fileDirectoryName = req.body.fileDirectoryName
    let directoryPath = path.join(__dirname+'/root/'+dir)
    exec("rm -R " + fileDirectoryName, {cwd: directoryPath}, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });
    
    res.json('Hello world')
})

app.post('/api/changeName', (req, res) => {
    const dir = req.body.dir
    const oldName = req.body.oldName
    const newName = req.body.newName
    let directoryPath = path.join(__dirname+'/root/'+dir)
    exec("mv " + oldName + " " + newName, {cwd: directoryPath}, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });
    
    res.json('Hello world')
})

//Static files
app.use(express.static(path.join(__dirname, 'public')));

//HTML en todas las rutas para react
app.get('*', (req, res) => res.sendFile(path.join(__dirname+'/public/index.html')));

//Starting the server
app.listen(app.get('port'), () => {
    console.log(`server on port ${app.get('port')}`);
}); 