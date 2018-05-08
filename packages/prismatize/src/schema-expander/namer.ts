export abstract class Namer {
  public abstract buildWhereInputName(name: string): string
  public abstract buildWhereUniqueInputName(name: string): string
  public abstract buildOrderByInputName(name: string): string
  public abstract buildCreateInputName(name: string): string
  public abstract buildUpdateInputName(name: string): string
}
