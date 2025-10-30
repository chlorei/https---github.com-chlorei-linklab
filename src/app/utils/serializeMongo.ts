import { Types } from "mongoose";

// рекурсивно превращает ObjectId и Date → string
export function serializeMongo<T>(obj: T): T {
  if (Array.isArray(obj)) {
    return obj.map(serializeMongo) as T;
  }

  if (obj && typeof obj === "object") {
    const newObj: any = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value instanceof Types.ObjectId) {
        newObj[key] = value.toString();
      } else if (value instanceof Date) {
        newObj[key] = value.toISOString();
      } else if (typeof value === "object") {
        newObj[key] = serializeMongo(value);
      } else {
        newObj[key] = value;
      }
    }
    return newObj;
  }

  return obj;
}