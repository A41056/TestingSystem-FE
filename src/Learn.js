import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from './LanguageProvider'; 

function Learn() {
  const { t } = useTranslation();
  const { selectedLanguage } = useLanguage();
  const { courseId } = useParams();
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [token, setToken] = useState('');

  console.log("Learn: " + selectedLanguage);
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    fetchLessons();
  }, [courseId, token]); 

  useEffect(() => {
    if (selectedLesson) {
      fetchLessonVideo(selectedLesson);
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
          </div>
          <div className="col-lg-4">
            <h2>{t('Lessons')}</h2>
            <ul className="list-group">
              {lessons.map((lesson) => (
                <li key={lesson.id} className="list-group-item" onClick={() => handleLessonSelect(lesson)}>
                  {lesson.translatedTitle || lesson.title}
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