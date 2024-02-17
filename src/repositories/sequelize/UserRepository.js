import RepositoryBase from '../RepositoryBase.js'
import { UserSequelize } from './models/models.js'

class UserRepository extends RepositoryBase {
  async findById (id, ...args) {
    const user = await UserSequelize.findByPk(id, { attributes: { exclude: ['password'] } })
    return user.dataValues
  }

  async create (businessEntity, ...args) {
    return (new UserSequelize(businessEntity)).save()
  }

  async update (id, valuesToUpdate, ...args) {
    await UserSequelize.update(valuesToUpdate, {
      where: {
        id
      }
    })
    return UserSequelize.findByPk(id, {
      attributes: { exclude: ['password'] }
    })
  }

  async updateToken (id, tokenDTO, ...args) {
    const entity = await UserSequelize.findByPk(id, {
      attributes: { exclude: ['password'] }
    })
    entity.set(tokenDTO)
    return entity.save()
  }

  async destroy (id, ...args) {
    const result = await UserSequelize.destroy({ where: { id } })
    return result === 1
  }

  async findByToken (token) {
    return UserSequelize.findOne({ where: { token } }, { attributes: { exclude: ['password'] } })
  }

  async findOwnerByEmail (email) {
    return this._findByEmailAndUserType(email, 'owner')
  }

  async findCustomerByEmail (email) {
    return this._findByEmailAndUserType(email, 'customer')
  }

  async _findByEmailAndUserType (email, userType) {
    return UserSequelize.findOne({ where: { email, userType } })
  }

  async save (businessEntity, ...args) {
    return this.create(businessEntity)
  }
}

export default UserRepository
