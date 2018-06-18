export type Mutator<T> = (items: T[]) => T[]

export type Buildable<T extends { [x: string]: any }, K extends string> = {
  [P in K]: T[P]
}

export interface Node {
  kind: string
  [key: string]: any
}

export abstract class Builder<T extends Node> {
  protected _node: Buildable<T, keyof T>

  public constructor(node?: T) {
    this._node = node !== undefined ? node : {} as T
    this._node.kind = this.constructor.name
  }

  public node(): T {
    return this._node
  }
}
