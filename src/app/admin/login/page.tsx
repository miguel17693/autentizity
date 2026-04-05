"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") ?? "/admin";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        router.push(from);
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Error de autenticación");
      }
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary">
      {/* Decorative circles */}
      <div className="absolute inset-0 overflow-hidden opacity-[0.03]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-white rounded-full" />
      </div>

      <div className="relative w-full max-w-sm mx-4">
        {/* Logo */}
        <div className="flex justify-center mb-10">
          <Image
            src="/images/logo-transparent.png"
            alt="AutentiZity"
            width={180}
            height={54}
            className="h-10 w-auto brightness-0 invert"
          />
        </div>

        {/* Card */}
        <div className="bg-white p-8">
          <div className="text-center mb-8">
            <h1 className="font-serif text-2xl text-primary font-light">
              Panel de Administración
            </h1>
            <p className="mt-2 text-text-secondary text-sm font-light">
              Introduce tus credenciales
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="username"
                className="block text-[11px] font-medium tracking-[0.1em] uppercase text-text-secondary mb-2"
              >
                Usuario
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
                className="w-full px-4 py-3 text-sm font-light border border-border bg-surface-alt focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors"
                placeholder="admin"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-[11px] font-medium tracking-[0.1em] uppercase text-text-secondary mb-2"
              >
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full px-4 py-3 text-sm font-light border border-border bg-surface-alt focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 px-4 py-2.5 border border-red-100">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-primary text-white text-[13px] font-medium tracking-[0.08em] uppercase hover:bg-primary-light transition-colors disabled:opacity-50"
            >
              {loading ? "Accediendo..." : "Acceder"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-white/20 text-xs font-light">
          © {new Date().getFullYear()} AutentiZity
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
