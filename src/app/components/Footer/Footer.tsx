import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-line">
      <div className="shell flex flex-col gap-3 py-8 text-sm text-ink-soft sm:flex-row sm:items-center sm:justify-between">
        <p>Relinxr is open source.</p>
        <nav aria-label="Footer" className="flex gap-5">
          <Link href="/about" className="hover:text-ink">
            About
          </Link>
          <Link href="/privacy" className="hover:text-ink">
            Privacy
          </Link>
          <a href="https://github.com/chlorei/https---github.com-chlorei-linklab" className="hover:text-ink">
            GitHub
          </a>
        </nav>
      </div>
    </footer>
  );
}
