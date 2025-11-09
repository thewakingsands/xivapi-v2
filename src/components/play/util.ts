export class UnreachableException {
  constructor(_value: never) { }
}

export function mustExist<T>(value: T | undefined): T {
  if (value == null) {
    throw new Error('precondition broken')
  }
  return value
}
