import Link from "next/link";
import { AuthFooterLink, AuthLayout } from "@/components/AuthLayout";

export default function SignupPage() {
  return (
    <AuthLayout title="Sign up" subtitle="Choose how you want to use Vyaadh">
      <div className="space-y-4">
        <Link
          href="/signup/customer"
          className="block rounded-2xl border-2 border-stone-200 p-5 transition hover:border-teal-500 hover:bg-teal-50"
        >
          <h3 className="text-lg font-semibold text-stone-900">
            I need a worker
          </h3>
          <p className="mt-1 text-sm text-stone-600">
            Find skilled workers near you for home and daily tasks.
          </p>
        </Link>
        <Link
          href="/signup/worker"
          className="block rounded-2xl border-2 border-stone-200 p-5 transition hover:border-teal-500 hover:bg-teal-50"
        >
          <h3 className="text-lg font-semibold text-stone-900">I am a worker</h3>
          <p className="mt-1 text-sm text-stone-600">
            List your skills and pick up tasks from people nearby.
          </p>
        </Link>
      </div>
      <AuthFooterLink
        text="Already have an account?"
        href="/login"
        linkText="Log in"
      />
    </AuthLayout>
  );
}
