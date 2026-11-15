// Lab day (AI required). This file ends up as the form described in CONTRACT.md §4.
import { useState } from "react";

const EMPTY = { code: "", title: "", department: "", credits: "", capacity: "", description: "" };

const FIELDS = [
  { name: "code", label: "Code" },
  { name: "title", label: "Title" },
  { name: "department", label: "Department" },
  { name: "credits", label: "Credits", type: "number" },
  { name: "capacity", label: "Capacity", type: "number" },
  { name: "description", label: "Description", textarea: true },
];

export function AddCourseForm({ onAdd }) {
  const [form, setForm] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const fieldErrors = error?.fieldErrors ?? {};

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await onAdd({
        code: form.code,
        title: form.title,
        department: form.department,
        credits: Number(form.credits),
        capacity: Number(form.capacity),
        description: form.description === "" ? null : form.description,
      });
      setForm(EMPTY);
    } catch (err) {
      setError(err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="add-course" onSubmit={handleSubmit}>
      <h2>Add a course</h2>
      {FIELDS.map(({ name, label, type, textarea }) => {
        const reason = fieldErrors[name];
        const Control = textarea ? "textarea" : "input";
        return (
          <div className="field" key={name}>
            <label htmlFor={`course-${name}`}>{label}</label>
            <Control
              id={`course-${name}`}
              type={textarea ? undefined : type}
              value={form[name]}
              onChange={(event) => setForm({ ...form, [name]: event.target.value })}
              aria-invalid={reason ? "true" : undefined}
              aria-describedby={reason ? `course-${name}-error` : undefined}
            />
            {reason && (
              <p className="field-error" id={`course-${name}-error`}>
                {reason}
              </p>
            )}
          </div>
        );
      })}
      {error && (
        <p className="form-error" role="alert">
          {error.message}
        </p>
      )}
      <button type="submit" disabled={submitting}>
        {submitting ? "Adding…" : "Add course"}
      </button>
    </form>
  );
}