// user module related messages
module.exports.ERROR_STATUS = 'Error';
module.exports.SUCCESS_STATUS = 'Success';
module.exports.SERVER_ERROR = 'Server Error';
module.exports.WELCOME = 'Welcome to Scello';
module.exports.DEAD_END_MESSAGE = 'Resource Not Found';
module.exports.SOMETHING_BROKE_MESSAGE = 'Oooops! Something broke, kindly try later';
module.exports.ACCOUNT_EXIST = 'Account already exist, kindly contact support team';
module.exports.ACCOUNT_ALREADY_VERIFIED = 'Account already verified';
module.exports.ACCOUNT_NOT_EXIST = type => `${type} account does not exist`;
module.exports.INVALID = text => `Invalid ${text}`;
module.exports.VERIFIED = text => `Verified ${text}`;
module.exports.ACCOUNT_DEACTIVATED = 'Account is deactivated, kindly contact support';
module.exports.ACCOUNT_CREATED = 'Account created successfully';
module.exports.NO_AUTHORIZATION = 'Authorization Token Is Required';
module.exports.INVALID_AUTHORIZATION = 'Invalid Authorization Token';
module.exports.NO_TOKEN = 'Please provide a token';
module.exports.INVALID_PASS_STRING = 'Provided token is invalid';
module.exports.INVALID_TOKEN = 'Invalid/Expired Token';
module.exports.SESSION_EXPIRED = 'Session expired';
module.exports.USER_ACCOUNT_STATUS = status => `User account is ${status}`;
module.exports.ALREADY_CREATED = type => `${type} already created`;
module.exports.USER_CREDENTIALS = type => `User ${type} have not been created.`;
module.exports.USER_ACCOUNT_VERIFIED = 'Account verified successfully';
module.exports.USER_LOGIN_SUCCESSFULLY = 'User logged in successfully';
module.exports.USER_PROFILE_COMPLETED = 'User profile completed successfully';
module.exports.USER_EMAIL_EXIST = 'Account with this email address already exist';
module.exports.INVALID_PASSWORD = 'Invalid email or password';
module.exports.INVALID_PIN = 'Invalid pin';
module.exports.DEVICE_TOKEN_REQUIRED = 'device token is required in payload';
module.exports.NEW_DEVICE_DETECTED = 'New device login, verify account with OTP sent to your registered phone number';
module.exports.INVALID_PHONE_NUMBER_OR_PASSWORD = 'Invalid phone number or password';
module.exports.LOGIN_REQUEST_SUCCESSFUL = 'Login request successful, kindly check your mail';