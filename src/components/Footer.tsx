export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-5 py-6 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
        <p>&copy; {new Date().getFullYear()} Arsenal Countdown</p>
        <p>
          Fixture times may change. Check official sources for final match
          details.
        </p>
      </div>
    </footer>
  );
}
