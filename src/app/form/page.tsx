// src/app/form/page.tsx
"use client"; // Karena menggunakan hooks

import InputForm from "../../components/InputForm";

export default function FormPage() {
  return (
    <div>
      <h1 className="title">GrowLog Create Progress</h1>
      <p className="subtitle">Create progress belajar.</p>
      <InputForm />
    </div>
  );
}
