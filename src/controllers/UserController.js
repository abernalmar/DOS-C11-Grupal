import container from '../config/container.js'

class UserController {
  constructor () {
    this.userService = container.resolve('userService')
    this.loginOwner = this.loginOwner.bind(this)
    this.loginCustomer = this.loginCustomer.bind(this)
    this.loginByToken = this.loginByToken.bind(this)
    this.show = this.show.bind(this)
    this.registerCustomer = this.registerCustomer.bind(this)
    this.registerOwner = this.registerOwner.bind(this)
    this.destroy = this.destroy.bind(this)
    this.update = this.update.bind(this)
  }

  async registerCustomer (req, res) {
    this._register(req, res, 'customer')
  }

  async registerOwner (req, res) {
    this._register(req, res, 'owner')
  }

  async _register (req, res, userType) {
    try {
      let registeredUser
      if (userType === 'owner') {
        registeredUser = await this.userService.registerOwner(req.body)
      } else if (userType === 'customer') {
        registeredUser = await this.userService.registerCustomer(req.body)
      }
      res.json(registeredUser)
    } catch (err) {
      if (err.name.includes('ValidationError') || err.code === 11000) {
        res.status(422).send(err)
      } else {
        res.status(500).send(err.message)
      }
    }
  }

  async loginByToken (req, res) {
    try {
      const user = await this.userService.loginByToken(req.body.token)
      res.json(user)
    } catch (err) {
      return res.status(401).send({ errors: err.message })
    }
  }

  async loginOwner (req, res) {
    try {
      const user = await this.userService.loginOwner(req.body.email, req.body.password)
      res.json(user)
    } catch (err) {
      return res.status(401).send({ errors: err.message })
    }
  }

  async loginCustomer (req, res) {
    try {
      const user = await this.userService.loginCustomer(req.body.email, req.body.password)
      res.json(user)
    } catch (err) {
      return res.status(401).send({ errors: err.message })
    }
  }

  async show (req, res) {
  // Only returns PUBLIC information of users
    try {
      const user = await this.userService.show(req.params.userId)
      res.json(user)
    } catch (err) {
      res.status(500).send(err.message)
    }
  }

  async update (req, res) {
    try {
      const user = await this.userService.update(req.user.id, req.body)
      res.json(user)
    } catch (err) {
      res.status(500).send(err.message)
    }
  }

  async destroy (req, res) {
    try {
      const result = await this.userService.destroy(req.user.id)
      const message = result ? 'Successfully deleted.' : 'Could not delete user.'
      res.json(message)
    } catch (err) {
      res.status(500).send(err.message)
    }
  }
}

export default UserController
