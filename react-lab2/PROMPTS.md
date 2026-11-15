# Prompt log — React Lab 2

- Name and roll number: Naboday Mete, MT2026058
- AI tool and plan: Claude free

---

## Prompt 1 — generate

**Sent:**

```text
CONTRACT.md prompt 1, unchanged
```

**What came back:**
Three files: `src/courses/useCourses.js`, `src/courses/CoursesView.jsx` and `src/courses/CoursesPage.jsx`.
- Hooks used: `useState` and `useEffect` only.
- It respected the restrictions: no `useMemo`, `useCallback`, `useReducer` or `useRef`.
- Problems: the whole add-course form went straight into `CoursesPage.jsx`, with no `AddCourseForm.jsx`. `useCourses.js` kept separate `loading` and `error` states instead of one `status` field (`"loading" | "ready" | "error"`). The form fields had no `aria-invalid` or `aria-describedby`.

**Did it run?**
- Browser / page test: the list loaded 20 courses; a valid add worked and landed in sorted order; the 409 conflict message showed; validation messages showed.
- `test/courses/CoursesPage.test.jsx`: 4 passed (all).
- Full `npm test`: 38 passed / 24 failed. The page works end to end, but the unit tests for `useCourses`, `AddCourseForm`, `CoursesView` and `fieldErrors` fail because the §4 structure isn't there yet.

**What I did with it:**
I saved the files into `src/courses/` and checked that the page behaves as a user would expect. I then audited it against the handout's Section 12 sheet before changing any code.

---

## Prompt 2 — fix to the seam

**Why I sent it:**
It carries out the decisions in AUDIT.md §4:
1. Pull the inline form out of `CoursesPage` into `AddCourseForm.jsx`, with controlled inputs and accessible field errors (`aria-invalid`, `aria-describedby`, `role="alert"`).
2. Merge the `loading` and `error` states in `useCourses.js` into one `status` string (`"loading"` | `"ready"` | `"error"`), and have `addCourse` re-throw the `ApiError` so the form catches it.
3. Change `CoursesView.jsx` to take `{ courses, status, error }`, with no state and no fetching.
4. Keep `CoursesPage.jsx` minimal, only wiring the hook, the view and the form.

**Sent:**

```text
I audited the code against "The Shape of a Good React Slice". Refactor it exactly as follows according to the seam in CONTRACT.md §4:

1. In src/courses/CoursesView.jsx:
   Export CoursesView({ courses, status, error }). Render purely from props: "loading" -> "Loading courses…", "error" -> "Couldn't load courses: <error>", empty -> "No courses yet.", otherwise <ul> with <li key={course.id}> with the two formatted lines. No hooks, no state.

2. In src/courses/useCourses.js:
   Export useCourses(). Return { courses, status, error, addCourse }. Use status: "loading" | "ready" | "error". Load GET /api/courses once on mount with ignore cleanup flag. In addCourse, POST /api/courses, insert 201 body into courses in code order as a new array, and let ApiError throw directly.

3. In src/courses/AddCourseForm.jsx:
   Export AddCourseForm({ onAdd }). Move the 6 inputs, submitting state, and form error states into this component. On submit, convert credits and capacity with Number(), set empty description to null, and await onAdd. When a field error occurs, set aria-invalid="true" and point aria-describedby to the field error message id. Put role="alert" on the form error message above the button.

4. In src/courses/CoursesPage.jsx:
   Call useCourses(), and render <h1>Courses</h1>, <CoursesView courses={courses} status={status} error={error} />, and <AddCourseForm onAdd={addCourse} />.

Rules: Use only useState and useEffect. No useMemo, useCallback, useReducer, useRef, or context. JavaScript only.
```

**What came back:**
Four files in the shape CONTRACT.md §4 asks for:
- `CoursesView.jsx`: a display-only component taking `{ courses, status, error }`
- `useCourses.js`: a hook handling the status, the course list and `addCourse`
- `AddCourseForm.jsx`: a form that owns its input state, its submitting state and the aria attributes
- `CoursesPage.jsx`: a thin page that only connects the pieces

**What I kept and what I rejected:**
I kept all four files. I checked that no extra hooks or libraries had crept in, and all 62 tests pass in `npm test` with no regressions.

---

## Afterwards

- **How many prompts did the whole feature take?**
  Two: one to generate working functionality, and one fix prompt that specified the §4 structure.
- **Which prompt would I write differently, and how?**
  In Prompt 1, I would name the single `status` field (`"loading" | "ready" | "error"`) and ask for a separate `AddCourseForm` component from the start, so the first output needed less restructuring.
- **One thing the prompt-1 rules prevented, or failed to prevent:**
  The ban on extra hooks worked: no `useMemo`, `useCallback`, `useReducer` or `useRef` appeared. It did not stop the AI from putting the whole form and its state into `CoursesPage.jsx`.