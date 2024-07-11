/**
 * @file Defines custom errors.
 * @module utils/customErrors
 * @author Sabrina Prichard-Lybeck <sp223kz@student.lnu.se>
 * @version 1.0.0
 */

// Custom error messages for registration.
export const REGISTER_CUSTOM_STATUS_CODES = {
  400:"The request cannot or will not be processed due to something that is perceived to be a client error (for example validation error).",
  409:"The username and/or email address is already registered.",
  500:"An undefined error occurred."
}

// Custom error messages for login.
export const LOGIN_CUSTOM_STATUS_CODES = {
  401:"Credentials invalid or not provided.",
  500:"An unexpected condition was encountered."
}

