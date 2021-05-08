const  EmlParser = require('eml-parser');
const  fs = require('fs');
const glob = require('glob');
const async = require("async")
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

let contacts = [];


fs.writeFile('emails.csv','', function (err) {
    if (err) return console.log(err);
});
const csvWriter = createCsvWriter({
    path: 'emails.csv',
    header: [
        {id: 'name', title: 'NAME'},
        {id: 'address', title: 'ADDRESS'}
    ]
});

glob(__dirname + '/**/*.eml', {}, (err, files)=>{
    async.each(files, function(file, callback) {
        let emailFile = new EmlParser(fs.createReadStream(file)).parseEml().then(result => {
            contacts.push(result.from.value[0])
            callback();
        })
    }, function(err) {
        if( err ) {
            console.log('Process Failed');
        } else {
            csvWriter.writeRecords(contacts)       
            .then(() => {
                console.log('Done Writing CSV');
            });
            console.log('Process Complete');
        }
    });
})












