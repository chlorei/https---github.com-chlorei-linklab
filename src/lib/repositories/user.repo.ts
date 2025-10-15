import dbConnect from "@/lib/db/dbConnect";
import User from "../db/models/User";

export async function addOne(firstName: string, lastName: string, email: string, password: string ) {
  await dbConnect();
  return User.create({ firstName, lastName, email, password });
}

export async function findAll() {
  await dbConnect();
  return User.find().sort({ createdAt: -1 }).lean();
}



export async function findOneByEmail(email: string) {
  await dbConnect();
  return User.findOne({ email }).lean(); 
}