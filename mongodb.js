const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const ObjectID = mongodb.ObjectID;

const connectionURL = 'mongodb://127.0.0.1:27017';
const database = 'task-manager';

MongoClient.connect(connectionURL, { useNewUrlParser: true}, (error, client) => {
    if(error){
        return console.log("Unable to connect to DB!");
    }

    console.log('Successfully connected to Client');

    const db = client.db(database);

    const deleted = db.collection('tasks').deleteMany({
        completed: true
    })

    deleted.then((result) => {
        console.log(result);
    }).then((error) => {
        console.log(error);
    })

//     const updatedList = db.collection('tasks').updateMany({
//         completed: false
//     },
//     {
//         $set: {
//             completed: true
//         }
//     } 
//     )

//     updatedList.then((result) => {
//         console.log(result);
//     }).catch((error) => {
//         console.log(error);
//     })

 })
