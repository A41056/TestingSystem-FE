import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { useTranslation } from 'react-i18next';
import { useLanguage } from './LanguageProvider'; 
import { toast, ToastContainer } from 'react-toastify';

function AdminExamManager() {
  const { t } = useTranslation();
  const { selectedLanguage } = useLanguage();
  const [pageNum, setPageNum] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const PAGE_SIZE = 15;

  useEffect(() => {
  }, [selectedLanguage]);
  const [exams, setExams] = useState([]);
  const [filter, setFilter] = useState({
    userName: '',
    gender: '',
  });

  const BASE_URL = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    fetchExams();
  }, [filter, pageNum]); // Refetch exams when filters change

  const fetchExams = async () => {
    try {
      const token = localStorage.getItem('token');

      // Construct the API request URL based on the filter criteria
      let apiUrl = `${BASE_URL}/Exam/list?pageNum=${pageNum}&pageSize=${PAGE_SIZE}`;
      let queryString = Object.keys(filter)
        .filter(key => filter[key] !== '')
        .map(key => `${key}=${filter[key]}`)
        .join('&');
      if (queryString) {
        apiUrl += `?${queryString}`;
      }

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const examList = await response.json();
        setExams(examList.data);
        setTotalPages(examList.totalPages);
      } else {
        console.error('Failed to fetch exams:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching exams:', error);
    }
  };

  const handleChange = e => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    // Fetch users with updated filter values
    fetchExams();
  };

  const handleDeleteExam = async (examId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/Exam/delete/${examId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Update the courses state to reflect the deletion
        setExams(exams.filter((exam) => exam.examId !== examId));
        toast.success('Exam deleted successfully!');
      } else {
        console.error('Failed to delete course:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  const handlePageChange = (newPageNum) => {
    if (newPageNum > 0 && newPageNum <= totalPages) {
      setPageNum(newPageNum);
    }
  };

  return (
    <div className="site-section">
      <ToastContainer/>
        <div className="container-fluid">
      <div className="card mb-4">
        <div className="card-header">
          <strong>{t('Exams')}</strong>
        </div>
        <div className="card-body">
          <form className="row g-3 align-items-center" onSubmit={handleSubmit}>
            <div className="col-auto">
              <label className="visually-hidden" htmlFor="title">{t('ExamTitle')}</label>
              <input
                className="form-control"
                id="title"
                type="text"
                placeholder="Search by exam title"
                value={filter.title}
                name="title"  // Changed name attribute to match the filter key
                onChange={handleChange}
              />
            </div>
            <div className="col-auto">
              <button className="btn btn-primary" type="submit">{t('Search')}</button>
            </div>
            <div className="col-auto">
              <Link to="/admin-create-exam" className="btn btn-primary">{t('CreateExam')}</Link>
            </div>
          </form>
          <table className="table table-hover mt-3">
            {/* Table header */}
            <thead>
              <tr>
                <th scope="col">{t('Number')}</th>
                <th scope="col">{t('Title')}</th>
                <th scope="col">{t('Status')}</th>
                <th scope="col">{t('AutoGrade')}</th>
                <th scope="col">{t('CreatedAt')}</th>
                <th scope="col">{t('ModifiedAt')}</th>
                <th scope="col">{t('Teacher')}</th>
                <th scope="col">{t('Actions')}</th>
              </tr>
            </thead>
            {/* Table body */}
            <tbody>
              {exams.map((exam, index) => (
                <tr key={exam.examId}>
                  <td>{index + 1}</td>
                  <td>{exam.title}</td>
                  <td>{exam.status}</td>
                  <td>{exam.isAutoGrade ? 'Yes' : 'No'}</td>
                  <td>{exam.created}</td>
                  <td>{exam.modified}</td>
                  <td>{exam.createdByUserId ? exam.createdByUserId : 'Unknown'}</td> {/* Perform null check */}
                  <td>
                    <Link to={`/admin-edit-exam/${exam.examId}`}>{t('Edit')}</Link>
                    <button
                          className="btn btn-danger ms-2"
                          onClick={() => handleDeleteExam(exam.examId)}
                      >
                        {t('Delete')}
                      </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="row">
        <div className="col-12 d-flex justify-content-center">
          <nav>
            <ul className="pagination">
              <li className={`page-item ${pageNum === 1 ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => handlePageChange(pageNum - 1)}>
                  {t('Previous')}
                </button>
              </li>
              {[...Array(totalPages).keys()].map(num => (
                <li key={num + 1} className={`page-item ${pageNum === num + 1 ? 'active' : ''}`}>
                  <button className="page-link" onClick={() => handlePageChange(num + 1)}>
                    {num + 1}
                  </button>
                </li>
              ))}
              <li className={`page-item ${pageNum === totalPages ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => handlePageChange(pageNum + 1)}>
                  {t('Next')}
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
    </div>
    
  );
}

export default AdminExamManager;
