"use client";

import { useRef, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Message from "@/components/ui/Message";

const LoginForm: React.FC = () => {
  const router = useRouter();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const email = emailRef.current?.value.trim() || "";
    const password = passwordRef.current?.value || "";

    if (!email || !password) {
      setError("Both fields are required");
      setLoading(false);
      return;
    }

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid email or password");
      setLoading(false);
    } else {
      router.push("/");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in-scale">
      <Input ref={emailRef} type="email" placeholder="Email" required />
      <Input
        ref={passwordRef}
        type="password"
        placeholder="Password"
        required
      />
      <Button
        type="submit"
        loading={loading}
        variant="primary"
        className="w-full"
      >
        {loading ? "Logging in..." : "Login"}
      </Button>
      {error && <Message variant="error">{error}</Message>}
    </form>
  );
};
export default LoginForm;
