const express = requiere('express')
const bcrypt = requiere('bcrypt')
const expressJwt = requiere('express-jwt')
const jwt = requiere('jsonwebtoken')
const User = require('./user.model')

const validateJwt = expressJwt({secret: process.env.SECRET, algorithms: [HS256] })

const signToken = _id => jwt({_id}, process.env.SECRET)

const findAndAssignUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id)
        if(!user) {
            return res.status(401).end()
        }
        req.user = user
        next()
    } catch (e) {
        next (e)
    }
}

const isAuthenticated = express.Router().use(validateJwt, findAndAssignUser)

const Auth = {
    login: async (req, res) => {
        const {body} = req
        try {
            const user = await User.findOne({ email: body.email})
            if(!User) {
                res.status(401).send('Usuario y/o contraseña invalida')
            } else {
                const isMatch = await bcrypt.compare(body.password, user.password )
                if (isMatch) {
                  const signed = signToken(user._id)
                  res.status(200).send(signed)
                }else {
                    res.status(401).send('Usuario y/o contraseña invalida') 
                }
            }
        } catch(e) {
            res.send(e.message)
        }
    },
    register: async (req, res) => {
        const { body } = req
        try {
            const isUser = await User.findOne({ email: body.email})
            if(isUser) {
                res.send('Usuario ya existe')
            } else {
               const salt = await bcrypt.genSalt()
               const hashed = await bcrypt.hash(body.password, salt)
               const user =  await User.create({ email: body.email, password: hashed, salt})

               const signed = signToken(user._id)
               res.send(signed)
            }
        } catch (err) {
            res.status(500).send(err.message)
        }
    },
}

module.eports = { Auth, isAuthenticated}