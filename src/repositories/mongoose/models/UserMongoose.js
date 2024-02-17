import mongoose, { Schema } from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new Schema({
  firstName: {
    type: String,
    required: 'Kindly enter the user first name'
  },
  lastName: {
    type: String,
    required: 'Kindly enter the user last name'
  },
  email: {
    type: String,
    required: 'Kindly enter the user email',
    unique: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  password: {
    type: String,
    minlength: 5,
    required: 'Kindly enter the user password'
  },
  token: {
    type: String
  },
  tokenExpiration: {
    type: Date
  },
  phone: {
    type: String,
    required: 'Kindly enter the phone number'
  },
  avatar: {
    type: String
  },
  address: {
    type: String,
    required: 'Kindly enter the address'
  },
  postalCode: {
    type: String,
    required: 'Kindly enter the postal code'
  },
  userType: {
    type: String,
    required: 'Kindly enter the user type',
    enum: ['customer', 'owner']
  }
}, {
  methods: {
    async verifyPassword (password) {
      return await bcrypt.compare(password, this.password)
    }
  },
  strict: false,
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function (doc, resultObject, options) {
      delete resultObject._id
      delete resultObject.__v
      delete resultObject.password
      return resultObject
    }
  }
})

userSchema.index({ email: 1 })

userSchema.pre('save', function (callback) {
  const user = this
  // Break out if the password hasn't changed
  if (!user.isModified('password')) return callback()

  // Password changed so we need to hash it
  bcrypt.genSalt(5, function (err, salt) {
    if (err) return callback(err)

    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return callback(err)
      user.password = hash
      callback()
    })
  })
})

const userModel = mongoose.model('User', userSchema, 'users')

export default userModel
