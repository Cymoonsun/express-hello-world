const {MongoClient} = require("mongodb")

function mongoAction(action, info){
    return new Promise((resolve)=>{
        connectionString = process.env.MONGO_CONNECTION_STRING
        const client = new MongoClient(connectionString);
    
        client.connect()
        .then(async (client) => {
            if(action == "login"){
                const match = await client.db().collection("DnDUsers").findOne({
                    username: info.username,
                    password: info.password,
                });
               resolve(match)
            }
        })
        .catch(err => {
          console.error('Error connecting to the database:', err);
          res.status(500).send('Internal Server Error');
        }).finally(() => {
            client.close();
        });
    })
}

module.exports = mongoAction