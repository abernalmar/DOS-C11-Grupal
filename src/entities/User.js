import BaseEntity from './BaseEntity.js'

class User extends BaseEntity {
  firstName
  lastName
  email
  password
  token
  tokenExpiration
  phone
  avatar
  address
  postalCode
  userType

  constructor (id, createdAt, updatedAt, firstName, lastName, email, password, token, tokenExpiration, phone, avatar, address, postalCode, userType) {
    super(id, createdAt, updatedAt)
    this.firstName = firstName
    this.lastName = lastName
    this.email = email
    this.password = password
    this.token = token
    this.tokenExpiration = tokenExpiration
    this.phone = phone
    this.avatar = avatar
    this.address = address
    this.postalCode = postalCode
    this.userType = userType
  }
}

export default User
