module.exports = {
  
  
  
  register: (body, otp, expireAt, signupOtpRequest) => [body.phone_number.trim(), otp, expireAt, signupOtpRequest],

  verifyUserAccountAfterSignup: (user, refreshToken, body) => [ 
    user.user_id, 
    refreshToken, 
    body.device_token?.trim() || null 
  ],
  
  completeProfile: (user, body, hashed) => [ 
    user.user_id, 
    body.first_name.replace(/\s+/g, '').trim().toLowerCase(), 
    body.middle_name ? body.middle_name.replace(/\s+/g, '').trim().toLowerCase() : null, 
    body.last_name.replace(/\s+/g, '').trim().toLowerCase(), 
    body.email.replace(/\s+/g, '').trim().toLowerCase(),
    body.date_of_birth, 
    body.gender, 
    hashed 
  ]
};
