const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const otpSchema = new Schema({
    phoneNumber: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    otpExpiration: {
        type: Date,
        required: true,
        default: function() {
            return Date.now() + 5 * 60 * 1000; 
        }
    }
});

module.exports = mongoose.model('Otp', otpSchema);
