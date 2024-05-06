import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Import jwt_decode
import { useTranslation } from 'react-i18next';
import { useLanguage } from './LanguageProvider'; 

function DoExam() {
  const { t } = useTranslation();
  const { selectedLanguage } = useLanguage();

  useEffect(() => {
  }, [selectedLanguage]);
  
  const [exam, setExam] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const { examId } = useParams();
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const token = localStorage.getItem('token'); // Get token from localStorage
  const decodedToken = jwtDecode(token); // Decode the token
  const { nameid: userId } = decodedToken;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExamById = async () => {
      try {
        const response = await fetch(`${BASE_URL}/Exam/detail/${examId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Include token in the Authorization header
          },
        });

        if (response.ok) {
          const examData = await response.json();
          setExam(examData);
        } else {
          console.error('Failed to fetch exam:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching exam:', error);
      }
    };

    fetchExamById();
  }, [examId]);

  useEffect(() => {
    console.log('Selected Answers:', selectedAnswers);
  }, [selectedAnswers]);

  const handleAnswerSelection = async (questionId, answerId) => {
    try {
      // Update selectedAnswers state immediately
      setSelectedAnswers(prevState => ({
        ...prevState,
        [questionId]: answerId,
      }));
  
      // Call save-choose endpoint
      const response = await fetch(`${BASE_URL}/WebUserChoose/save-choose`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          Id: selectedAnswers[questionId], // Use selected answer ID
          WebUserId: userId,
          QuestionId: questionId,
          AnswerId: answerId,
          AnswerText: '', // You might need to adjust this based on your API requirements
          CorrectAnswer: false, // You might need to adjust this based on your API requirements
        }),
      });
  
      if (!response.ok) {
        console.error('Failed to save choice:', response.statusText);
        return;
      }
  
      const choiceData = await response.json();
      console.log('Choice Data:', choiceData);
    } catch (error) {
      console.error('Error saving choice:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitRequest = {
        ExamId: examId,
        StudentId: userId
      };

      console.log(submitRequest);

      const response = await fetch(`${BASE_URL}/Submission/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(submitRequest),
      });
      if (response.ok) {
        console.log('Answers submitted successfully!');
      } else {
        console.error('Failed to submit answers:', response.statusText);
      }

      console.log('Submitting exam...');
    } catch (error) {
      console.error('Error submitting exam:', error);
    }
    finally{
      navigate('/exam-list');
    }
  };

  if (!exam) {
    return <div>{t('Loading...')}</div>;
  }

  return (
    <div className="container site-section">
      <h1 className="my-4">{exam.title}</h1>
      <form onSubmit={handleSubmit}>
        {exam.questions.map((question) => (
          <div key={question.id} className="card my-4">
            <div className="card-body">
              <p className="card-text">{question.explanation}</p>
              <ul className="list-unstyled">
                {question.answers.map((answer) => (
                  <li key={answer.id} className="form-check">
                    <input
                      type={question.isSingleChoice ? 'radio' : 'checkbox'}
                      id={answer.id}
                      className="form-check-input"
                      checked={selectedAnswers[question.id] === answer.id}
                      onChange={() => {
                        handleAnswerSelection(question.id, answer.id);
                        console.log(`Radio button checked state for answer ${answer.id}:`, selectedAnswers[question.id] === answer.id);
                      }}
                    />
                    <label htmlFor={answer.id} className="form-check-label">{answer.name}</label>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
        <button type="submit" className="btn btn-primary">{t('Submit')}</button>
      </form>
    </div>
  );
}

export default DoExam;
