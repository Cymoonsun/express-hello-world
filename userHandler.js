import { MongoClient } from "mongodb";
import bcrypt from "bcrypt";
import BcryptSalt from "bcrypt-salt";
import fs from "fs"

const bs = new BcryptSalt();
const connectionString = process.env.MONGO_CONNECTION_STRING

function resultDb(result, message, data = {}) {
  return {
    result: result,
    message: message,
    data: data,
  };
}

async function mongoAction(action, info) {
  let client;
  let mongoSession

  try {
    client = await MongoClient.connect(connectionString);
    mongoSession = client.startSession(); 

    if (action === "login") {
      const match = (await client.db().collection("DnDUsers").findOne({
        username: info.username,
      })) || false;

      if (!match)
        return resultDb(false, "Bad User or Psw", {
          redirectTo: "/login",
        });

      const valid = bcrypt.compareSync(info.password, match.password);

      if (!valid)
        return resultDb(false, "Bad User or Psw", {
          redirectTo: "/login",
        });

      return resultDb(true, "Login ok", Object.assign({}, match));
    } else if (action === "signup") {
      const match = await client.db().collection("DnDUsers").findOne({
        username: info.username,
      });

      if (match) {
        return resultDb(false, "Invalid User or Psw", {
          redirectTo: "/signup",
        });
      } else {
        if (!isValidUsername(info.username) || !isValidPassword(info.password)) {
          return resultDb(false, "Invalid User or Psw", {
            redirectTo: "/signup",
          });
        } else {
          const hashedPsw = bcrypt.hashSync(info.password, bs.saltRounds);

          const result = await client.db().collection("DnDUsers").insertOne({
            username: info.username,
            password: hashedPsw,
          });

          return resultDb(true, "insert ok", result);
        }
      }
    }
    else if(action == "sendFriendRequest"){
      const sendRequest = await client.db().collection("DnDUsers").updateOne({
        username: info.body.potentialFriend,
        friendRequests: {
          $nin: [info.session.user.username]
        }
      },
      {
        $push:{
          friendRequests: info.session.user.username
        }
      })
      if(!sendRequest) resultDb(false, "request failed or already sent", {})
      return resultDb(true, "request sent", {})
    }
    else if(action == "getFriendRequests"){
      const mongoResult = await client.db().collection("DnDUsers").findOne({
        username: info.session.user.username
      })
      return resultDb(true, "", mongoResult.friendRequests || [])
    }
    else if(action == "acceptFriendRequest"){
      mongoSession.startTransaction()
      const mongoResultA = await client.db().collection("DnDUsers").updateOne({
        username: info.body.friendToAccept
      },
      {
        $push:{
          friends: info.session.user.username
        }
      })
      const mongoResultB = await client.db().collection("DnDUsers").updateOne({
        username: info.session.user.username
      },
      {
        $push:{
          friends: info.body.friendToAccept
        }
      })
      if(!mongoResultA || !mongoResultB)  return resultDb(false, "a goblin broke ur friendship", {})
      return resultDb(true, "This dude joined ur friend list", [mongoResultA, mongoResultB])
    }
    else if(action == "getFriends"){
      const mongoResult = await client.db().collection("DnDUsers").findOne({
        username: info.session.user.username
      })
      resultDb(true, "fren", mongoResult.friends)
    }
    else if(action == "uploadPic"){
    const result = await client.db().collection("picsFromUsers").insertOne({
      userRef: info.session.user.username,
      picStamp: new Date().getTime(),
      imageData: info.file.buffer,
      contentType: info.file.mimetype
    });
    return resultDb(true, "upload OK", {})
    }
    else if(action == "getAllPics"){
      const mongoResult = await client.db().collection("picsFromUsers").find().toArray()
      if(!mongoResult) return resultDb(false, "No shit found")
      for(let x of mongoResult){
        x.imageUrl = `data:${x.contentType};base64,${x.imageData.toString('base64')}`
        delete x.imageData
      }
      const me = await client.db().collection("DnDUsers").findOne({
        username: info.session.user.username
      })
      return resultDb(true, "found stuff", {
        pics: mongoResult,
        guesses: me.guesses
      })
    }
    else if(action == "sendGuess"){
      const picInfo = await client.db().collection("picsFromUsers").findOne({
        picStamp: +info.body.picStamp
      })
      if(!picInfo) return resultDb(false,"where did u get this")
      const guessesUpd = await client.db().collection("DnDUsers").updateOne({
        username: info.session.user.username
      },
      {
        $push:{
          guesses: {pic: info.body.picStamp,
                    guess: info.body.guess}
        }
      })
      return resultDb(true, "nice guess, I guess", {
        guessed: picInfo.userRef == info.body.guess,
        userRef: picInfo.userRef
      })
    }


  } catch (err) {
    console.error("Error during database operation:", err);
    mongoSession.abortTransaction()
    return resultDb(false, "Internal Server Error", {});


  } finally {
    if (client) {
      mongoSession.endSession()
      client.close();
    }
  }
}

function isValidUsername(username) {
  const usernameRegex = /^[a-zA-Z0-9_-]{2,32}$/;
  return usernameRegex.test(username);
}

function isValidPassword(password) {
  const passwordRegex = /^[a-zA-Z0-9!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]{8,32}$/;
  return passwordRegex.test(password);
}

export default mongoAction;
