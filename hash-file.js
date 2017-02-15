const fs = require('fs');
const csv = require('fast-csv');

const filename = '1487081003818.csv';

const data = fs.readFileSync(filename, "utf8");

csv.writeToString(
  [
    'H',
    1, // RequestCount
    
  ],
  {headers: true},
  function(err, data){
    console.log(data); //"a,b\na1,b1\na2,b2\n"
  }
);

fs.appendFile(filename, '', function (err) {
  console.error(err);
});
