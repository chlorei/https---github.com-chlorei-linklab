"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { inputClass } from "@/app/components/UI/Field/Field";

type Props = React.InputHTMLAttributes<HTMLInputElement>;

export default function PasswordInput({ className = "", ...props }: Props) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input {...props} type={show ? "text" : "password"} className={`${inputClass} pr-11 ${className}`} />
      <button
        type="button"
        onClick={() => setShow((p) => !p)}
        aria-label={show ? "Hide password" : "Show password"}
        className="absolute right-1 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-control text-ink-faint hover:text-ink"
      >
        {show ? <EyeOff size={17} /> : <Eye size={17} />}
      </button>
    </div>
  );
}
