import Main from "./components/Main/Main";
import { getSession } from "@/lib/auth/auth";

export default async function Home() {
  const session = await getSession();

  


  if (session) {
      return (
        <main className="min-h-screen flex justify-center mt-40">
          <div className="container mx-auto  px-4 ">
              <Main/>
          </div>
        </main>
      );
    }



  return (
 <main className="min-h-screen flex justify-center mt-40">
  <div className="container mx-auto  px-4 ">.
      <Main/>
  </div>
</main>
    
  );
}
