import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-white/10 bg-slate-950/90">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5">
        <Link className="text-lg font-bold text-white" href="/">
          Arsenal Countdown
        </Link>
        <nav aria-label="Primary navigation">
          <ul className="flex gap-4 text-sm font-medium text-slate-300">
            <li>
              <Link className="transition hover:text-white" href="/">
                Home
              </Link>
            </li>
            <li>
              <a className="transition hover:text-white" href="#fixtures">
                Fixtures
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
