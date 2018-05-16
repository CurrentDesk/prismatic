import { pluralize } from 'inflected'

import {
  Namer,
  Relationship,
} from '@currentdesk/prismatize'

export class MongoDBNamer extends Namer {
  public buildWhereInputName(name: string): string {
    return `${name}WhereInput`
  }

  public buildWhereUniqueInputName(name: string): string {
    return `${name}WhereUniqueInput`
  }

  public buildOrderByInputName(name: string): string {
    return `${name}OrderByInput`
  }

  public buildCreateInputName(name: string): string {
    return `${name}CreateInput`
  }

  public buildUpdateInputName(name: string): string {
    return `${name}UpdateInput`
  }

  public buildCreateRelationalName(relationship: Relationship): string {
    return this.buildRelationName(relationship, 'Create')
  }

  public buildUpdateRelationalName(relationship: Relationship): string {
    return this.buildRelationName(relationship, 'Update')
  }

  private buildRelationName(
    {
      name,
      toMany,
      relatedName,
    }: Relationship,
    action: string
  ): string {
    const builder = [name, action]

    builder.push(this.relationshipManager.isToManyRelationship(relatedName, name) ? 'Many' : 'One')

    if (this.relationshipManager.hasRelationship(relatedName, name)) {
      builder.push('Without')
      builder.push(toMany ? pluralize(relatedName) : relatedName)
    }

    builder.push('Input')

    return builder.join('')
  }
}
