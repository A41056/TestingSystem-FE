import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { jwtDecode } from 'jwt-decode'; // Import jwt_decode
import { useLanguage } from './LanguageProvider'; 

function Learn() {
  const { t } = useTranslation();
  const { selectedLanguage } = useLanguage();
  const { courseId } = useParams();
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [exam, setExam] = useState(null);
  const [token, setToken] = useState('');
  const [userId, setUserId] = useState('');

  console.log("Learn: " + selectedLanguage);
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    console.log(storedToken);
    if (storedToken) {
      setToken(storedToken);
      const decodedToken = jwtDecode(storedToken); // Decode the token
      const {nameid: userId} = decodedToken;
      setUserId(userId);
      console.log(userId);
    }
  }, []);

  useEffect(() => {
    fetchLessons();
  }, [courseId, token, selectedLanguage]); 

  useEffect(() => {
    if (selectedLesson) {
      fetchLessonVideo(selectedLesson);
      fetchExam(selectedLesson.id);
    }
  }, [selectedLesson]); 

  const fetchLessons = async () => {
    if (!token) return; 

    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/lesson/${courseId}/lessons/${selectedLanguage}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const sortedLessons = data.sort((a, b) => a.sortOrder - b.sortOrder);
        setLessons(sortedLessons);
      } else {
        console.error('Failed to fetch lessons:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching lessons:', error);
    }
  };

  const fetchExam = async () => {
    if (!token) return; 

    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/exam/lesson/${selectedLesson.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Fetch Exam");
      if (response.ok) {
        const data = await response.json();
        setExam(data);
      } else {
        setExam(null);
        console.error('Failed to fetch exam:', response.statusText);
      }
    } catch (error) {
      setExam(null);
      console.error('Error fetching exam:', error);
    }
  };

  const fetchLessonVideo = (lesson) => {
    const videoId = getVideoIdFromUrl(lesson.videoUrl);
    const videoUrl = `https://www.youtube.com/embed/${videoId}`;
    const iframe = `<iframe 
                      width="100%" 
                      height="500" 
                      src="${videoUrl}" 
                      title="YouTube video player" 
                      frameborder="0" 
                      allow="accelerometer; 
                      autoplay; 
                      clipboard-write; 
                      encrypted-media; 
                      gyroscope; 
                      picture-in-picture" 
                      allowfullscreen>
                    </iframe>`;
    document.getElementById('video-container').innerHTML = iframe;
  };
  
  const getVideoIdFromUrl = (url) => {
    // Extract video ID from the YouTube URL
    const parts = url.split('/');
    return parts[parts.length - 1];
  };
  
  const handleLessonSelect = (lesson) => {
    setSelectedLesson(lesson);
  };

  return (
    <div className="site-section">
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-8">
            {/* Video iframe */}
            <div id="video-container"></div>
            {exam && (
              <div className="mt-3">
                <Link to={`/do-exam/${exam.examId}`} className="btn btn-primary">
                  {t('Take Exam')}
                </Link>
              </div>
            )}
          </div>

          <div className="col-lg-4">
            <h2>{t('Lessons')}</h2>
            <ul className="list-group">
              {lessons.map((lesson) => (
                <li key={lesson.id} className="list-group-item" onClick={() => handleLessonSelect(lesson)}>
                  {lesson.translatedTitle || lesson.title}
                  <p>{lesson.content}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Learn;