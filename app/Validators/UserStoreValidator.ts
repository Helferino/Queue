import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class UserStoreValidator {
  public schema = schema.create({
    email: schema.string([rules.email()]),
    payload: schema.number([rules.unsigned()]),
  })
}

let validator: UserStoreValidator
type UserStoreValidatorProps = typeof validator.schema.props

export { UserStoreValidatorProps }
