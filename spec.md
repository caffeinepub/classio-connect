# Classio Connect - Adaptive Learning Platform

## Current State
New project. No existing application files.

## Requested Changes (Diff)

### Add
- Login page with Classio logo (dark theme matching brand)
- Three distinct dashboards: Admin, Teacher, Student
- Admin dashboard: create and manage teachers (name, email, password)
- Teacher dashboard: create student IDs (school name, student name, mobile number - all mandatory), view their students
- Student dashboard: adaptive English learning platform with lesson/module progress tracking; resumes from last position on re-login
- Student login via: school name + student name + mobile number (no password needed - credentials are their identity)
- Role-based routing: after login, redirect to correct dashboard based on role
- Progress persistence: student's current lesson/module stored in backend; restored on re-login
- Adaptive learning modules: vocabulary, grammar, speaking practice, listening - with levels that adjust based on performance
- AI agent character (mascot) on student dashboard for interactive practice

### Modify
- Nothing (new project)

### Remove
- Nothing

## Implementation Plan
1. Backend: roles (admin/teacher/student), teacher CRUD by admin, student CRUD by teacher with school/name/mobile, student progress tracking per module, session resume
2. Frontend login: role selector + credentials form, Classio logo prominent
3. Admin dashboard: teacher management table, add teacher form
4. Teacher dashboard: student management, create student form with school name/student name/mobile
5. Student dashboard: learning modules grid, progress bars, resume indicator, AI mascot character
6. Progress persistence: on each lesson completion or navigation, save position to backend
