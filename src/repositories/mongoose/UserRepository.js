import RepositoryBase from '../RepositoryBase.js'
import UserMongoose from './models/UserMongoose.js'

class UserRepository extends RepositoryBase {
  async findById (id, ...args) {
    try {
      const user = await UserMongoose.findById(id, { password: 0 })
      return user.toObject({ getters: true, virtuals: true, versionKey: false })
    } catch (err) {
      return null
    }
  }

  async create (businessEntity, ...args) {
    return (new UserMongoose(businessEntity)).save()
  }

  async update (id, businessEntity, ...args) {
    return UserMongoose.findOneAndUpdate({ _id: id }, businessEntity, { new: true, exclude: ['password'] })
  }

  async updateToken (id, tokenDTO, ...args) {
    return this.update(id, tokenDTO, args)
  }

  async destroy (id, ...args) {
    const result = await UserMongoose.deleteOne({ _id: id })
    return result?.deletedCount === 1
  }

  async save (entity) {
    return UserMongoose.findByIdAndUpdate(entity.id, entity, { upsert: true, new: true })
  }

  async findByToken (token) {
    return UserMongoose.findOne({ token }, { password: 0 })
  }

  async findOwnerByEmail (email) {
    return this._findByEmailAndUserType(email, 'owner')
  }

  async findCustomerByEmail (email) {
    return this._findByEmailAndUserType(email, 'customer')
  }

  async _findByEmailAndUserType (email, userType) {
    return UserMongoose.findOne({ email, userType })
  }
}

export default UserRepository
