// Lab day (AI required). This file ends up as the View described in CONTRACT.md §4.
function seatsText(seatsLeft) {
  if (seatsLeft === 0) return "Full";
  if (seatsLeft === 1) return "1 seat left";
  return `${seatsLeft} seats left`;
}

export function CoursesView({ courses, status, error }) {
  if (status === "loading") return <p>Loading courses…</p>;
  if (status === "error") return <p>Couldn't load courses: {error}</p>;
  if (courses.length === 0) return <p>No courses yet.</p>;

  return (
    <ul className="courses">
      {courses.map((course) => (
        <li key={course.id}>
          <strong>
            {course.code} · {course.title}
          </strong>
          <span>
            {course.credits} credits · {course.department} · {seatsText(course.seatsLeft)}
          </span>
        </li>
      ))}
    </ul>
  );
}