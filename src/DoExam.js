import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useTranslation } from 'react-i18next';
import { useLanguage } from './LanguageProvider';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function DoExam() {
  const { t } = useTranslation();
  const { selectedLanguage } = useLanguage();
  
  const [exam, setExam] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const { examId } = useParams();
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const token = localStorage.getItem('token');
  const decodedToken = jwtDecode(token);
  const { nameid: userId } = decodedToken;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExamById = async () => {
      try {
        const response = await fetch(`${BASE_URL}/Exam/detail/${examId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const examData = await response.json();
          setExam(examData);
          await fetchTranslations(examData.questions);
        } else {
          console.error('Failed to fetch exam:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching exam:', error);
      }
    };

    fetchExamById();
  }, [examId, selectedLanguage]);

  const fetchTranslations = async (questions) => {
    try {
      const updatedQuestions = await Promise.all(questions.map(async (question) => {
        const questionTranslations = await fetchQuestionTranslations(question.id);
        const updatedAnswers = await Promise.all(question.answers.map(async (answer) => {
          const answerTranslations = await fetchAnswerTranslations(answer.id);
          return { ...answer, translations: answerTranslations };
        }));
        return { ...question, translations: questionTranslations, answers: updatedAnswers };
      }));
      setExam(prevExam => ({ ...prevExam, questions: updatedQuestions }));
    } catch (error) {
      console.error('Error fetching translations:', error);
    }
  };

  const fetchQuestionTranslations = async (questionId) => {
    try {
      const response = await fetch(`${BASE_URL}/Question/${questionId}/translations/${selectedLanguage}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const translations = await response.json();
        return translations;
      } else {
        console.error(`Failed to fetch question translations for question ID ${questionId}:`, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching question translations:', error);
    }
    return [];
  };

  const fetchAnswerTranslations = async (answerId) => {
    try {
      const response = await fetch(`${BASE_URL}/Answer/${answerId}/translations/${selectedLanguage}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const translations = await response.json();
        return translations;
      } else {
        console.error(`Failed to fetch answer translations for answer ID ${answerId}:`, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching answer translations:', error);
    }
    return [];
  };

  const handleAnswerSelection = (questionId, answerId) => {
    setSelectedAnswers(prevState => ({
      ...prevState,
      [questionId]: answerId,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitRequest = {
        ExamId: examId,
        StudentId: userId,
        WebUserChooses: Object.keys(selectedAnswers).map(questionId => ({
          QuestionId: questionId,
          AnswerId: selectedAnswers[questionId]
        }))
      };

      const response = await fetch(`${BASE_URL}/Submission/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(submitRequest),
      });
      
      if (response.ok) {
        toast.success('Answers submitted successfully!');
      } else {
        toast.error('Failed to submit answers:', response.statusText);
      }
    } catch (error) {
      toast.error('Error submitting exam:', error);
    }
    finally {
      navigate('/exam-list');
    }
  };

  if (!exam) {
    return <div>{t('Loading...')}</div>;
  }

  return (
    <div className="container site-section">
      <ToastContainer/>
      <h1 className="my-4">{exam.title}</h1>
      <form onSubmit={handleSubmit}>
        {exam.questions.map((question) => (
          <div key={question.id} className="card my-4">
            <div className="card-body">
              <p className="card-text">{question.explanation}</p>
              {question.translations && question.translations.length > 0 && (
                <p className="card-text">{question.translations[0].content}</p>
              )}
              <ul className="list-unstyled">
                {question.answers.map((answer) => (
                  <li key={answer.id} className="form-check">
                    <input
                      type={question.isSingleChoice ? 'radio' : 'checkbox'}
                      id={answer.id}
                      className="form-check-input"
                      checked={selectedAnswers[question.id] === answer.id}
                      onChange={() => handleAnswerSelection(question.id, answer.id)}
                    />
                    <label htmlFor={answer.id} className="form-check-label">
                      {answer.name}
                      {answer.translations && answer.translations.length > 0 && (
                        <span> - {answer.translations[0].content}</span>
                      )}
                    </label>
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