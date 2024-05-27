import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Home from './Home';
import Login from './Login';
import Register from './Register';
import UserDetail from './UserDetail';
import ExamList from './ExamList';
import CourseList from './CourseList';
import DoExam from './DoExam';
import Learn from './Learn';
import History from './History';
import SubmissionDetail from './SubmissionDetail';
import ForgotPassword from './ForgotPassword';
import UserChangePassword from './UserChangePassword';
import AdminHome from './AdminHome';
import AdminHeader from './AdminHeader';
import AdminFooter from './AdminFooter';
import AdminUserManager from './AdminUserManager';
import AdminUserCreate from './AdminUserCreate';
import AdminUserEdit from './AdminUserEdit';
import AdminExamCreate from './AdminExamCreate';
import AdminExamManager from './AdminExamManager';
import AdminExamEdit from './AdminExamEdit';
import AdminCategoryManager from './AdminCategoryManager';
import AdminCategoryCreate from './AdminCategoryCreate';
import AdminCategoryTranslationCreate from './AdminCategoryTranslationCreate';
import AdminCategoryEdit from './AdminCategoryEdit';
import AdminCourseManager from './AdminCourseManager';
import AdminCourseCreate from './AdminCourseCreate';
import AdminLessionCreate from './AdminLessonCreate';
import AdminCourseTranslationCreate from './AdminCourseTranslationCreate';
import AdminLessonTranslationCreate from './AdminLessonTranslationCreate';
import AdminLessonEdit from './AdminLessonEdit';
import AdminCourseEdit from './AdminCourseEdit';
import AdminCourseDetailCreate from './AdminCourseDetailCreate';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    // Check if there is a stored authentication token and username in localStorage
    const storedToken = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    const storedRole = localStorage.getItem('role');
    const storedUserId = localStorage.getItem('userId');

    if (storedToken && storedUsername && storedRole && storedUserId) {
      setIsAuthenticated(true);
      setUsername(storedUsername);
      setRole(storedRole);
      setUserId(userId);
    }
  }, []);

  const handleLoginSuccess = (username, token, role, userId) => {
    setIsAuthenticated(true);
    setUsername(username);
    setRole(role);
    setUserId(userId);
    // Store the authentication token, username, and role in localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    localStorage.setItem('role', role);
    localStorage.setItem('userId', userId);
  };

  return (
    <Router>
      <div className="site-wrap">
        <Routes>
          <Route
          path="*"
          element={isAuthenticated ? <AuthenticatedRoutes isAuthenticated={isAuthenticated} username={username} role={role} userId={userId}/> : <Navigate to='/login' />}
          />
          <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/change-password" element={<UserChangePassword />} />
        </Routes>
      </div>
    </Router>
  );
}

//
function AuthenticatedRoutes({isAuthenticated, username, role, userId }) {
  return (
      <>
          {role === 'Admin' ? (
              <AdminHeader isAuthenticated={isAuthenticated} username={username} />
            ) : (
              <Header isAuthenticated={isAuthenticated} username={username} userId={userId}/>
            )}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/exam-list" element={<ExamList />} />
            <Route path="/course-list" element={<CourseList />} />
            <Route path="/submission-detail/:examId" element={<SubmissionDetail />} />
            <Route path="/do-exam/:examId" element={<DoExam />} />
            <Route path="/learn/:courseId" element={<Learn />} />
            <Route path="/user-detail/:userId" element={<UserDetail />} />
            <Route path="/history" element={<History />} />
            
            <Route path="/admin-home" element={<AdminHome />} />

            <Route path="/admin-users" element={<AdminUserManager />} />
            <Route path="/admin-create-user" element={<AdminUserCreate />} />
            <Route path="/admin-edit-user/:userId" element={<AdminUserEdit />} />

            <Route path="/admin-exams" element={<AdminExamManager />} />
            <Route path="/admin-create-exam" element={<AdminExamCreate />} />
            <Route path="/admin-edit-exam/:examId" element={<AdminExamEdit />} />

            <Route path="/admin-categories" element={<AdminCategoryManager />} />
            <Route path="/admin-create-category" element={<AdminCategoryCreate />} />
            <Route path="/admin-edit-category/:categoryId" element={<AdminCategoryEdit />} />
            <Route path="/admin-create-category-translation/:categoryId" element={<AdminCategoryTranslationCreate />} />

            <Route path="/admin-courses" element={<AdminCourseManager />} />
            <Route path="/admin-create-course" element={<AdminCourseCreate />} />
            <Route path="/admin-edit-course/:courseId" element={<AdminCourseEdit />} />
            <Route path="/admin-create-lesson/:courseId" element={<AdminLessionCreate />} />
            <Route path="/admin-create-course-translation/:courseId" element={<AdminCourseTranslationCreate />} />
            <Route path="/admin-create-detail/:courseId" element={<AdminCourseDetailCreate />} />

            <Route path="/admin-edit-lesson/:courseId/:lessonId" element={<AdminLessonEdit />} />
            <Route path="/admin-create-lesson-translation/:courseId/:lessonId" element={<AdminLessonTranslationCreate />} />

          </Routes>
          {role === 'Admin' ? <AdminFooter /> : <Footer />}
      </>
  );
}

export default App;
