 "use client";
import { useFormState } from "react-dom";
import { loginAction } from "./login_actions";

const initial: any = null;

export default function LoginForm() {
  const [state, formAction] = useFormState(loginAction, initial);
  return (
    <form className="grid gap-4" action={formAction}>
      {state?.error && (
        <div className="rounded border border-red-700 bg-red-900/40 text-red-200 px-3 py-2">
          {state.error}
        </div>
      )}
      <label className="grid gap-2">
        <span className="text-sm">Password</span>
        <input type="password" name="password" required className="rounded bg-slate-800 border border-slate-700 px-3 py-2" />
      </label>
      <button className="rounded bg-emerald-600 hover:bg-emerald-500 px-4 py-2">Login</button>
    </form>
  );
}
