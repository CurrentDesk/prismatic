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

  public buildCreateInputName(name: string, relatedName?: string): string {
    if (relatedName) {
      const toMany = this.relationshipManager.isToManyRelationship(name, relatedName)

      return `${name}CreateWithout${toMany ? pluralize(relatedName) : relatedName}Input`
    }

    return `${name}CreateInput`
  }

  public buildUpdateInputName(name: string, relatedName?: string): string {
    if (relatedName) {
      const toMany = this.relationshipManager.isToManyRelationship(name, relatedName)

      return `${name}UpdateWithout${toMany ? pluralize(relatedName) : relatedName}DataInput`
    }

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
      toMany,
      modelName,
      relatedModelName,
    }: Relationship,
    action: string
  ): string {
    const builder = [relatedModelName, action]

    builder.push(toMany ? 'Many' : 'One')

    if (this.relationshipManager.hasRelationship(relatedModelName, modelName)) {
      builder.push('Without')
      builder.push(this.relationshipManager.isToManyRelationship(relatedModelName, modelName) ? pluralize(modelName) : modelName)
    }

    builder.push('Input')

    return builder.join('')
  }
}
