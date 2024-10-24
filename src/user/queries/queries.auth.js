
require('dotenv').config();
const Sequelize = require('sequelize');
const db = require('../../sequelize/models');

const {v4: uuidv4} = require('uuid');
const constants = require('../../user/utils/constants');
const UserQueries = require('../queries/queries.user');



const User = db.user;
class AuthQueries {

    static async fetchUserPassword(userId) {
        try {
            return await User.findOne({
                attributes: ['id', 'user_id', 'password'],
                where: {user_id: userId}
            });
        } catch (error) {
            console.error(`Error fetching user password: ${ error.message }`);
            throw error;
        }
    }

    static async deactivateUserAccount(userId) {
        try {
            return await User.update(
                {status: 'deactivated',},
                {where: { user_id: userId }}
            );
        } catch (error) {
            console.error(`Error deactivating user account: ${error.message}`);
            throw error;
        }
    }

    static async getUserByVerificationToken(token) {
        try {
            const user = await User.findOne({
                attributes: ['id', 'email', 'phone_number', 'user_id', 'verification_token_expires', 'is_verified_email'],
                where: {
                    verification_text: token
                }
            });
            return user;
        } catch (error) {
            console.error(`Error fetching user by verification token: ${error.message}`);
            throw error;
        }
    }

    static async registerUser(payload) {
        try {
            const user_id = await UserQueries.generateUniqueUserId();
            const [phone_number, verification_token, verification_token_expires, verification_token_request_count] = payload;
            await User.create({
                user_id,
                phone_number,
                verification_text: verification_token,
                verification_token_expires,
                verification_token_request_count
            });

            // Retrieve the user with specific fields
            const newUser = await User.findOne({
                where: { user_id },
                attributes: ['user_id', 'phone_number', 'status', 'verification_token_expires', 'is_deleted', ]
            });   
            return newUser;
        } catch (error) {
            console.error(`Error registering user: ${error}`);
            throw error;
        }
    }

    static async updateVerificationToken(payload) {
        try {
                const [phone_number, verification_token, verification_token_expires, verification_token_request_count] = payload;
    
            // Update the user
            await User.update({
                verification_text: verification_token,
                verification_token_expires,
                verification_token_request_count
            }, {
                where: { phone_number }
            });
    
            // Retrieve the updated user with specific fields
            const updatedUser = await User.findOne({
                where: { phone_number },
                attributes: ['user_id', 'phone_number', 'status', 'verification_token_expires', 'is_deleted']
            });
    
            return updatedUser;
        } catch (error) {
            console.error(`Error updating verification token: ${error.message}`);
            throw error;
        }
    }



    static async getUserByVerificationTokenAndUniqueField(verification_token, user_id) {
        try {
            const user = await User.findOne({
                attributes: [
                    'id', 
                    'email', 
                    'phone_number', 
                    'user_id', 
                    'verification_token_expires', 
                    'is_verified_email', 
                    'verification_token_request_count', 
                    'invalid_verification_token_count'
                ],
                where: {
                    verification_text: verification_token,
                    user_id: user_id
                }
            });
    
            return user;
        } catch (error) {
            console.error(`Error fetching user by verification token and user ID: ${error}`);
            throw error;
        }
    }

    static async updateUserInvalidOtpCount(user_id) {
        try {
            const [affectedRows] = await User.update(
                {
                    invalid_verification_token_count: Sequelize.literal('invalid_verification_token_count + 1')
                },
                {
                    where: {
                        user_id: user_id
                    },
                    returning: true
                }
            );    
            return affectedRows;
        } catch (error) {
            console.error(`Error updating invalid verification token count: ${error.message}`);
            throw error;
        }
    }

    static async verifyUserAccountAfterSignup(payload) {
        try { 
            const [user_id, refresh_token, ] = payload;
            const [affectedRows] = await User.update(
                {
                    refresh_token: refresh_token,
                    is_verified_phone_number: true,
                    verification_text: null,
                    verification_token_expires: null,
                    verification_token_request_count: 0,
                    invalid_verification_token_count: 0
                },
                {
                    where: {
                        user_id: user_id
                    },
                    returning: true,
                    plain: true
                }
            );    
            return affectedRows;
        } catch (error) {
            console.error(`Error verifying user account: ${error.message}`);
            throw error;
        }
    }

    static async loginUserAccount(user_id, refresh_token) {
        try {
            const [affectedRows, updatedUser] = await User.update(
                {
                    refresh_token: refresh_token
                },
                {
                    where: {
                        user_id: user_id
                    },
                    returning: true,
                    plain: true
                }
            );
            const selectedFields = {
                id: updatedUser.id,
                phone_number: updatedUser.phone_number,
                user_id: updatedUser.user_id,
                email: updatedUser.email,
                title: updatedUser.title,
                first_name: updatedUser.first_name,
                middle_name: updatedUser.middle_name,
                last_name: updatedUser.last_name,
                gender: updatedUser.gender,
                date_of_birth: updatedUser.date_of_birth,
                is_verified_phone_number: updatedUser.is_verified_phone_number,
                is_verified_email: updatedUser.is_verified_email,
                is_created_password: updatedUser.is_created_password,
                status: updatedUser.status,
                is_deleted: updatedUser.is_deleted,
                refresh_token: updatedUser.refresh_token,
            };    
            return selectedFields;
        } catch (error) {
            console.error(`Error logging in user: ${error.message}`);
            throw error;
        }
    }
    

    static async verifyUserEmail(user_id) {
        try {
            const [affectedRows] = await User.update(
                {
                    is_verified_email: true,
                },
                {
                    where: { user_id },
                    returning: true,
                    plain: true
                }
            );    
            const updatedUser = await User.findOne({
                where: { user_id },
                attributes: ['id', 'user_id', 'is_verified_email']
            });
            return updatedUser;
        } catch (error) {
            console.error(`Error verifying user email: ${error.message}`);
            throw error;
        }
    }
    
    static async completeUserLoginRequest(payload) {
        try {
            const [email, verification_token, verification_token_expires] = payload;
            const [affectedRows, updatedUser] = await User.update(
                {
                    verification_text: verification_token,
                    verification_token_expires: verification_token_expires,
                    verification_token_request_count: Sequelize.literal('verification_token_request_count + 1'),
                },
                {
                    where: { email: email },
                    returning: true,
                    plain: true
                }
            );    
            // Select only the specified fields from the updatedUser object
            const selectedFields = {
                user_id: updatedUser.user_id,
                first_name: updatedUser.first_name,
                middle_name: updatedUser.middle_name,
                last_name: updatedUser.last_name,
                email: updatedUser.email,
                status: updatedUser.status,
            };
    
            return selectedFields;
        } catch (error) {
            console.error(`Error in forgotPassword: ${error.message}`);
            throw error;
        }
    }

    static async updateLoginToken(userId, verificationToken, verificationTokenExpires, verificationTokenRequestCount, invalidVerificationTokenCount) {
        try {
            const result = await User.update(
                {
                    is_verified_email: true,
                    verification_token: verificationToken,
                    verification_token_expires: verificationTokenExpires,
                    verification_token_request_count: verificationTokenRequestCount,
                    invalid_verification_token_count: invalidVerificationTokenCount
                },
                {
                    where: {user_id: userId},
                    returning: true,
                    plain: true
                }
            );

            return result[1]; // `result[1]` contains the updated record
        } catch (error) {
            throw error;
        }
    }

    static async completeUserProfile(payload) {
        try {
            const [user_id, first_name, middle_name, last_name, email, date_of_birth, gender, password] = payload;
            const [affectedRows, updatedUser] = await User.update(
                {
                    status: constants.ACTIVE,
                    is_created_password: true,
                    is_completed_kyc: true,
                    first_name: first_name,
                    middle_name: middle_name,
                    last_name: last_name,
                    email: email,
                    date_of_birth: date_of_birth,
                    gender: gender,
                    password: password
                },
                {
                    where: {
                        user_id: user_id
                    },
                    returning: true,
                    plain: true
                }
            );    
            // Select only the specified fields from the updatedUser object
            const selectedFields = {
                id: updatedUser.id,
                user_id: updatedUser.user_id,
                first_name: updatedUser.first_name,
                middle_name: updatedUser.middle_name,
                last_name: updatedUser.last_name,
                email: updatedUser.email,
                gender: updatedUser.gender,
                date_of_birth: updatedUser.date_of_birth,
                status: updatedUser.status
            };  
            return selectedFields;
        } catch (error) {
            console.error(`Error completing user profile: ${error.message}`);
            throw error;
        }
    }
    
    
    
    
    
    



}


module.exports = AuthQueries;