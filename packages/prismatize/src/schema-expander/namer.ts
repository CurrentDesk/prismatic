import {
  Relationship,
  RelationshipManager,
} from '../relationship-manager'

export abstract class Namer {
  public constructor(
    protected relationshipManager: RelationshipManager,
  ) {}

  public abstract buildWhereInputName(name: string): string
  public abstract buildWhereUniqueInputName(name: string): string
  public abstract buildOrderByInputName(name: string): string

  public abstract buildCreateInputName(name: string, relatedName?: string): string
  public abstract buildUpdateInputName(name: string, relatedName?: string): string

  public abstract buildCreateRelationalName(relationship: Relationship): string
  public abstract buildUpdateRelationalName(relationship: Relationship): string
}
