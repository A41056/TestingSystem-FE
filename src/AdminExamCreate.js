import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useTranslation } from 'react-i18next';
import { useLanguage } from './LanguageProvider'; 
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AdminExamCreate() {
  const { t } = useTranslation();
  const { selectedLanguage } = useLanguage();

  const [courseId, setCourseId] = useState('');
  const [lessonId, setLessonId] = useState('');
  const [examTitle, setExamTitle] = useState('');
  const [courses, setCourses] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [questions, setQuestions] = useState([
    { explanation: '', type: 'single', isSingleChoice: true, answers: [{ name: '', correct: false }] }
  ]);

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [languageList, setLanguageList] = useState([]);
  const [selectedLanguageCode, setSelectedLanguageCode] = useState('');

  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      console.log("Fetching Course");
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${BASE_URL}/Course/list`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const courseData = await response.json();
          const translatedCourses = await fetchCourseTranslations(courseData.data);
          setCourses(translatedCourses);
        } else {
          console.error('Failed to fetch courses:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    const fetchCourseTranslations = async (courses) => {
      const token = localStorage.getItem('token');
      const languageCode = selectedLanguage;
      console.log("CourseTrans: "+ languageCode);
      const translatedCourses = await Promise.all(courses.map(async (course) => {
        const response = await fetch(`${BASE_URL}/Course/${course.id}/translations/${languageCode}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const translations = await response.json();
          console.log("Course Translation: " + JSON.stringify(translations, null, 2));
          return { ...course, name: translations[0]?.name || course.name };
        } else {
          return course;
        }
      }));
      return translatedCourses;
    };

    fetchCourses();
  }, [BASE_URL, selectedLanguage]);

  const fetchLessons = async (courseId) => {
    console.log("Fetching lesson: " + courseId);
    try {
      const token = localStorage.getItem('token');
      const languageCode = selectedLanguage;
      const response = await fetch(`${BASE_URL}/Lesson/${courseId}/lessons/${languageCode}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const lessonData = await response.json();
        setLessons(lessonData);
      } else {
        console.error('Failed to fetch lessons:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching lessons:', error);
    }
  };

  const handleCourseChange = (e) => {
    const selectedCourseId = e.target.value;
    setCourseId(selectedCourseId);
    fetchLessons(selectedCourseId);
  };

  const handleLessonChange = (e) => {
    setLessonId(e.target.value);
  };

  const handleTitleChange = e => {
    setExamTitle(e.target.value);
  };

  const handleQuestionContentChange = (e, index) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].explanation = e.target.value;
    setQuestions(updatedQuestions);
  };

  const handleQuestionTypeChange = (e, index) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].isSingleChoice = e.target.value === "true";
    setQuestions(updatedQuestions);
  };

  const handleAnswerContentChange = (e, questionIndex, answerIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].answers[answerIndex].name = e.target.value;
    setQuestions(updatedQuestions);
  };

  const handleCorrectAnswerChange = (questionIndex, answerIndex) => {
    const updatedQuestions = [...questions];
    const currentQuestion = updatedQuestions[questionIndex];
    const currentAnswer = currentQuestion.answers[answerIndex];

    if (currentQuestion.isSingleChoice) {
      currentQuestion.answers.forEach((answer, idx) => {
        answer.correct = idx === answerIndex;
      });
    } else {
      currentAnswer.correct = !currentAnswer.correct;
    }

    setQuestions(updatedQuestions);
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { 
        explanation: '', 
        type: 'single', 
        isSingleChoice: true,
        answers: [{ name: '', correct: false }] 
      }
    ]);
  };

  const handleAddAnswer = (questionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].answers = [
      ...updatedQuestions[questionIndex].answers,
      { name: '', correct: false }
    ];
    setQuestions(updatedQuestions);
  };

  const handleRemoveQuestion = (questionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions.splice(questionIndex, 1);
    setQuestions(updatedQuestions);
  };

  const handleRemoveAnswer = (questionIndex, answerIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].answers.splice(answerIndex, 1);
    setQuestions(updatedQuestions);
  };

  const handleSaveExam = async () => {
    try {
      const token = localStorage.getItem('token');
      const decodedToken = jwtDecode(token);
      const { nameid: userId } = decodedToken;

      const apiUrl = `${BASE_URL}/Exam/create`;

      const requestBody = {
        lessonId: lessonId,
        title: examTitle,
        status: 1,
        isAutoGrade: true,
        createdByUserId: userId,
        modifiedByUserId: userId,
        questions: questions.map((question, index) => ({
          explanation: question.explanation,
          sortOrder: index,
          isSingleChoice: question.isSingleChoice,
          answers: question.answers.map((answer, index) => ({
            name: answer.name,
            correct: answer.correct,
            sortOrder: index
          }))
        }))
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

        const exam = await response.json();
        toast.success('Exam saved successfully');
        setSaveSuccess(true);

        navigate("/exam-list");
    } catch (error) {
      toast.error('Error saving exam:', error);
    }
  };

  return (
    <div className="site-section">
      <ToastContainer />
      <div className="container">
        <h2 className="mb-3">{t('CreateExam')}</h2>
        <div className="mb-3">
          <label htmlFor="courseSelect" className="form-label">{t('Course')}</label>
          <select
            id="courseSelect"
            className="form-select"
            value={courseId}
            onChange={handleCourseChange}
          >
            <option value="">{t('SelectCourse')}</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="lessonSelect" className="form-label">{t('Lesson')}</label>
          <select
            id="lessonSelect"
            className="form-select"
            value={lessonId}
            onChange={handleLessonChange}
          >
            <option value="">{t('SelectLesson')}</option>
            {lessons.map((lesson) => (
              <option key={lesson.id} value={lesson.id}>
                {lesson.title}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="examTitle" className="form-label">{t('ExamTitle')}</label>
          <input
            type="text"
            className="form-control"
            id="examTitle"
            value={examTitle}
            onChange={handleTitleChange}
          />
        </div>
        {questions.map((question, questionIndex) => (
          <div key={questionIndex} className="card mb-3">
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">{t('QuestionContent')}</label>
                <textarea className="form-control" value={question.explanation} onChange={(e) => handleQuestionContentChange(e, questionIndex)} />
              </div>
              <div className="mb-3">
                <label className="form-label">{t('QuestionType')}</label>
                <select className="form-select" value={question.isSingleChoice.toString()} onChange={(e) => handleQuestionTypeChange(e, questionIndex)}>
                  <option value="true">{t('SingleChoice')}</option>
                  <option value="false">{t('MultipleChoices')}</option>
                </select>
              </div>
              <button className="btn btn-sm btn-outline-primary mb-2 me-2" onClick={() => handleAddAnswer(questionIndex)}>{t('AddAnswer')}</button>
              {question.answers.map((answer, answerIndex) => (
                <div className="input-group mb-2" key={answerIndex}>
                  <input type="text" className="form-control" placeholder={t('EnterAnswer')} value={answer.name} onChange={(e) => handleAnswerContentChange(e, questionIndex, answerIndex)} />
                  <div className="input-group-text">
                    <input type={question.isSingleChoice ? 'radio' : 'checkbox'} checked={answer.correct} onChange={() => handleCorrectAnswerChange(questionIndex, answerIndex)} />
                  </div>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleRemoveAnswer(questionIndex, answerIndex)}>{t('RemoveAnswer')}</button>
                </div>
              ))}
              <button className="btn btn-sm btn-outline-danger me-2" onClick={() => handleRemoveQuestion(questionIndex)}>{t('RemoveQuestion')}</button>
            </div>
          </div>
        ))}
        <button className="btn btn-sm btn-outline-success mb-3 me-2" onClick={handleAddQuestion}>{t('AddQuestion')}</button>
        <button className="btn btn-sm btn-primary mb-3 me-2" onClick={handleSaveExam}>{t('SaveExam')}</button>
        <Link className="btn btn-sm btn-outline-secondary mb-3 me-2" to="/admin-exams" style={{ verticalAlign: 'middle' }}>{t('Back')}</Link>
      </div>
    </div>
  );
}

export default AdminExamCreate;