import container from '../config/container.js'

class OrderController {
  constructor () {
    this.orderService = container.resolve('orderService')
    this.indexRestaurant = this.indexRestaurant.bind(this)
    this.indexCustomer = this.indexCustomer.bind(this)
    this.create = this.create.bind(this)
    this.update = this.update.bind(this)
    this.destroy = this.destroy.bind(this)
    this.confirm = this.confirm.bind(this)
    this.send = this.send.bind(this)
    this.deliver = this.deliver.bind(this)
    this.show = this.show.bind(this)
    this.analytics = this.analytics.bind(this)
  }

  // Returns :restaurantId orders
  async indexRestaurant (req, res) {
    try {
      const { restaurantId } = req.params
      const { paginated = 'false', page = '1', limit = '10' } = req.query
      const orders = await this.orderService.indexRestaurant(
        restaurantId,
        paginated.toLowerCase() === 'true',
        parseInt(page, 10),
        parseInt(limit, 10)
      )
      res.json(orders)
    } catch (err) {
      res.status(500).send(err.message)
    }
  }

  async indexCustomer (req, res) {
    try {
      const orders = await this.orderService.indexCustomer(req.user.id)
      res.json(orders)
    } catch (err) {
      res.status(500).send(err.message)
    }
  }

  async create (req, res) {
    let newOrder = req.body
    newOrder.userId = req.user.id
    try {
      newOrder = await this.orderService.create(newOrder)
      res.json(newOrder)
    } catch (err) {
      res.status(500).send(err.message)
    }
  }

  async update (req, res) {
    try {
      const updatedOrder = await this.orderService.update(req.params.orderId, req.body)
      res.json(updatedOrder)
    } catch (err) {
      res.status(500).send(err.message)
    }
  }

  async destroy (req, res) {
    try {
      const result = await this.orderService.destroy(req.params.orderId)
      const message = result ? 'Successfully deleted.' : 'Could not delete order.'
      res.json(message)
    } catch (err) {
      res.status(500).send(err.message)
    }
  }

  async confirm (req, res) {
    try {
      const confirmedOrder = await this.orderService.confirm(req.params.orderId)
      res.json(confirmedOrder)
    } catch (err) {
      res.status(500).send(err.message)
    }
  }

  async send (req, res) {
    try {
      const sentOrder = await this.orderService.send(req.params.orderId)
      res.json(sentOrder)
    } catch (err) {
      res.status(500).send(err.message)
    }
  }

  async deliver (req, res) {
    try {
      const deliveredOrder = await this.orderService.deliver(req.params.orderId)
      res.json(deliveredOrder)
    } catch (err) {
      res.status(500).send(err.message)
    }
  }

  async show (req, res) {
    try {
      const order = await this.orderService.show(req.params.orderId)
      res.json(order)
    } catch (err) {
      res.status(500).send(err.message)
    }
  }

  async analytics (req, res) {
    try {
      const analytics = await this.orderService.analytics(req.params.restaurantId)
      res.json(analytics)
    } catch (err) {
      res.status(500).send(err.message)
    }
  }
}

export default OrderController
