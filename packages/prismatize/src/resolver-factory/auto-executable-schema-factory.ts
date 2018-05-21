import {
  parse,
  visit,
  DocumentNode,
} from 'graphql/language'
import { GraphQLSchema } from 'graphql/type'
import { buildASTSchema } from 'graphql/utilities'
import {
  addResolveFunctionsToSchema,
  assertResolveFunctionsPresent,
} from 'graphql-tools'

import { ResolverFactory } from './resolver-factory'
import { ResolverFactoryVisitor } from './resolver-factory-visitor'

export abstract class AutoExecutableSchemaFactory {
  protected modelResolverFactory: ResolverFactory
  protected queryResolverFactory: ResolverFactory
  protected mutationResolverFactory: ResolverFactory

  protected schema: GraphQLSchema

  private ast: DocumentNode

  public constructor(typeDefs: string) {
    this.ast = parse(typeDefs, { noLocation: true })
    this.schema = buildASTSchema(this.ast)
  }

  public makeExecutableSchema(): GraphQLSchema {
    const resolverValidationOptions = {}
    const visitor = new ResolverFactoryVisitor(
      this.modelResolverFactory,
      this.queryResolverFactory,
      this.mutationResolverFactory,
    )

    visit(this.ast, visitor)

    addResolveFunctionsToSchema({
      schema: this.schema,
      resolvers: visitor.resolvers,
      inheritResolversFromInterfaces: false,
      resolverValidationOptions,
    })

    assertResolveFunctionsPresent(this.schema, resolverValidationOptions)

    return this.schema
  }
}
