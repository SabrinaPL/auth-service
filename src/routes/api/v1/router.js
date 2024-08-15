/**
 * @file API version 1 router.
 * @module routes/router
 * @author Mats Loock & Sabrina Prichard-Lybeck <sp223kz@student.lnu.se>
 * @version 3.0.0
 */

import express from 'express'
import { router as accountRouter } from './accountRouter.js'

export const router = express.Router()

router.get('/', (req, res) => res.json({ message: 'Welcome to version 1 of the Auth API. You can register a new user via the "/register" endpoint and login via the "/login" endpoint. Once successfully registered the userId will be sent in the response and once successfully logged in an access token (JWT) will be sent in the response and a refresh token (JWT) will be stored in a cookie (as default and if client is a browser) or directly in the response. This token grants access to the Resource API which can be found at "https://cscloud7-49.lnu.se/picture-it/api/v1/resource/". To refresh the token, send the expired access token in the Authorization header as a Bearer token and the refresh token in the body of the request to the "/login/refresh" endpoint.' }))
router.use('/', accountRouter)
