"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/axios";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Message from "@/components/ui/Message";

const RegisterForm: React.FC = () => {
  const router = useRouter();
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    const name = nameRef.current?.value.trim() || "";
    const email = emailRef.current?.value.toLowerCase().trim() || "";
    const password = passwordRef.current?.value || "";

    if (!name || !email || !password) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Invalid email format");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      await api.post("/api/auth/register", { name, email, password });
      setSuccess(true);
      nameRef.current!.value = "";
      emailRef.current!.value = "";
      passwordRef.current!.value = "";
      setTimeout(() => router.push("/login"), 1500);
    } catch (err: any) {
      setError(err.response?.data || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in-scale">
      <Input ref={nameRef} type="text" placeholder="Name" required />
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
        {loading ? "Registering..." : "Register"}
      </Button>
      {error && <Message variant="error">{error}</Message>}
      {success && (
        <Message variant="success">
          Registered successfully! Redirecting...
        </Message>
      )}
    </form>
  );
};
export default RegisterForm;
