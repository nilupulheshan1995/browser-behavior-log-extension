var express = require("express");
var cors = require("cors");
const {pushtoArray,saveJsonFile,readJsonFilesInFolder} = require("../helpers/file-save");
var router = express.Router();
var app = express();

// Enable CORS for all routes
app.use(
  cors({
    origin: "*",
  })
)

/* GET home page. */
router.get("/", function (req, res) {
  res.json({ response: "NHR" });
});

router.post("/", function (req, res) {
    const data = req.body?.logData?.logObject
    const hostName = data.urlDetails.hostname
    data.elements = "REMOVED"
    console.log('------------------------------------------->',data.timeStamp);
	  pushtoArray(`./data/${hostName}.json`,  data || "NOT FOUND")
  	console.log("LOG",new Date().toISOString(), req.method, hostName);
  	res.json({ body: req.body });
});

router.post("/summerize", function (req, res) {
  let dataArray = readJsonFilesInFolder('./data')
  dataArray = dataArray.flat().map(obj => ({...obj,elements:"not include in summery"})).sort((a,b) => new Date(a.timestamp) - new Date(b.timestamp));
  saveJsonFile('./data/summery/summery.json',dataArray)

  console.log("LOG",new Date().toISOString(), req.method, `length = ${dataArray.length}`);
  res.json({ body: dataArray.length });
});

module.exports = router;
