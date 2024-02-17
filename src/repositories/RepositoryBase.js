import mongoose from 'mongoose'

class RepositoryBase {
  async findById (id, ...args) {
    throw new Error('Not Implemented Exception')
  }

  async findAll (...args) {
    throw new Error('Not Implemented Exception')
  }

  async create (data, ...args) {
    throw new Error('Not Implemented Exception')
  }

  async update (data, ...args) {
    throw new Error('Not Implemented Exception')
  }

  async destroy (id, ...args) {
    throw new Error('Not Implemented Exception')
  }

  isValidObjectId (id) {
    if (mongoose.Types.ObjectId.isValid(id)) {
      if ((String)(new mongoose.Types.ObjectId(id)) === id) { return true }
      return false
    }
    return false
  }
}

export default RepositoryBase
