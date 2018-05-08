import { Namer } from '@currentdesk/prismatize'

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
}
