import passport from 'passport'
import { Strategy as BearerStrategy } from 'passport-http-bearer'
import container from '../config/container.js'

const initPassport = function () {
  const userService = container.resolve('userService')

  passport.use(new BearerStrategy(
    async function (token, done) {
      try {
        const user = await userService.loginByToken(token)
        return done(null, user, { scope: 'all' })
      } catch (err) {
        return done(null, false, { message: err.message })
      }
    }
  ))
}

export { initPassport }
