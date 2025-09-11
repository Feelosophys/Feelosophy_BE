const mongoose = require('mongoose');

const TeacherSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    bio: {
        type: String
    },
    expertise: [{
        type: String
    }],
});

module.exports = mongoose.model('Teacher', TeacherSchema);