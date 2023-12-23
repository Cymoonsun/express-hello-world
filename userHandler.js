const mongo = require("mongodb")

function mongoAction(action, info){
    const uri = process.env.MONGO_CONNECTION_STRING;
    const client = new MongoClient(uri);

    client.connect()
    .then(async (client) => {
        let result = null
        if(action == "login"){
           const match = await client.db().collection("DnDUsers").findOne(user=> user.username == info.username && user.password == info.password) 
           result = match
        }
        client.db().close()
        return result
    })
    .catch(err => {
      console.error('Error connecting to the database:', err);
      res.status(500).send('Internal Server Error');
    });
    
}

module.exports = mongoAction