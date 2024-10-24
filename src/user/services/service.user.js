require('dotenv').config();
const ScelloException = require('../../user/helpers/scello_exception');
const db = require('../../sequelize/models');
const bcrypt = require('bcrypt');
const constants = require('../../user/utils/constants');
const {v4: uuidv4} = require('uuid');
const {Op} = require('sequelize');



const User = db.user;
const Token = db.token;



class UserService {


    //This function generates unique user ids
    static async generateUniqueUserId() {
        while (true) {
            const generatedUuid = uuidv4().replace(/-/g, '')
            const generatedId = constants.USER + `${ generatedUuid }`
            const existingUser = await User.findOne({where: {user_id: generatedId}})
            if (!existingUser) {
                return generatedId
            }
        }
    }

    //This function calculates the minutes from the time it was created to and actual date and time of expiration
    static async getDateOfExpiration(minutes) {
        const expirationDate = new Date(Date.now() + minutes * 60 * 1000).toISOString()
        return expirationDate;
    }

    static async verifyOTP(existingOtp, otpFromClient) {
        if (existingOtp !== otpFromClient) {
            throw new ScelloException('Invalid OTP', 400);
        }
    }

    static async checkOtpExpiration(otpExpiration) {
        if (otpExpiration < new Date()) {
            throw new ScelloException('OTP has expired', 400);
        }
    }

    static getSmsOtpMessage(phone_number, otp, expiration_in_minutes) {
        return `Hello!!! ${ phone_number }, your otp is: ${ otp }. This otp will expire in ${ expiration_in_minutes } minutes.`;
    }


    //This function calculates the minutes from the time it was created to and actual date and time of expiration
    static async getDateOfExpiration(minutes) {
        const expirationDate = new Date(Date.now() + minutes * 60 * 1000).toISOString();
        return expirationDate;
    }


    //This function generates a token with the specific parameter length
    // Ensure each byte is a single digit (0-9) & Convert bytes to a string of numbers
    static async generateToken(length) {
        const randomBytes = crypto.randomBytes(length);
        const randomToken = randomBytes
            .map(byte => byte % 10)
            .join('');

        return randomToken;
    }

    static async checkIfPasswordMatch(password, existingPassword) {
        const is_match = await bcrypt.compare(password, existingPassword);
        if (!is_match) {
            throw new ScelloException('Invalid Login Credentials', 400);
        }
    }

    static async checkIfPhoneNumberExistsInTheDatabase(phone_number) {
        const user = await User.findOne({where: { phone_number }});
        if (user) {
            if (user.is_deleted) {
                throw new ScelloException("Phone number previously used by a deleted account, kindly contact support team.", 400);
            }
            throw new ScelloException("Phone number already in use.", 400);
        }
    }

    static async verifyBvnPayload(payload) {
        if (!payload.otp) {
            throw new ScelloException('Otp is required', 400);
        }
        if (!payload.phone_number) {
            throw new ScelloException('Phone number is required', 400);
        }
        if (!payload.email) {
            throw new ScelloException('Email is required', 400);
        }
        if (!payload.gender) {
            throw new ScelloException('Gender is required', 400);
        }
        if (!payload.bvn) {
            throw new ScelloException('Bvn is required', 400);
        }
    }

    static async comparePasswords(password, existingUserPassword) {
        try {
            const isMatch = await bcrypt.compare(password, existingUserPassword)
            return isMatch
        } catch (error) {
            throw new ScelloException('Error comparing passwords', 400)
        }
    }

    static async checkIfUserIsActive(user) {
        if (user.status === AccountStatus.ACTIVE) {
            throw new ScelloException('The user\'s profile has already been fully filled out', 400)
        }
    }

    static async getTokenByUserPhoneNumberAndOtp(phone_number, token) {
        return await Token.findOne({where: {phone_number, token}}) ||
            (() => {throw new ScelloException('Invalid otp', 400)})();
    }

    static async getTokenByUserPhoneNumber(phone_number) {
        return await Token.findOne({where: {phone_number}}) ||
            (() => {throw new ScelloException('Invalid otp', 400)})()
    }

    static excludeNullFields(obj) {
        const result = {};
        for (const [key, value] of Object.entries(obj)) {
            if (value !== null) {
                result[key] = value;
            }
        }
        return result;
    };

    static calculateRepayments(repayment_plan, loan) {
        let next_repayment_amount = 0;
        let remaining_loan_amount = 0;
        const previous_repayments = [];
        const currentDate = new Date();

        repayment_plan.forEach(repayment => {
            const proposedPaymentDate = new Date(repayment.proposed_payment_date);

            if (repayment.status === 'over due') {
                next_repayment_amount += parseFloat(repayment.total_payment_amount);
                previous_repayments.push(parseFloat(repayment.total_payment_amount));
            }
        });

        const total_repayment = loan.total_service_fee_repayment ? loan.total_service_fee_repayment : loan.total_repayment_amount;
        remaining_loan_amount = parseFloat(total_repayment) - next_repayment_amount;

        return {next_repayment_amount, remaining_loan_amount, previous_repayments};
    }

}


module.exports = UserService;