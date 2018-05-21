export interface Where {
  AND?: Where[]
  OR?: Where[]
  NOR?: Where[]
  NOT?: Where
  [key: string]: any
}
