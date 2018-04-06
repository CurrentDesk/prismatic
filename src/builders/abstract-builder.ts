export type Mutator<T> = (items: T[]) => T[]

export interface Node {
  kind: string
}

export abstract class Builder<T extends Node> {
  protected _node: T

  public constructor(node?: T) {
    this._node = node !== undefined ? node : {} as T
    this._node.kind = this.constructor.name
  }

  public node(): T {
    return this._node
  }
}
