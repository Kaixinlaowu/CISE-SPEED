/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// common/utils/transform.util.ts
export function excludePassword<User extends Record<string, any>>(
  user: User,
): Omit<User, 'password'> {
  if (!user) return user as Omit<User, 'password'>;

  // 创建新对象并删除 password 属性
  const result = { ...user };
  delete result.password;
  return result;
}

export function toObjectIfNeeded<T>(document: T): T {
  if (document && typeof document === 'object' && 'toObject' in document) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return
    return (document as any).toObject();
  }
  return document;
}
