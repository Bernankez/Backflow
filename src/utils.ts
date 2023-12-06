export function isDefined<T>(val: T): val is NonNullable<T> {
  return val !== undefined && val !== null;
}

export function log(...args: any[]) {
  if (import.meta.env.DEV) {
    console.log(...args);
  }
}
