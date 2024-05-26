import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Import jwt_decode

import { useTranslation } from 'react-i18next';
import { useLanguage } from './LanguageProvider'; 

function AdminExamCreate() {
  const { t } = useTranslation();
  const { selectedLanguage } = useLanguage();

  useEffect(() => {
  }, [selectedLanguage]);

  const [lessonId, setLessonId] = useState('');
  const [examTitle, setExamTitle] = useState('');
  const [questions, setQuestions] = useState([
    { content: '', type: 'single', isSingleChoice: true, answers: [{ content: '', correct: false }] }
  ]);

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [languageList, setLanguageList] = useState([]);
  const [selectedLanguageCode, setSelectedLanguageCode] = useState(''); // Add selected language state

  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLanguageList = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${BASE_URL}/Language/list`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const languageData = await response.json();
          setLanguageList(languageData);
        } else {
          console.error('Failed to fetch language list:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching language list:', error);
      }
    };

    fetchLanguageList();
  }, [BASE_URL]);

  const handleLessonIdChange = e => {
    setLessonId(e.target.value);
  };
  
  const handleTitleChange = e => {
    setExamTitle(e.target.value);
  };

  const handleQuestionContentChange = (e, index) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].explanation  = e.target.value;
    setQuestions(updatedQuestions);
  };

  const handleQuestionTypeChange = (e, index) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].isSingleChoice = e.target.value === "true" ? true : false; // Assign boolean value
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

    if (currentQuestion.isSingleChoice.toString() === 'true') {
      // For single-choice questions, toggle the correctness of the clicked answer
      updatedQuestions[questionIndex].answers.forEach((answer, idx) => {
        answer.correct = idx === answerIndex;
      });
    } else if (currentQuestion.isSingleChoice.toString() === 'false') {
      // For multiple-choice questions, toggle the correctness of the clicked answer independently
      updatedQuestions[questionIndex].answers[answerIndex].correct = !currentAnswer.correct;
    }

    setQuestions(updatedQuestions);
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { 
        content: '', 
        explanation: '', // Initialize explanation property as well
        type: 'single', 
        isSingleChoice: true, // Initialize isSingleChoice property
        answers: [{ content: '', correct: false }] 
      }
    ]);
  };

  const handleAddAnswer = (questionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].answers = [
      ...updatedQuestions[questionIndex].answers,
      { content: '', isCorrect: false }
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
      const decodedToken = jwtDecode(token); // Decode the token
      console.log(decodedToken);
      const { nameid: userId } = decodedToken;
      console.log(userId);
      
      const apiUrl = `${BASE_URL}/Exam/create`;
      
      // Format the exam data according to the CreateOrUpdateExamRequest model
      const requestBody = {
        lessonId: lessonId,
        title: examTitle,
        status: 1,
        isAutoGrade: true,
        createdByUserId: userId,
        modifiedByUserId: userId,
        questions: questions.map((question, index) => ({
          explanation: question.explanation,
          sortOrder: index, // Assuming you want to maintain the order of questions
          isSingleChoice: question.isSingleChoice || false,
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

      if (response.ok) {
        const exam = await response.json();
        alert('Exam saved successfully');
        setSaveSuccess(true);

        // Call function to save translations after saving the exam
        await saveTranslations(exam.questions);

        navigate("/exam-list");
      } else {
        console.error('Failed to save exam:', response.statusText);
      }
    } catch (error) {
      console.error('Error saving exam:', error);
    }
  };

  const saveTranslations = async (savedQuestions) => {
    try {
      const token = localStorage.getItem('token');

      for (const question of savedQuestions) {
        const questionId = question.id;
        for (const lang of languageList) {
          const translationUrl = `${BASE_URL}/questions/${questionId}/translations`;
          const translationBody = {
            languageCode: lang.code,
            content: question.explanation // Adjust if necessary
          };

          await fetch(translationUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(translationBody),
          });

          for (const answer of question.answers) {
            const answerId = answer.id;
            const answerTranslationUrl = `${BASE_URL}/answers/${answerId}/translations`;
            const answerTranslationBody = {
              languageCode: lang.code,
              content: answer.name // Adjust if necessary
            };

            await fetch(answerTranslationUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(answerTranslationBody),
            });
          }
        }
      }
    } catch (error) {
      console.error('Error saving translations:', error);
    }
  };

  const handleAddQuestionTranslation = async (questionIndex) => {
    const question = questions[questionIndex];
    try {
      const token = localStorage.getItem('token');
      const apiUrl = `${BASE_URL}/Question/${question.id}/translations`; // Assuming `question.id` is the correct identifier
  
      const requestBody = {
        languageCode: selectedLanguageCode,
        content: question.explanation,
      };
  
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });
  
      if (response.ok) {
        alert('Question translation saved successfully');
      } else {
        console.error('Failed to save question translation:', response.statusText);
      }
    } catch (error) {
      console.error('Error saving question translation:', error);
    }
  };
  

  const handleAddAnswerTranslation = async (questionIndex, answerIndex) => {
    const answer = questions[questionIndex].answers[answerIndex];
    try {
      const token = localStorage.getItem('token');
      const apiUrl = `${BASE_URL}/Answer/${answer.id}/translations`; // Assuming `answer.id` is the correct identifier
  
      const requestBody = {
        languageCode: selectedLanguageCode,
        name: answer.name,
      };
  
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });
  
      if (response.ok) {
        alert('Answer translation saved successfully');
      } else {
        console.error('Failed to save answer translation:', response.statusText);
      }
    } catch (error) {
      console.error('Error saving answer translation:', error);
    }
  };

  return (
    <div className="site-section">
      <div className="container">
        <h2>{t('EditExam')}</h2>
        {saveSuccess && (
          <div className="alert alert-success" role="alert">
            {t('Examsavedsuccessfully!')}
          </div>
        )}
        <div className="mb-3">
          <label className="form-label">{t('LessonId!')}{t('(Optional)')}:</label>
          <input type="text" className="form-control" placeholder="Enter lesson id here" value={lessonId} onChange={handleLessonIdChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">{t('Title!')}:</label>
          <input type="text" className="form-control" placeholder="Enter exam title here" value={examTitle} onChange={handleTitleChange} />
        </div>
        {questions.map((question, questionIndex) => (
          <div className="card mb-3" key={questionIndex}>
            <div className="card-body">
              <label className="form-label">{t('Question')}:</label>
              <input type="text" className="form-control mb-2" placeholder="Enter question here" value={question.explanation} onChange={(e) => handleQuestionContentChange(e, questionIndex)} />
              <select className="form-select mb-2" value={question.isSingleChoice.toString()} onChange={(e) => handleQuestionTypeChange(e, questionIndex)}>
                <option value="true">{t('SingleChoice')}</option>
                <option value="false">{t('MultipleChoices')}</option>
              </select>
              <button className="btn btn-sm btn-outline-primary mb-2 me-2" onClick={() => handleAddAnswer(questionIndex)}>{t('AddAnswer')}</button>
              {question.answers.map((answer, answerIndex) => (
                <div className="input-group mb-2" key={answerIndex}>
                  <input type="text" className="form-control" placeholder="Enter answer here" value={answer.name} onChange={(e) => handleAnswerContentChange(e, questionIndex, answerIndex)} />
                  <div className="input-group-text">
                    <input type={question.isSingleChoice ? 'radio' : 'checkbox'} checked={answer.correct} onChange={() => handleCorrectAnswerChange(questionIndex, answerIndex)} />
                  </div>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleRemoveAnswer(questionIndex, answerIndex)}>{t('RemoveAnswer')}</button>
                </div>
              ))}
              <button className="btn btn-sm btn-outline-danger me-2" onClick={() => handleRemoveQuestion(questionIndex)}>{t('RemoveQuestion')}</button>
              {/* Add Translation Section for Answer */}
                <div className="mb-3">
                <label className="form-label">{t('AnswerTranslation')}:</label>
                <select className="form-select custom-select mb-2" id="inputLanguageCode" name="languageCode" value={selectedLanguageCode} onChange={(e) => setSelectedLanguageCode(e.target.value)}>
                    <option value="">{t('SelectLanguage')}</option>
                    {languageList.map(language => (
                    <option key={language.code} value={language.code}>{language.name}</option>
                    ))}
                </select>
                {question.answers.map((answer, answerIndex) => (
                    <div key={answerIndex}>
                    <button className="btn btn-sm btn-outline-secondary mb-2" onClick={() => handleAddAnswerTranslation(questionIndex, answerIndex)}>{t('AddAnswerTranslation')}</button>
                    </div>
                ))}
                </div>
              {/* Add Translation Section for Question */}
              <div className="mb-3">
                <label className="form-label">{t('QuestionTranslation')}:</label>
                <select className="form-select custom-select mb-2" id="inputLanguageCode" name="languageCode" value={selectedLanguageCode} onChange={(e) => setSelectedLanguageCode(e.target.value)}>
                  <option value="">{t('SelectLanguage')}</option>
                  {languageList.map(language => (
                    <option key={language.code} value={language.code}>{language.name}</option>
                  ))}
                </select>
                <button className="btn btn-sm btn-outline-secondary mb-2" onClick={() => handleAddQuestionTranslation(questionIndex)}>{t('AddQuestionTranslation')}</button>
              </div>
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