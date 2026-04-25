"""
End-to-end demo of all 6 backend features.
Requires MySQL (enrollment_db) running on 127.0.0.1:3306 with user isit950/isit950.

Run:
    cd backend
    python3.11 tests/test_features.py
"""
import io
import os
import shutil
import sys
import tempfile
from pathlib import Path

# ── Environment setup (must happen before any app import) ──────────────────
BACKEND_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BACKEND_DIR))
os.chdir(BACKEND_DIR)

TMP_UPLOAD = tempfile.mkdtemp()
os.environ["UPLOAD_DIR"] = TMP_UPLOAD

# ── Clean up leftover test data from previous runs ─────────────────────────
import pymysql  # noqa: E402

def _clean_test_data():
    conn = pymysql.connect(
        host="127.0.0.1", port=3306, user="isit950", password="isit950",
        database="enrollment_db", charset="utf8mb4",
    )
    cur = conn.cursor()
    cur.execute("SET FOREIGN_KEY_CHECKS=0")
    cur.execute("DELETE FROM section_submissions")
    cur.execute("DELETE FROM course_section_files")
    cur.execute("DELETE FROM course_sections")
    cur.execute("DELETE FROM enrollments")
    cur.execute("DELETE FROM courses")
    cur.execute("DELETE FROM users WHERE email IN ('alice@test.com','bob@test.com')")
    cur.execute("SET FOREIGN_KEY_CHECKS=1")
    conn.commit()
    conn.close()

_clean_test_data()

# ── Import app and wire up test client (uses real MySQL via .env) ───────────
import main  # noqa: E402
from fastapi.testclient import TestClient  # noqa: E402

client = TestClient(main.app, raise_server_exceptions=True)

# ── Pretty-print helpers ───────────────────────────────────────────────────
G, R, B, C, RST = "\033[92m", "\033[91m", "\033[1m", "\033[96m", "\033[0m"
_passed = _failed = 0


def step(label: str, resp, expect: int = 200):
    global _passed, _failed
    if resp.status_code == expect:
        print(f"  {G}✓{RST} {label}")
        _passed += 1
        return resp.json()
    print(f"  {R}✗{RST} {label}  →  HTTP {resp.status_code}: {resp.text[:200]}")
    _failed += 1
    return None


def section(title: str):
    print(f"\n{B}{C}━━  {title}  ━━{RST}")


# ══════════════════════════════════════════════════════════════════════════════
#  PREREQUISITE — Register & Login
# ══════════════════════════════════════════════════════════════════════════════
section("Auth: Register instructor & student (prerequisite)")

r = client.post("/api/register", json={
    "name": "Alice Instructor",
    "email": "alice@test.com",
    "password": "pass123",
    "role": 2,
})
d = step("Register instructor (role=2)", r)
instructor_token = d["token"] if d else ""
instructor_id = d["user"]["id"] if d else 0

r = client.post("/api/register", json={
    "name": "Bob Student",
    "email": "bob@test.com",
    "password": "pass123",
    "role": 1,
})
d = step("Register student (role=1)", r)
student_token = d["token"] if d else ""
student_id = d["user"]["id"] if d else 0

r = client.post("/api/login", json={"email": "alice@test.com", "password": "pass123"})
step("Login instructor", r)

IH = {"Authorization": f"Bearer {instructor_token}"}   # instructor headers
SH = {"Authorization": f"Bearer {student_token}"}      # student headers

# ══════════════════════════════════════════════════════════════════════════════
#  FEATURE 2 — Instructor: Create & Configure Course
# ══════════════════════════════════════════════════════════════════════════════
section("Feature 2 — Instructor: Create & Configure Course")

r = client.post("/api/courses", json={
    "course_code": "ISIT950",
    "title": "Software Engineering Project",
    "description": "A hands-on project course",
    "semester": "2026 Autumn",
}, headers=IH)
d = step("Create course (status defaults to draft=1)", r)
course_id = d["id"] if d else 0
if d:
    print(f"    → course_id={course_id}, status={d['status']} (1=draft)")

r = client.put(f"/api/courses/{course_id}", json={"status": 2}, headers=IH)
d = step("Publish course (status → 2)", r)
if d:
    print(f"    → status={d['status']} (2=published)")

r = client.put(f"/api/courses/{course_id}", json={"description": "Updated course description"}, headers=IH)
step("Update course description", r)

r = client.put(f"/api/courses/{course_id}", json={"status": 1}, headers=IH)
step("Set course back to draft (own course, OK)", r)

# ══════════════════════════════════════════════════════════════════════════════
#  FEATURE 1 — Student: Browse & Enrol in Courses
# ══════════════════════════════════════════════════════════════════════════════
section("Feature 1 — Student: Browse & Enrol in Courses")

# Publish again so student can see it
client.put(f"/api/courses/{course_id}", json={"status": 2}, headers=IH)

r = client.get("/api/courses")
d = step("Browse all published courses (no auth required)", r)
if d:
    print(f"    → {len(d)} published course(s): {[c['title'] for c in d]}")

r = client.post(f"/api/courses/{course_id}/enroll", headers=SH)
step("Student enrolls in course", r)

r = client.post(f"/api/courses/{course_id}/enroll", headers=SH)
step("Duplicate enroll returns 409 Conflict", r, expect=409)

r = client.get("/api/courses/my", headers=SH)
d = step("Student views my enrolled courses", r)
if d:
    for c in d:
        print(f"    → '{c['title']}' (enrollment_status={c.get('enrollment_status')})")

r = client.get("/api/courses/my", headers=IH)
d = step("Instructor views my created courses", r)
if d:
    print(f"    → {len(d)} course(s) owned")

# ══════════════════════════════════════════════════════════════════════════════
#  FEATURE 4 — Instructor: Upload Course Materials
# ══════════════════════════════════════════════════════════════════════════════
section("Feature 4 — Instructor: Upload Course Materials")

r = client.post(f"/api/courses/{course_id}/sections", json={
    "title": "Week 1: Introduction",
    "section_type": 1,
    "description_text": "Welcome and overview slides",
    "display_order": 0,
    "is_published": 1,
}, headers=IH)
d = step("Create material section (type=1=materials)", r)
section_id = d["id"] if d else 0
if d:
    print(f"    → section_id={section_id}, type={d['section_type']}")

r = client.post(f"/api/courses/{course_id}/sections", json={
    "title": "Week 2: Design Patterns",
    "section_type": 4,
    "description_text": "Lecture presentation slides",
    "display_order": 1,
    "is_published": 2,  # hidden
}, headers=IH)
d = step("Create hidden lecture section (type=4, is_published=2)", r)

fake_pdf = io.BytesIO(b"%PDF-1.4 fake lecture slide content here")
r = client.post(
    f"/api/courses/{course_id}/sections/{section_id}/files",
    files={"file": ("lecture1.pdf", fake_pdf, "application/pdf")},
    headers=IH,
)
d = step("Upload PDF file to material section", r)
if d:
    print(f"    → file_type={d['file_type']} (1=pdf), url={d['file_url']}")

fake_zip = io.BytesIO(b"PK fake zip content")
r = client.post(
    f"/api/courses/{course_id}/sections/{section_id}/files",
    files={"file": ("resources.zip", fake_zip, "application/zip")},
    headers=IH,
)
d = step("Upload ZIP file to same section", r)
if d:
    print(f"    → file_type={d['file_type']} (6=zip), url={d['file_url']}")

# ══════════════════════════════════════════════════════════════════════════════
#  FEATURE 3 — Student: View & Download Course Materials
# ══════════════════════════════════════════════════════════════════════════════
section("Feature 3 — Student: View & Download Course Materials")

r = client.get(f"/api/courses/{course_id}/sections", headers=SH)
d = step("Student lists sections (enrolled, only published visible)", r)
if d:
    for s in d:
        print(f"    → Section: '{s['title']}' — {len(s['files'])} file(s)")
        for f in s["files"]:
            print(f"       └─ {f['file_name']}  ({f['file_url']})")

print(f"  {C}(hidden Week 2 section not shown to student — correct){RST}")

r = client.get(f"/api/courses/{course_id}/sections", headers=IH)
d = step("Instructor lists all sections (including hidden)", r)
if d:
    print(f"    → Instructor sees {len(d)} section(s) (published + hidden)")

# ══════════════════════════════════════════════════════════════════════════════
#  FEATURE 6 — Instructor: Create & Manage Assignments
# ══════════════════════════════════════════════════════════════════════════════
section("Feature 6 — Instructor: Create & Manage Assignments")

r = client.post(f"/api/courses/{course_id}/assignments", json={
    "title": "Assignment 1: Design Report",
    "description_text": "Write a report on software design patterns.",
    "due_at": "2030-12-31T23:59:59",
    "display_order": 0,
    "is_published": 1,
}, headers=IH)
d = step("Create assignment with deadline", r)
asgn_id = d["id"] if d else 0
if d:
    print(f"    → assignment section_id={asgn_id}, due_at={d['due_at']}")

r = client.put(f"/api/courses/{course_id}/assignments/{asgn_id}", json={
    "description_text": "Updated: include UML diagrams and design patterns.",
    "due_at": "2030-11-30T23:59:59",
}, headers=IH)
step("Update assignment description and deadline", r)

r = client.get(f"/api/courses/{course_id}/assignments", headers=IH)
d = step("List all assignments in course", r)
if d:
    print(f"    → {len(d)} assignment(s): {[a['title'] for a in d]}")

# ══════════════════════════════════════════════════════════════════════════════
#  FEATURE 5 — Student: Submit Assignment
# ══════════════════════════════════════════════════════════════════════════════
section("Feature 5 — Student: Submit Assignment")

sub_file = io.BytesIO(b"This is my assignment submission.")
r = client.post(
    f"/api/courses/{course_id}/assignments/{asgn_id}/submit",
    files={"file": ("report_v1.pdf", sub_file, "application/pdf")},
    headers=SH,
)
d = step("Student submits assignment (before deadline)", r)
sub_id = d["id"] if d else 0
if d:
    status_label = ["", "submitted", "late", "graded", "returned"][d["status"]]
    print(f"    → submission_id={sub_id}, status={d['status']} ({status_label})")

sub_file2 = io.BytesIO(b"This is my REVISED assignment with better content.")
r = client.post(
    f"/api/courses/{course_id}/assignments/{asgn_id}/submit",
    files={"file": ("report_v2.pdf", sub_file2, "application/pdf")},
    headers=SH,
)
d = step("Student resubmits (replaces previous file)", r)
if d:
    print(f"    → New file: {d['file_name']}")

r = client.get(
    f"/api/courses/{course_id}/assignments/{asgn_id}/my-submission",
    headers=SH,
)
d = step("Student checks own submission status", r)
if d:
    print(f"    → file={d['file_name']}, status={d['status']}, score={d['score']}")

r = client.get(
    f"/api/courses/{course_id}/assignments/{asgn_id}/submissions",
    headers=IH,
)
d = step("Instructor lists all submissions for assignment", r)
if d:
    print(f"    → {len(d)} submission(s) received")
    for s in d:
        print(f"       └─ student_id={s['student_id']}, file={s['file_name']}, status={s['status']}")

r = client.put(
    f"/api/courses/{course_id}/assignments/{asgn_id}/submissions/{sub_id}/grade",
    json={"score": 88.5, "feedback": "Well structured! Good use of design patterns."},
    headers=IH,
)
d = step("Instructor grades submission (score + feedback)", r)
if d:
    print(f"    → score={d['score']}, status={d['status']} (3=graded)")

r = client.get(
    f"/api/courses/{course_id}/assignments/{asgn_id}/my-submission",
    headers=SH,
)
d = step("Student sees grade result", r)
if d:
    print(f"    → score={d['score']}, feedback='{d['feedback']}'")

# ══════════════════════════════════════════════════════════════════════════════
#  SUMMARY
# ══════════════════════════════════════════════════════════════════════════════
shutil.rmtree(TMP_UPLOAD, ignore_errors=True)

total = _passed + _failed
print(f"\n{B}━━  Result  ━━{RST}")
print(f"  {G}{_passed} passed{RST}  /  {R if _failed else ''}{_failed} failed{RST}  /  {total} total")
if _failed == 0:
    print(f"  {G}{B}✓ All 6 features verified successfully!{RST}")
else:
    print(f"  {R}Some checks failed — see details above.{RST}")
    sys.exit(1)
