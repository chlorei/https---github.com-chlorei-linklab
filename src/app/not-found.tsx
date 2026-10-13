import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen grid place-items-center px-4 text-primary-text">
      <div className="text-center">
        <h1 className="text-5xl font-extrabold mb-2">404</h1>
        <p className="text-lg opacity-80">Page not found</p>
        <Link href="/" className="mt-6 inline-block underline underline-offset-4">
          Go home
        </Link>
      </div>
    </main>
  );
}
