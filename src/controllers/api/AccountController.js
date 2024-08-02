/**
 * @file Defines the AccountController class.
 * @module controllers/AccountController
 * @author Mats Loock & Sabrina Prichard-Lybeck <sp223kz@student.lnu.se>
 * @version 3.1.0
 */

import http from 'node:http'
import { logger } from '../../config/winston.js'
import { JsonWebToken } from '../../lib/JsonWebToken.js'
import { UserModel } from '../../models/UserModel.js'
import { LOGIN_CUSTOM_STATUS_CODES, REGISTER_CUSTOM_STATUS_CODES } from '../../utils/customErrors.js'

/**
 * Encapsulates a controller.
 */
export class AccountController {
  /**
   * Authenticates a user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async login (req, res, next) {
    try {
      logger.silly('Authenticating user', { body: req.body })

      const userDocument = await UserModel.authenticate(req.body.username, req.body.password)
      const user = userDocument.toObject()

      // Create the access token with the shorter lifespan.
      const accessToken = await JsonWebToken.encodeUser(user,
        process.env.ACCESS_TOKEN_SECRET,
        process.env.ACCESS_TOKEN_LIFE
      )

      // // Create the refresh token with the longer lifespan.
      // -----------------------------------------------------------------
      // 👉👉👉 This is the place to create and handle the refresh token!
      //         Quite a lot of additional implementation is required!!!
      // -----------------------------------------------------------------
      // const refreshToken = ...

      logger.silly('Authenticated user', { user })

      res
        .status(200)
        .json({
          access_token: accessToken
          // refresh_token: refreshToken
        })
    } catch (error) {
      // Authentication failed. 
      // Status code is defaulted to 500 (Internal Server Error).
      let httpStatusCode = 500

      if (error.message === 'Invalid credentials') {
        httpStatusCode = 401
      }

      const err = new Error(LOGIN_CUSTOM_STATUS_CODES[httpStatusCode] || http.STATUS_CODES[httpStatusCode])
      err.status = httpStatusCode
      err.cause = error

      next(err)
    }
  }

  /**
   * Registers a user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async register (req, res, next) {
    try {
      logger.silly('Creating new user document', { body: req.body })

      const { username, password, firstName, lastName, email } = req.body

      const userDocument = await UserModel.create({
        username,
        password,
        firstName,
        lastName,
        email,
        permissionLevel: 1
      })

      logger.silly('Created new user document')

      const location = new URL(
        `${req.protocol}://${req.get('host')}${req.baseUrl}/${userDocument.id}`
      )

      res
        .location(location.href)
        .status(201)
        .json({ id: userDocument.id })
    } catch (error) {
      logger.error('Failed to create new user document', { error })
      
      let httpStatusCode = 500

      if (error.code === 11000) {
        // Duplicated keys, which means that the user already exists.
        httpStatusCode = 409
      } else if (error.name === 'ValidationError') {
        // Validation error(s).
        httpStatusCode = 400
      }

      const err = new Error(REGISTER_CUSTOM_STATUS_CODES[httpStatusCode] || http.STATUS_CODES[httpStatusCode])
      err.status = httpStatusCode
      err.cause = error

      next(err)
    }
  }
}
