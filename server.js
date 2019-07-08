const fs = require('fs');
const express = require('express')
const process = require('process');
const {exec} = require('child_process');
const bodyParser = require('body-parser');
var zipper = require("zip-local");

const app = express()
 
app.use(express.static('.'))
app.use(bodyParser.text());

app.get('/', function (req, res) {
  res.send('Hello World')
})

app.post('/webdev', function (req, res) {
  
  var webString = "import 'package:flutter_web/material.dart';"
  var newContent = webString +"\n//"+ req.body;

  // working dir is already sample-flutter-project
  var path = "lib/main.dart";
  fs.writeFile(path, newContent, function(err) {
    if (err) {
      return console.log(err);
    }
    console.log("Saved file.");
  });

  res.send(req.body);
})

app.get('/download', function (req, res) {
  //exportZip()
  //res.download('../project.zip')

})
 

process.chdir("sample-flutter-project");

startWebDevServe()

app.listen(3000)
exportZip();

function doWebDevBuild() {
    exec("webdev build", (err, stdout, stderr) => {
        if (err) {
                console.log(err);
        }
        console.log("Kicking off a webdev build");
        console.log("This may take a while");
    });
}

function startWebDevServe() {
    exec("webdev serve", (err, stdout, stderr) => {
        if (err) {
                console.log(err);
        }
        console.log(stdout);
    });
    console.log("Starting webdev serve");
}

function exportZip() {
  console.log("Started to zip")
  zipper.sync.zip(".").compress().save("../project.zip");

}

// Courtesy of https://github.com/Stuk/jszip/issues/386#issuecomment-508217874
function getZippedFolderSync(dir) {
	let allPaths = getFilePathsRecursiveSync(dir)

	let zip = new JSZip()
	let zipped = zip.sync(() => {
		for (let filePath of allPaths) {
			let addPath = path.relative(path.join(dir, ".."), filePath)
			// let addPath = path.relative(dir, filePath) // use this instead if you don't want the source folder itself in the zip

			let data = fs.readFileSync(filePath)
			zip.file(addPath, data)
		}
		let data = null;
		zip.generateAsync({type:"nodebuffer"}).then((content) => {
			data = content;
		});
		return data;
	})
	return zipped;
}

// returns a flat array of absolute paths of all files recursively contained in the dir
function getFilePathsRecursiveSync(dir) {
	var results = []
	list = fs.readdirSync(dir)
	var pending = list.length
	if (!pending) return results

	for (let file of list) {
		file = path.resolve(dir, file)
		let stat = fs.statSync(file)
		if (stat && stat.isDirectory()) {
			res = getFilePathsRecursiveSync(file)
			results = results.concat(res)
		} else {
			results.push(file)
		}
		if (!--pending) return results
	}

	return results
}