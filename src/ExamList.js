import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from './LanguageProvider';

function ExamList() {
  const { t } = useTranslation();
  const { selectedLanguage } = useLanguage();

  useEffect(() => {
    console.log("Home: Selected language changed to:", selectedLanguage);
  }, [selectedLanguage]);

  const [exams, setExams] = useState([]);
  const [pageNum, setPageNum] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const PAGE_SIZE = 15;
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    fetchExams();
  }, [pageNum]);

  const fetchExams = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/Exam/list?pageNum=${pageNum}&pageSize=${PAGE_SIZE}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setExams(data.data); // Assuming your backend returns a field `items` for the list of exams
        setTotalPages(data.totalPages); // Assuming your backend returns a field `totalPages` for the total number of pages
      } else {
        console.error('Failed to fetch exams:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching exams:', error);
    }
  };

  const handlePageChange = (newPageNum) => {
    if (newPageNum > 0 && newPageNum <= totalPages) {
      setPageNum(newPageNum);
    }
  };

  return (
    <div className="container-fluid site-section">
      <div className="row">
        {exams.map((exam) => (
          <div key={exam.examId} className="col-md-6">
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">{exam.title}</h5>
                <p className="card-text">{t('Status')}: {exam.status}</p>
                <p className="card-text">{t('AutoGrade')}: {exam.isAutoGrade ? 'Yes' : 'No'}</p>
                <p className="card-text">{t('CreatedAt')}: {exam.created}</p>
                <p className="card-text">{t('ModifiedAt')}: {exam.modified}</p>
                <p className="card-text">{t('Teacher')}: {exam.createdByUserId ? exam.createdByUserId : 'Unknown'}</p>
                <Link to={`/do-exam/${exam.examId}`} className="btn btn-primary">{t('AttemptExam')}</Link>
                <Link to={`/submission-detail/${exam.examId}`} className="btn btn-secondary">{t('SubmissionDetail')}</Link>
              </div>
            </div>
          </div>
        ))}
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
  );
}

export default ExamList;