import * as Repo from "@/lib/repositories/user.repo";
import bcrypt from "bcryptjs";

interface Form {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export async function create(form: Form) {
  if (!form || !form.firstName || !form.lastName || !form.email || !form.password) {
    throw new Error("Missing required fields");
  }

  const hashPassword = await bcrypt.hash(form.password, 7);
  console.log("hashPassword", hashPassword);
  const user = await Repo.addOne(
    form.firstName,
    form.lastName,
    form.email,
    hashPassword
  );

  return {
    ok: true,
    user,
  };
}

export async function findAll() {
  return Repo.findAll();
}

export async function findOneByEmail(email : string){
  return Repo.findOneByEmail(email);
}

