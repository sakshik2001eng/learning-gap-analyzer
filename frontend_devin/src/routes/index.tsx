import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '../components/Layout/Layout';
import { ProtectedRoute } from '../components/Auth/ProtectedRoute';
import { LandingPage } from '../pages/LandingPage';
import { Login } from '../pages/Login';
import { Signup } from '../pages/Signup';
import { StudentDashboard } from '../pages/StudentDashboard';
import { StudentGaps } from '../pages/StudentGaps';
import { IndividualGap } from '../pages/IndividualGap';
import { LearningPath } from '../pages/LearningPath';
import { Quizzes } from '../pages/Quizzes';
import { QuizPage } from '../pages/QuizPage';
import { StudentProgress } from '../pages/StudentProgress';
import { TeacherDashboard } from '../pages/TeacherDashboard';
import { TeacherStudents } from '../pages/TeacherStudents';
import { TeacherStudentDetail } from '../pages/TeacherStudentDetail';
import { TeacherGaps } from '../pages/TeacherGaps';
import { StudyMaterials } from '../pages/StudyMaterials';
import { Reports } from '../pages/Reports';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    path: '/student',
    element: (
      <ProtectedRoute requiredRole="student">
        <Layout role="student" />
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'dashboard',
        element: <StudentDashboard />,
      },
      {
        path: 'gaps',
        element: <StudentGaps />,
      },
      {
        path: 'gaps/:id',
        element: <IndividualGap />,
      },
      {
        path: 'learning-path',
        element: <LearningPath />,
      },
      {
        path: 'quizzes',
        element: <Quizzes />,
      },
      {
        path: 'quizzes/:id',
        element: <QuizPage />,
      },
      {
        path: 'progress',
        element: <StudentProgress />,
      },
    ],
  },
  {
    path: '/teacher',
    element: (
      <ProtectedRoute requiredRole="teacher">
        <Layout role="teacher" />
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'dashboard',
        element: <TeacherDashboard />,
      },
      {
        path: 'students',
        element: <TeacherStudents />,
      },
      {
        path: 'students/:id',
        element: <TeacherStudentDetail />,
      },
      {
        path: 'gaps',
        element: <TeacherGaps />,
      },
      {
        path: 'materials',
        element: <StudyMaterials />,
      },
      {
        path: 'reports',
        element: <Reports />,
      },
    ],
  },
]);
