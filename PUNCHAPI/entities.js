const mongoose = require("mongoose");

const UsersScheme = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    token: String,
    gender: {
      type: String,
      validate: function(value){
        //not sure
        return /m|f|o/i.test(value);
      }
    }
});

const PunchSchema = new mongoose.Schema({
    created: {
      type: Date,
      default: new Date()
    }
});


const UserEntity = mongoose.model("Users", UsersScheme);

const entities = {
    User: UserEntity
}

module.export = entities;
