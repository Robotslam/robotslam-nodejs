const fs = require('fs');
const express = require('express');
const exportCsv = require('../modules/wifi/export');
const csv_string = require('../modules/wifi/csv_string');
const router = express.Router();

router.get('/', function (req, res, next) {

  fs.readdir('data/raw', (err, files) => {
    if (err) {
      return res.status(500).send(err);
    }

    const filteredFiles = files.filter((item) => {
      return item.split('.').pop() == 'json';
    });

    res.render('export', {
      title: 'Export',
      files: filteredFiles
    });

  });
});

router.post('/', function (req, res, next) {

  const filename = req.body.file;
  const fileWithoutExt = filename.split('.')[0];
  const newFilename = fileWithoutExt + '.csv';


  fs.readFile('data/raw/' + fileWithoutExt + '.json', 'utf-8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send(err);
    }

    res.setHeader('content-disposition', 'attachment; filename=' + newFilename);

    const parsedJson = JSON.parse(data);
    csv_string(exportCsv(parsedJson)).then((output) => {
      res.send(output);
    });

  });

});

module.exports = router;
