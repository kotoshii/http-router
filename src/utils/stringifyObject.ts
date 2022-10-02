export function stringifyObject(data: unknown) {
  return typeof data === 'string' ? data : JSON.stringify(data)
}
