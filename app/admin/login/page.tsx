import LoginForm from "./LoginForm";

export default function AdminLoginPage() {
  return (
    <section className="space-y-6 max-w-md">
      <h1 className="text-2xl font-semibold">Login Admin</h1>
      <p className="text-slate-300">
        Masukkan password admin untuk akses panel.
      </p>
      <LoginForm />
    </section>
  );
}
