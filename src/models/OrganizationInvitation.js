const mongoose = require('mongoose');

const organizationInvitationSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    invitedAt: {
        type: Date,
        default: Date.now
    },
    expiresAt: {
        type: Date
    },
    accepted: {
        type: Boolean,
        default: false
    },
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true
    },
});

module.exports = mongoose.model('OrganizationInvitation', organizationInvitationSchema);