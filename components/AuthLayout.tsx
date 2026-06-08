import Link from "next/link";
import { VyaadhLogo } from "@/components/VyaadhLogo";

export function AuthLayout({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-stone-50 px-4 py-8">
      <div className="mx-auto max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <VyaadhLogo size={88} />
          <h1 className="mt-4 text-3xl font-bold text-stone-900">Vyaadh</h1>
          {subtitle && (
            <p className="mt-1 text-sm text-stone-600">{subtitle}</p>
          )}
        </div>
        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-semibold text-stone-900">{title}</h2>
          {children}
        </div>
        <p className="mt-6 text-center text-xs text-stone-500">
          Connecting workers with people who need them.
        </p>
      </div>
    </div>
  );
}

export function AuthFooterLink({
  text,
  href,
  linkText,
}: {
  text: string;
  href: string;
  linkText: string;
}) {
  return (
    <p className="mt-6 text-center text-sm text-stone-600">
      {text}{" "}
      <Link href={href} className="font-semibold text-teal-700 hover:underline">
        {linkText}
      </Link>
    </p>
  );
}

export function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-stone-700">{label}</span>
      {children}
    </label>
  );
}

export const inputClassName =
  "w-full rounded-xl border border-stone-300 px-4 py-3 text-base outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100";

export const buttonClassName =
  "w-full rounded-xl bg-teal-600 py-3.5 text-base font-semibold text-white hover:bg-teal-700 disabled:opacity-60";
