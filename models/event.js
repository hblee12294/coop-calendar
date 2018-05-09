const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
    title : String,
    description : String,
    startDate : Date,
    endDate : Date,
    creator : {
        id : {
            type :mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username :String
    },
    visibility: String,
    location : String,
});

module.exports = mongoose.model('Event',eventSchema);