const mongoose = require('mongoose'),
      passportLocalMongoose = require("passport-local-mongoose");

// Define schema
const userSchema = mongoose.Schema({
    username:String,
    password:String,
    events:[{
        type :mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    }]
});

userSchema.plugin(passportLocalMongoose,{
    saltlen: 8,
    keylen : 64,
    usernameLowerCase:true
});

userSchema.methods.validPassword = (password) => {
    if (password.length  > 2 ){
        return true;
    }
};
// Compile model from schema
module.exports = mongoose.model('User',userSchema);