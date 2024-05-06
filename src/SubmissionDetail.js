import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // Import jwt_decode
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from './LanguageProvider'; 

function SubmissionDetail() {
  const { t } = useTranslation();
  const { selectedLanguage } = useLanguage();

  useEffect(() => {
  }, [selectedLanguage]);
  const [submissions, setSubmissions] = useState([]);
  const token = localStorage.getItem('token'); // Get token from localStorage
  const decodedToken = jwtDecode(token); // Decode the token
  const { nameid: userId } = decodedToken;
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const { examId } = useParams();

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await fetch(`${BASE_URL}/Submission/getSubmissions?userId=${userId}&examId=${examId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Include token in the Authorization header
          },
        });
        if (response.ok) {
          const responseData = await response.json();
          const data = responseData.data; // Access the data array
          console.log(data); // Add this line to check the value of data
          if (Array.isArray(data)) {
            setSubmissions(data);
          } else {
            console.error('Response data is not an array:', data);
          }
        } else {
          console.error('Failed to fetch submissions:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching submissions:', error);
      }
    };

    fetchSubmissions();
  }, [userId]);

  return (
    <div className="container site-section">
      <h2>Submissions</h2>
      <div className="row row-cols-1 row-cols-md-2 g-4">
        {submissions.map((submission, index) => (
          <div key={submission.id} className="col">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{t('Submission')} {index + 1}</h5>
                <p className="card-text">
                  <strong>{t('Submitted At')}:</strong> {submission.submittedAt ? new Date(submission.submittedAt).toLocaleString() : '-'}
                </p>
                <p className="card-text">
                  <strong>{t('Score')}:</strong> {submission.score !== null ? submission.score.toFixed(2) : '-'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Link to="/exam-list" className="btn btn-primary mt-3">{t('Back')}</Link>
    </div>
  );
}

export default SubmissionDetail;
