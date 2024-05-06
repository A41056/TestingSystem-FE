import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Import jwt_decode
import { useTranslation } from 'react-i18next';
import { useLanguage } from './LanguageProvider'; 

function AdminExamEdit() {
  const { t } = useTranslation();
  const { selectedLanguage } = useLanguage();

  useEffect(() => {
  }, [selectedLanguage]);
    const [examTitle, setExamTitle] = useState('');
    const [questions, setQuestions] = useState([]);
    const { examId } = useParams();
    const BASE_URL = process.env.REACT_APP_ADMIN_BASE_URL;

    useEffect(() => {
        const fetchExamDetail = async () => {
            try {
                const token = localStorage.getItem('token');
                
                const apiUrl = `${BASE_URL}/Exam/detail/${examId}`;
                
                const response = await fetch(apiUrl, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const examData = await response.json();

                    setExamTitle(examData.title);
                    setQuestions(examData.questions);
                } else {
                    console.error('Failed to fetch exam detail:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching exam detail:', error);
            }
        };

        fetchExamDetail();
    }, [examId]);

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
        setQuestions([...questions, { content: '', type: 'single', answers: [{ content: '', correct: false }] }]);
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
            const { nameid: userId} = decodedToken;
            console.log(userId);
            
            const apiUrl = `${BASE_URL}/Exam/update`;
            
            // Format the exam data according to the CreateOrUpdateExamRequest model
            const requestBody = {
                examId: examId,
                title: examTitle,
                status: 1,
                isAutoGrade: true,
                modifiedByUserId: userId,
                questions: questions.map((question, index) => ({
                    id: question.id,
                    explanation: question.explanation,
                    sortOrder: index, // Assuming you want to maintain the order of questions
                    isSingleChoice: question.isSingleChoice || false, // Ensure it's null if not specified
                    answers: question.answers.map((answer,index) => ({
                        id: answer.id,
                        name: answer.name,
                        correct: answer.correct,
                        sortOrder: index
                    }))
                }))
            };
    
            const response = await fetch(apiUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(requestBody),
            });
    
            if (response.ok) {
                const exam = await response.json();
                console.log('Exam updated successfully:', exam);
                alert('Exam updated successfully');
                // Handle success, maybe redirect or show a success message
            } else {
                console.error('Failed to update exam:', response.statusText);
                // Handle error, maybe show an error message to the user
            }
        } catch (error) {
            console.error('Error updating exam:', error);
            // Handle error, maybe show an error message to the user
        }
    };

    return (
        <div className="site-section">
             <div className="container">
            <h2>{t('EditExam')}</h2>
            <div className="mb-3">
                <label className="form-label">{t('Title')}:</label>
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

export default AdminExamEdit;