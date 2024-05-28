import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from './LanguageProvider';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ExamHistory() {
  const { t } = useTranslation();
  const { selectedLanguage } = useLanguage();
  const { examId } = useParams();
  const [exam, setExam] = useState(null);
  const [userChoices, setUserChoices] = useState({});
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const token = localStorage.getItem('token');

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
          console.log('Exam:', examData); // Log exam data
          setExam(examData);
          await fetchTranslations(examData.questions);
          await fetchUserChoices(examData.questions);
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
          console.log('Answer:', answer); // Log answer data
          return { ...answer, translations: answerTranslations };
        }));
        console.log('Question:', { ...question, translations: questionTranslations, answers: updatedAnswers }); // Log question data
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
        console.log("Answer: " + translations);
        return translations;
      } else {
        console.error(`Failed to fetch answer translations for answer ID ${answerId}:`, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching answer translations:', error);
    }
    return [];
  };

  const fetchUserChoices = async (questions) => {
    try {
      const userId = localStorage.getItem('userId');
      const updatedUserChoices = {};
      for (const question of questions) {
        const response = await fetch(`${BASE_URL}/userChoice/${userId}/question/${question.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const choices = await response.json();
          updatedUserChoices[question.id] = choices.map(choice => choice.answerId);
          console.log('User Choices for question ID', question.id, ':', choices); // Log user choices
        } else {
          console.error(`Failed to fetch user choices for question ID ${question.id}:`, response.statusText);
        }
      }
      console.log("User Choices:", updatedUserChoices);
      setUserChoices(updatedUserChoices);
    } catch (error) {
      console.error('Error fetching user choices:', error);
    }
  };

  if (!exam) {
    return <div>{t('Loading...')}</div>;
  }

  return (
    <div className="container site-section">
      <ToastContainer />
      <h1 className="my-4">{exam.title}</h1>
      <form>
        {exam.questions.map((question) => (
          <div key={question.id} className="card my-4">
            <div className="card-body">
              <p className="card-text">{question.explanation}</p>
              {question.translations && question.translations.length > 0 && (
                <p className="card-text">{question.translations[0].content}</p>
              )}
              <ul className="list-unstyled">
              {question.answers.map((answer) => (
                <li
                    key={answer.id}
                    className={`form-check ${
                    answer.correct ? 'correct-answer' : ''
                    } ${
                    userChoices[question.id]?.includes(answer.id)
                        ? answer.correct
                        ? 'user-correct'
                        : 'user-incorrect'
                        : ''
                    }`}
                    style={{ color: answer.correct ? 'green' : 'inherit' }} // Apply green color to correct answers
                >
                    <label htmlFor={answer.id} className="form-check-label">
                    {answer.name}
                    {answer.translations &&
                        answer.translations.length > 0 && (
                        <span> - {answer.translations[0].content}</span>
                        )}
                    </label>
                </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </form>
    </div>
  );
}

export default ExamHistory;