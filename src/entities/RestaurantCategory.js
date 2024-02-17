import BaseEntity from './BaseEntity.js'

class RestaurantCategory extends BaseEntity {
  name

  constructor (id, createdAt, updatedAt, name) {
    super(id, createdAt, updatedAt)
    this.name = name
  }
}

export default RestaurantCategory
