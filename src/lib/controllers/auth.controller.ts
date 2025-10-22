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

export async function updateProfile(
  userId: string,
  updateData: { firstName?: string; lastName?: string; email?: string }
) {
  const clean = {
    firstName: updateData.firstName?.trim(),
    lastName:  updateData.lastName?.trim(),
    email:     updateData.email?.trim().toLowerCase(),
  };

  // уберём пустые строки, чтобы не перезаписывать null-ами
  Object.keys(clean).forEach((k) => {
    const key = k as keyof typeof clean;
    if (clean[key] === "" || clean[key] == null) delete clean[key];
  });

  const updated = await Repo.updateProfile(userId, clean);
  return updated; // { _id, firstName, lastName, email, ... }
}

export async function deleteOne(userId: string) {
  return Repo.deleteOne(userId);
}

export async function deleteAll() {
  return Repo.deleteAll();
}