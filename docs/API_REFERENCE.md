# AI Voice Recruiter - RESTful API Reference

All API routes follow standard RESTful conventions, supporting JSON request and response bodies.

---

## 1. Interviews API

### `GET /api/interviews`
List all interviews with optional role and status filtering.
- **Query Parameters**:
  - `role` *(string, optional)*: Filter by job title or role.
  - `status` *(string, optional)*: Filter by `scheduled`, `in_progress`, `completed`.
- **Response**: `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "int_123",
      "candidate_name": "Jane Doe",
      "role": "Senior Full Stack Engineer",
      "status": "scheduled",
      "created_at": "2026-03-20T10:00:00.000Z"
    }
  ],
  "timestamp": "2026-03-20T10:00:00.000Z"
}
```

### `POST /api/interviews`
Create a new interview record.
- **Request Body**:
```json
{
  "candidate_name": "Jane Doe",
  "candidate_email": "jane@example.com",
  "role": "Senior Full Stack Engineer",
  "job_description": "We are seeking an experienced engineer...",
  "difficulty": "senior",
  "skills": ["TypeScript", "Next.js", "PostgreSQL"]
}
```
- **Response**: `201 Created`

### `GET /api/interviews/:id`
Fetch single interview details.

### `PATCH /api/interviews/:id`
Update interview status (`in_progress`, `completed`, etc.).

### `POST /api/interviews/:id/questions`
Generate AI-calibrated questions for the interview.

---

## 2. Reports API

### `GET /api/reports`
List candidate evaluation reports.

### `POST /api/reports`
Generate an evaluation report based on completed interview transcript and answers.

### `GET /api/reports/:id`
Fetch a specific candidate report by ID.

### `DELETE /api/reports/:id`
Delete a candidate report.

---

## 3. Backward-Compatible Routes

For seamless compatibility with existing client integrations:
- `POST /api/save-interview` -> Delegates to `interviewService.saveSession()`
- `GET /api/get-interviews` -> Delegates to `interviewService.getInterviews()`
- `GET /api/get-reports` -> Delegates to `reportService.getReports()`
- `GET /api/get-single-report` -> Delegates to `reportService.getReportById()`
- `POST /api/delete-report` -> Delegates to `reportService.deleteReport()`
