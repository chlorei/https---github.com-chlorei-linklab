// app/not-found.tsx
export default function NotFound() {
  return (
    <main className="min-h-screen grid place-items-center bg-background text-foreground px-4">
      <div className="text-center">
        <h1 className="text-5xl font-extrabold mb-2">404</h1>
        <p className="text-lg opacity-80">Страница не найдена</p>
      </div>
    </main>
  );
}