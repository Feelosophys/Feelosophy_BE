// src/utils/zegoUtils.js
const crypto = require('crypto');

function generateZegoToken(appId, userId, appSign, roomId, effectiveTimeInSeconds = 3600) {
    const timestamp = Math.floor(Date.now() / 1000) + effectiveTimeInSeconds;
    const nonce = Math.floor(Math.random() * 2147483647);

    const body = {
        app_id: appId,
        user_id: userId,
        nonce: nonce,
        ctime: timestamp,
        expire: timestamp,
        payload: JSON.stringify({
            room_id: roomId,
            privilege: {
                1: 1, // Login room
                2: 1 // Publish stream
            },
            stream_id_list: null
        })
    };

    const bodyString = JSON.stringify(body);
    const signature = crypto.createHmac('sha256', appSign).update(bodyString).digest('hex');

    const token = `04${Buffer.from(bodyString).toString('base64')}${signature}`;
    return token;
}

module.exports = {
    generateZegoToken
};