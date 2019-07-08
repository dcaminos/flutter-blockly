const fs = require('fs');
const express = require('express')
const process = require('process');
const {exec} = require('child_process');
const bodyParser = require('body-parser');
const app = express()
 
app.use(express.static('.'))
app.use(bodyParser.text());

app.get('/', function (req, res) {
  res.send('Hello World')
})

app.post('/webdev', function (req, res) {
  console.log(req.body);
  var newContent = req.body;

  var path = "test-d.dart";
  fs.writeFile(path, newContent, function(err) {
    if (err) {
      return console.log(err);
    }
    console.log("Saved file.");
  });


  res.send(req.body);
})
 



startWebDevServe()

app.listen(3000)

function doWebDevBuild(data) {
  process.chdir("sample-flutter-project");
    exec("webdev build", (err, stdout, stderr) => {
        if (err) {
                console.log(err);
        }
        console.log("Kicking off a webdev build");
        console.log("This may take a while");
    });
}

function startWebDevServe() {
    process.chdir("sample-flutter-project");
    exec("webdev serve", (err, stdout, stderr) => {
        if (err) {
                console.log(err);
        }
        console.log(stdout);
    });
    console.log("Starting webdev serve");
}

function exportZip() {

}