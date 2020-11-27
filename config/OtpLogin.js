const {default: axios} = require('axios');
var FormData = require('form-data');

module.exports = {
  sendOtpHandler: (mobileNumber, callback) => {
    var data = new FormData();
    data.append('mobile', `91${mobileNumber}`);
    data.append('sender_id', 'SMSINFO');
    data.append(
      'message',
      'Your otp code is {code}.Valid only 3 minute. Do not share this with anyone'
    );
    data.append('expiry', '30000');

    var config = {
      method: 'post',
      url: 'https://d7networks.com/api/verifier/send',
      headers: {
        Authorization: 'Token 3ca5c060790316f064acd25d443f4848d985fb0d',
        ...data.getHeaders(),
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        callback(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  },
  verifyOtpHandler: (details, callback) => {
    let {otpId, userEnteredOtp} = details;
    console.log(otpId, userEnteredOtp);
    var data = new FormData();
    data.append('otp_id', otpId);
    data.append('otp_code', userEnteredOtp.otp);

    var config = {
      method: 'post',
      url: 'https://d7networks.com/api/verifier/verify',
      headers: {
        Authorization: 'Token 3ca5c060790316f064acd25d443f4848d985fb0d',
        ...data.getHeaders(),
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        if (response.data.status === 'success') {
          return callback({status: 200, data: response.data});
        } else {
          return callback({status: 309, data: 'not a valid otp'});
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  },
};
