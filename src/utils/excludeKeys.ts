export function exclude<
  T extends { [key: string | number | symbol]: unknown },
>(
  obj: T,
  keys: (keyof T)[],
): Omit<T, keyof T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => !keys.includes(key)),
  ) as Omit<T, keyof T>;
}
