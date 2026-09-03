"use client";

import type { FormEvent, ReactNode } from "react";

export type ReusableFormField = {
  name: string;
  label: string;
  type?:
    | "text"
    | "number"
    | "email"
    | "tel"
    | "date"
    | "password"
    | "select"
    | "textarea"
    | "file";
  required?: boolean;
  placeholder?: string;
  accept?: string;
  options?: Array<{ label: string; value: string }>;
};

type ReusableFormProps = {
  title?: string;
  fields: ReusableFormField[];
  defaultValues?: Record<string, string | number | undefined>;
  submitLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  error?: string;
  children?: ReactNode;
  onSubmit: (values: Record<string, string>) => void | Promise<void>;
  onCancel?: () => void;
};

export default function ReusableForm({
  title,
  fields,
  defaultValues = {},
  submitLabel = "Save",
  cancelLabel = "Cancel",
  loading = false,
  error,
  children,
  onSubmit,
  onCancel,
}: ReusableFormProps) {
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const values = Object.fromEntries(
      Array.from(formData.entries()).map(([name, value]) => {

        if (value instanceof File) {
          return [name, value.name];
        }

        return [name, String(value ?? "")];
      }),
    );

    await onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      {title && <h3 className="mb-6 text-xl font-semibold text-gray-900">{title}</h3>}

      {error && (
        <div className="mb-5 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {fields.map((field) => (
          <FormField
            key={field.name}
            field={field}
            defaultValue={defaultValues[field.name]}
          />
        ))}
      </div>

      {children}

      <div className="mt-6 flex justify-end gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            {cancelLabel}
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
        >
          {loading ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}

function FormField({
  field,
  defaultValue,
}: {
  field: ReusableFormField;
  defaultValue?: string | number;
}) {
  const baseClassName =
    "mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition-colors hover:border-gray-300 focus:border-blue-500";

  return (
    <label className={field.type === "textarea" ? "block md:col-span-2" : "block"}>
      <span className="text-xs font-semibold uppercase text-gray-500">
        {field.label}
        {field.required ? " *" : ""}
      </span>

      {field.type === "select" ? (
        <select
          name={field.name}
          defaultValue={String(defaultValue ?? "")}
          required={field.required}
          className={baseClassName}
        >
          {field.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : field.type === "textarea" ? (
        <textarea
          name={field.name}
          defaultValue={String(defaultValue ?? "")}
          required={field.required}
          placeholder={field.placeholder}
          rows={4}
          className={baseClassName}
        />
      ) : field.type === "file" ? (
        <input
          name={field.name}
          type="file"
          required={field.required}
          accept={field.accept}
          className={baseClassName}
        />
      ) : (
        <input
          name={field.name}
          type={field.type ?? "text"}
          defaultValue={String(defaultValue ?? "")}
          required={field.required}
          placeholder={field.placeholder}
          className={baseClassName}
        />
      )}
    </label>
  );
}
