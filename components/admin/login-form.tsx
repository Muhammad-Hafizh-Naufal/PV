"use client";
import { useActionState } from "react";
import { ArrowRight } from "lucide-react";
import { login } from "@/lib/actions";
export function LoginForm({ configured }: { configured: boolean }) {
  const [state, action, pending] = useActionState(login, {
    ok: false,
    message: "",
  });
  return (
    <form action={action} className="login-form">
      <label>
        Email
        <input
          name="email"
          type="email"
          autoComplete="username"
          required
          disabled={!configured || pending}
        />
      </label>
      <label>
        Password
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          disabled={!configured || pending}
        />
      </label>
      <button
        type="submit"
        className="button button-dark"
        disabled={!configured || pending}
      >
        {pending ? "Signing in…" : "Sign in to your studio"}
        <ArrowRight size={16} />
      </button>
      {state.message && (
        <p className="form-message error" role="alert">
          {state.message}
        </p>
      )}
    </form>
  );
}
