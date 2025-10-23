import dbConnect from "../db/dbConnect";
import Location from "../db/models/Location";


export async function addOne(title: string, clicks: number): Promise<void> {
  await dbConnect();
  await Location.create({ title, clicks });
}