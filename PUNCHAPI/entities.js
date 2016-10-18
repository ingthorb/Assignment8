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
      },
      required: true
    }
});
const CompaniesScheme = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  punchCount: {
    type: Number,
    required: true,
    default: 10
  }
});

const PunchSchema = new mongoose.Schema({
    created: {
      type: Date,
      default: new Date()
    },
    used: {
      type: Boolean,
      default: false
    },
    user_id: {
      type: [Number]
    },
    company_id: {
      type: [Number]
    }
});


const UserEntity = mongoose.model("Users", UsersScheme);

const CompanyEntity = mongoose.model("Companies", CompaniesScheme);

const entities = {
    User: UserEntity,
    Company: CompanyEntity
}

module.exports = entities;
