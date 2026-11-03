// Section 08 — Destructuring, spread, rest, computed keys

// Destructure in the parameter list. credits defaults to 3 when missing.
export function describeCourse({ code, title, credits = 3 }) {
  // throw new Error("TODO");
  return `${code}: ${title} (${credits} cr)`;
}

// Return a NEW form object with one field changed. The field name is in a
// variable, so you need a computed property key.
export function updateField(form, name, value) {
  // throw new Error("TODO");
  return {
    ...form,
    [name]: value
  };
}

// Return a NEW object without one key. Use rest in a destructuring.
export function withoutField(obj, key) {
  // throw new Error("TODO");
  const { [key]: removed, ...rest } = obj;
  return rest;
}

// Why does useState return an array and not an object? Because array
// destructuring lets the caller pick the names. Return [first, rest].
export function firstAndRest(list) {
  // throw new Error("TODO");
  const [first, ...rest] = list;
  return [first, rest];
}
