# Audit — React Lab 2

## 0. What came back

| File the AI gave | Contents (components, hooks) | Lines |
| --- | --- | --- |
| `src/courses/CoursesPage.jsx` | `CoursesPage` component; 9 `useState` calls covering the form fields and submit state; a call to `useCourses` | 136 |
| `src/courses/CoursesView.jsx` | `CoursesView` component (props: `courses, loading, error`) | 38 |
| `src/courses/useCourses.js` | `useCourses` hook with 3 `useState` calls (`courses`, `loading`, `error`) and 1 `useEffect` | 49 |

- **Does it run?** Yes. In the browser and in `CoursesPage.test.jsx`, the list loads, a new course appears in code order, a duplicate code shows the 409 message, and invalid input shows validation messages.
- **Network requests:** on page load, 2 in development (StrictMode runs the effect twice) and 1 in production. Per add, 1 (`POST /api/courses`).
- **`npm test` before any fix:** 38 passed, 24 failed. Failing files:
  - `CoursesView.test.jsx`: 1 failure; the loading check expects `status="loading"`.
  - `useCourses.test.jsx`: 10 failures; it expects a `status` string and an `ApiError` that is re-thrown.
  - `AddCourseForm.test.jsx`: 11 failures; the file it tests doesn't exist yet (still a placeholder).
  - `fieldErrors.test.jsx`: 2 failures; same reason.

## 1. Part A: the allowed list

| Element | Location (`file:line`) | Right place? |
| --- | --- | --- |
| One View that only renders | `CoursesView.jsx:2` | Yes, it only returns JSX. It does take `{ courses, loading, error }` where it should take `{ courses, status, error }`. |
| Fetch and logic in a separate hook | `useCourses.js:5` | Yes, fetching and state logic live in `useCourses`. |
| `useState` for the course list | `useCourses.js:6` | Yes. The list and the add action share it, so the hook is the right level. |
| `useState` for the form inputs | `CoursesPage.jsx:9-14` | No. Six input states sit in `CoursesPage`, but only the form uses them, so they belong in `AddCourseForm`. |
| `useEffect` for the initial fetch, with cleanup | `useCourses.js:10` | Yes. It runs once on mount and uses an `ignore` flag. |
| Props down, callbacks up | `CoursesPage.jsx:20` | No. The form is inlined in the page. It needs its own `AddCourseForm` that raises `onAdd` to the page. |
| `.map` with a stable `key` | `CoursesView.jsx:16` | Yes, `key={course.id}`. |
| Loading / error / empty from one `status` | Missing (see `CoursesView.jsx:3,7` and `useCourses.js:7`) | No. It uses a separate `loading` boolean plus `error`, not one `status` string (`"loading"` \| `"ready"` \| `"error"`). |

## 2. Part B: scanning for "not yet"

| Not yet | Found? | Role in this slice | Cut or keep |
| --- | --- | --- | --- |
| `useMemo` | No | None | N/A (ruled out by the prompt) |
| `useCallback` | No | None | N/A (ruled out by the prompt) |
| `useReducer` | No | None | N/A (ruled out by the prompt) |
| `useRef` | No | None | N/A (ruled out by the prompt) |
| Context | No | None | N/A (ruled out by the prompt) |
| Fetch library, axios, or raw `fetch` | No | None | N/A (`apiFetch` was used as told) |
| TypeScript | No | None | N/A (plain JS) |
| Anything else untaught | No | None | N/A |

## 3. The rule: every hook and component split

| Hook call or component | What it does here | Decision |
| --- | --- | --- |
| `CoursesPage` (`CoursesPage.jsx:6`) | Connects the hook and the child components on the page. | Keep |
| `useCourses()` call (`CoursesPage.jsx:7`) | Gives the page the courses, the load status and the add callback. | Keep |
| 6 × `useState("")` for inputs (`CoursesPage.jsx:9-14`) | Holds the half-typed values so the inputs are controlled. | Move to `AddCourseForm.jsx` |
| `useState(false)` `submitting` (`CoursesPage.jsx:16`) | Disables the submit button while the add request is pending. | Move to `AddCourseForm.jsx` |
| `useState(null)` `formError` (`CoursesPage.jsx:17`) | Holds the server's error message shown above the submit button. | Move to `AddCourseForm.jsx` |
| `useState({})` `fieldErrors` (`CoursesPage.jsx:18`) | Holds per-field validation errors for the invalid inputs. | Move to `AddCourseForm.jsx` |
| `CoursesView` (`CoursesView.jsx:2`) | A display-only component that draws the list and status messages from props. | Keep |
| `useCourses` (`useCourses.js:5`) | Handles loading the catalogue, the course list and adding a course. | Keep |
| `useState([])` `courses` (`useCourses.js:6`) | Holds the array of courses from the server. | Keep |
| `useState(true)` `loading` (`useCourses.js:7`) | Tracks loading as a boolean, not as part of one status. | Cut (replace with a `status` state) |
| `useState(null)` `error` (`useCourses.js:8`) | Holds the message if loading the list fails. | Keep |
| `useEffect` (`useCourses.js:10`) | Sends the one initial GET on mount, with cleanup. | Keep |

## 4. Decisions made before any fix prompt

- **Cut:**
  - The separate `loading` boolean in `useCourses.js`, replaced by one `status` string.
  - The inline form markup and form state in `CoursesPage.jsx`.
- **Move (from → to):**
  - The 6 input states, `submitting`, and the error states: `CoursesPage.jsx` → `AddCourseForm.jsx`.
  - The submit handler and the field-error rendering: `CoursesPage.jsx` → `AddCourseForm.jsx`.
- **Add (missing from the AI's version):**
  - A separate `AddCourseForm.jsx` that follows CONTRACT.md §4 (`export function AddCourseForm({ onAdd })`).
  - One `status` state (`"loading"` \| `"ready"` \| `"error"`) in `useCourses.js`, and a `CoursesView` that takes `{ courses, status, error }`.
  - Accessible errors in `AddCourseForm`: `aria-invalid="true"`, `aria-describedby` pointing each invalid input at its message's id, and `role="alert"` on the form-level message.
  - An `addCourse` in `useCourses.js` that re-throws the `ApiError`, so `AddCourseForm` can catch and show it.
- **Other smells:**
  - State at the wrong level: `CoursesPage.jsx` held every form input's state, though only the form needs it.
  - Not accessible to screen readers: field errors had no `aria-invalid` or `aria-describedby`.
  - Prop mismatch: the first draft used a `loading` prop, but the tests expect `status`.

## 5. Strip check

| Removed | `npm test` after | App after (loads / adds / shows errors) |
| --- | --- | --- |
| Nothing | 62 passed (62) | Loads, adds in code order, shows the 409 conflict and field errors |

The AI used none of the Part B items. The prompt-1 rule that stopped it was:
`"Use only useState and useEffect. Do not use useMemo, useCallback, useReducer, useRef, or context. No TypeScript. Plain fetch, no data-fetching library."`
Because this was stated up front, the model didn't reach for `useMemo` to sort the courses or `useCallback` on the handlers.

## 6. Before / after

|  | Before (first AI version) | After (mine) |
| --- | --- | --- |
| Files and components | 2 components (`CoursesPage`, `CoursesView`) in 3 files; form inlined in the page | 3 components (`CoursesPage`, `CoursesView`, `AddCourseForm`) plus 1 hook (`useCourses`) in 4 files |
| `useState` calls | 12 total: 9 in `CoursesPage.jsx`, 3 in `useCourses.js` (`courses`, `loading`, `error`) | 7 total: 4 in `AddCourseForm.jsx` (`form` object, `submitting`, `formError`, `fieldErrors`), 3 in `useCourses.js` (`courses`, `status`, `error`) |
| `useEffect` calls | 1 in `useCourses.js` | 1 in `useCourses.js` |
| "Not yet" items | 0 | 0 |
| Requests on load / per add | 2 on load (StrictMode) / 1 per add | 2 on load (StrictMode) / 1 per add |
| `npm test` | 38 passed / 24 failed | 62 passed / 0 failed |

## 7. Two sentences

- **What the AI got right that I might have missed:** It turned an empty description into `null` and used `Number()` rather than `parseInt()`, so a value like a decimal still reaches the server and fails validation there.
- **What I will always re-check:** I won't accept separate `loading` and `error` flags where one `status` string belongs, or form state sitting in the parent page when it should live inside its own component.