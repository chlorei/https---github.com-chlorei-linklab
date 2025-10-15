// import * as Repo from "@/lib/repositories/user.repo";


// interface Form{
//   firstName: string, 
//   lastName: string, 
//   email: string,
//   password: string
// }


// export async function create(form: Form) {
//     Repo.addOne(
//       form?.firstName,
//       form?.lastName,
//       form?.email,
//       form?.password)
//       return { ok: true, form};
// }

// export async function findAll() {
//   return Repo.findAll();
// }

import * as Repo from "@/lib/repositories/user.repo";

interface Form {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export async function create(form: Form) {
  // Проверим, что форма есть и все поля заполнены
  if (!form || !form.firstName || !form.lastName || !form.email || !form.password) {
    throw new Error("Missing required fields");
  }

  // Передаём данные в репозиторий и обязательно ждём результат
  const user = await Repo.addOne(
    form.firstName,
    form.lastName,
    form.email,
    form.password
  );

  // Возвращаем результат
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