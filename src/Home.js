import React, {useEffect} from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from './LanguageProvider'; 
import { Link } from 'react-router-dom';

function Home(){

  const { t } = useTranslation();
  const { selectedLanguage } = useLanguage();

  useEffect(() => {
    console.log("Home: Selected language changed to:", selectedLanguage);
  }, [selectedLanguage]);

    return (
        <div>
        <div className="hero-slide owl-carousel site-blocks-cover">
        <div className="intro-section" style={{backgroundImage: "url('images/hero_1.jpg')"}}>
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-12 mx-auto text-center" data-aos="fade-up">
                <h1>{t('AcademicsUniversity')}</h1>
              </div>
            </div>
          </div>
        </div>
  
        <div className="intro-section" style={{backgroundImage: "url('images/hero_1.jpg')"}}>
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-12 mx-auto text-center" data-aos="fade-up">
                <h1>{t('YouCanLearnAnything')}</h1>
              </div>
            </div>
          </div>
        </div>
  
      </div>
      
  
      <div></div>
  
      <div className="site-section">
        <div className="container">
          <div className="row mb-5 justify-content-center text-center">
            <div className="col-lg-4 mb-5">
              <h2 className="section-title-underline mb-5">
                <span>{t('WhyAcademicsWorks')}</span>
              </h2>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-4 col-md-6 mb-4 mb-lg-0">
  
              <div className="feature-1 border">
                <div className="icon-wrapper bg-primary">
                  <span className="flaticon-mortarboard text-white"></span>
                </div>
                <div className="feature-1-content">
                  <h2>{t('PersonalizeLearning')}</h2>
                  <p><a href="#" className="btn btn-primary px-4 rounded-0">{t('LearnMore')}</a></p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 mb-4 mb-lg-0">
              <div className="feature-1 border">
                <div className="icon-wrapper bg-primary">
                  <span className="flaticon-school-material text-white"></span>
                </div>
                <div className="feature-1-content">
                  <h2>{t('TrustedCourses')}</h2>
                  <p><Link to='/course-list' className="btn btn-primary px-4 rounded-0">{t('LearnMore')}</Link></p>
                </div>
              </div> 
            </div>
            <div className="col-lg-4 col-md-6 mb-4 mb-lg-0">
              <div className="feature-1 border">
                <div className="icon-wrapper bg-primary">
                  <span className="flaticon-library text-white"></span>
                </div>
                <div className="feature-1-content">
                  <h2>{t('ToolsforStudents')}</h2>
                  <p><a href="#" className="btn btn-primary px-4 rounded-0">{t('LearnMore')}</a></p>
                </div>
              </div> 
            </div>
          </div>
        </div>
      </div>
  
  
      <div className="site-section">
        <div className="container">
  
  
          <div className="row mb-5 justify-content-center text-center">
            <div className="col-lg-6 mb-5">
              <h2 className="section-title-underline mb-3">
                <span>{t('PopularCourses')}</span>
              </h2>
            </div>
          </div>
  
          <div className="row">
            <div className="col-12">
                <div className="owl-slide-3 owl-carousel">
                    <div className="course-1-item">
                      <figure className="thumnail">
                        <a href="course-single.html"><img src="images/course_1.jpg" alt="Image" className="img-fluid"/></a>
                        <div className="price">$99.00</div>
                        <div className="category"><h3>{t('MobileApplication')}</h3></div>  
                      </figure>
                      <div className="course-1-content pb-4">
                        <h2>{t('HowToCreateMobileAppsUsingIonic')}</h2>
                        <div className="rating text-center mb-3">
                          <span className="icon-star2 text-warning"></span>
                          <span className="icon-star2 text-warning"></span>
                          <span className="icon-star2 text-warning"></span>
                          <span className="icon-star2 text-warning"></span>
                          <span className="icon-star2 text-warning"></span>
                        </div>
                        <p><a href="course-single.html" className="btn btn-primary rounded-0 px-4">{t('EnrollInThisCourse')}</a></p>
                      </div>
                    </div>
        
                    <div className="course-1-item">
                      <figure className="thumnail">
                        <a href="course-single.html"><img src="images/course_2.jpg" alt="Image" className="img-fluid"/></a>
                        <div className="price">$99.00</div>
                        <div className="category"><h3>{t('WebDesign')}</h3></div>  
                      </figure>
                      <div className="course-1-content pb-4">
                        <h2>{t('HowToCreateMobileAppsUsingIonic')}</h2>
                        <div className="rating text-center mb-3">
                          <span className="icon-star2 text-warning"></span>
                          <span className="icon-star2 text-warning"></span>
                          <span className="icon-star2 text-warning"></span>
                          <span className="icon-star2 text-warning"></span>
                          <span className="icon-star2 text-warning"></span>
                        </div>
                        <p><a href="course-single.html" className="btn btn-primary rounded-0 px-4">{t('EnrollInThisCourse')}</a></p>
                      </div>
                    </div>
        
                    <div className="course-1-item">
                      <figure className="thumnail">
                        <a href="course-single.html"><img src="images/course_3.jpg" alt="Image" className="img-fluid"/></a>
                        <div className="price">$99.00</div>
                        <div className="category"><h3>{t('Arithmetic')}</h3></div>  
                      </figure>
                      <div className="course-1-content pb-4">
                        <h2>{t('HowToCreateMobileAppsUsingIonic')}</h2>
                        <div className="rating text-center mb-3">
                          <span className="icon-star2 text-warning"></span>
                          <span className="icon-star2 text-warning"></span>
                          <span className="icon-star2 text-warning"></span>
                          <span className="icon-star2 text-warning"></span>
                          <span className="icon-star2 text-warning"></span>
                        </div>
                        <p><a href="courses-single.html" className="btn btn-primary rounded-0 px-4">{t('EnrollInThisCourse')}</a></p>
                      </div>
                    </div>
  
                    <div className="course-1-item">
                      <figure className="thumnail">
                          <a href="course-single.html"><img src="images/course_4.jpg" alt="Image" className="img-fluid"/></a>
                        <div className="price">$99.00</div>
                        <div className="category"><h3>{t('MobileApplication')}</h3></div>  
                      </figure>
                      <div className="course-1-content pb-4">
                        <h2>{t('HowToCreateMobileAppsUsingIonic')}</h2>
                        <div className="rating text-center mb-3">
                          <span className="icon-star2 text-warning"></span>
                          <span className="icon-star2 text-warning"></span>
                          <span className="icon-star2 text-warning"></span>
                          <span className="icon-star2 text-warning"></span>
                          <span className="icon-star2 text-warning"></span>
                        </div>
                        <p><a href="course-single.html" className="btn btn-primary rounded-0 px-4">{t('EnrollInThisCourse')}</a></p>
                      </div>
                    </div>
        
                    <div className="course-1-item">
                      <figure className="thumnail">
                          <a href="course-single.html"><img src="images/course_5.jpg" alt="Image" className="img-fluid"/></a>
                        <div className="price">$99.00</div>
                        <div className="category"><h3>{t('WebDesign')}</h3></div>  
                      </figure>
                      <div className="course-1-content pb-4">
                        <h2>{t('HowToCreateMobileAppsUsingIonic')}</h2>
                        <div className="rating text-center mb-3">
                          <span className="icon-star2 text-warning"></span>
                          <span className="icon-star2 text-warning"></span>
                          <span className="icon-star2 text-warning"></span>
                          <span className="icon-star2 text-warning"></span>
                          <span className="icon-star2 text-warning"></span>
                        </div>
                        <p><a href="course-single.html" className="btn btn-primary rounded-0 px-4">{t('EnrollInThisCourse')}</a></p>
                      </div>
                    </div>
        
                    <div className="course-1-item">
                      <figure className="thumnail">
                          <a href="course-single.html"><img src="images/course_6.jpg" alt="Image" className="img-fluid"/></a>
                        <div className="price">$99.00</div>
                        <div className="category"><h3>{t('MobileApplication')}</h3></div>  
                      </figure>
                      <div className="course-1-content pb-4">
                        <h2>{t('HowToCreateMobileAppsUsingIonic')}</h2>
                        <div className="rating text-center mb-3">
                          <span className="icon-star2 text-warning"></span>
                          <span className="icon-star2 text-warning"></span>
                          <span className="icon-star2 text-warning"></span>
                          <span className="icon-star2 text-warning"></span>
                          <span className="icon-star2 text-warning"></span>
                        </div>
                        <p><a href="course-single.html" className="btn btn-primary rounded-0 px-4">{t('EnrollInThisCourse')}</a></p>
                      </div>
                    </div>
        
                </div>
        
            </div>
          </div>
  
          
          
        </div>
      </div>
  
      
  
  
      <div className="section-bg style-1" style={{backgroundImage: "url('images/about_1.jpg')"}}>
        <div className="container">
          <div className="row">
            <div className="col-lg-4">
              <h2 className="section-title-underline style-2">
                <span>{t('AboutOurUniversity')}</span>
              </h2>
            </div>
            <div className="col-lg-8">
            
              <p><a href="#">{t('Readmore')}</a></p>
            </div>
          </div>
        </div>
      </div>
      
    <div className="site-section">
        <div className="container">
          <div className="row mb-5">
            <div className="col-lg-4">
              <h2 className="section-title-underline">
                <span>{t('Testimonials')}</span>
              </h2>
            </div>
          </div>
  
  
          <div className="owl-slide owl-carousel">
  
            <div className="ftco-testimonial-1">
              <div className="ftco-testimonial-vcard d-flex align-items-center mb-4">
                <img src="images/person_1.jpg" alt="Image" className="img-fluid mr-3"/>
                <div>
                  <h3>{t('AllisonHolmes')}</h3>
                  <span>{t('Designer')}</span>
                </div>
              </div>
            </div>
  
            <div className="ftco-testimonial-1">
              <div className="ftco-testimonial-vcard d-flex align-items-center mb-4">
                <img src="images/person_2.jpg" alt="Image" className="img-fluid mr-3"/>
                <div>
                  <h3>{t('AllisonHolmes')}</h3>
                  <span>{t('Designer')}</span>
                </div>
              </div>
            </div>
  
            <div className="ftco-testimonial-1">
              <div className="ftco-testimonial-vcard d-flex align-items-center mb-4">
                <img src="images/person_4.jpg" alt="Image" className="img-fluid mr-3"/>
                <div>
                  <h3>{t('AllisonHolmes')}</h3>
                  <span>{t('Designer')}</span>
                </div>
              </div>
            </div>
  
            <div className="ftco-testimonial-1">
              <div className="ftco-testimonial-vcard d-flex align-items-center mb-4">
                <img src="images/person_3.jpg" alt="Image" className="img-fluid mr-3"/>
                <div>
                  <h3>{t('AllisonHolmes')}</h3>
                  <span>{t('Designer')}</span>
                </div>
              </div>
            </div>
  
            <div className="ftco-testimonial-1">
              <div className="ftco-testimonial-vcard d-flex align-items-center mb-4">
                <img src="images/person_2.jpg" alt="Image" className="img-fluid mr-3"/>
                <div>
                  <h3>{t('AllisonHolmes')}</h3>
                  <span>{t('Designer')}</span>
                </div>
              </div>
            </div>
  
            <div className="ftco-testimonial-1">
              <div className="ftco-testimonial-vcard d-flex align-items-center mb-4">
                <img src="images/person_4.jpg" alt="Image" className="img-fluid mr-3"/>
                <div>
                  <h3>{t('AllisonHolmes')}</h3>
                  <span>{t('Designer')}</span>
                </div>
              </div>
            </div>
  
          </div>
          
        </div>
      </div>
      
  
      <div className="section-bg style-1" style={{backgroundImage: "url('images/hero_1.jpg')"}}>
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-md-6 mb-5 mb-lg-0">
              <span className="icon flaticon-mortarboard"></span>
              <h3>{t('OurPhilosphy')}</h3>
            </div>
            <div className="col-lg-4 col-md-6 mb-5 mb-lg-0">
              <span className="icon flaticon-school-material"></span>
              <h3>{t('AcademicsPrinciple')}</h3>
            </div>
            <div className="col-lg-4 col-md-6 mb-5 mb-lg-0">
              <span className="icon flaticon-library"></span>
              <h3>{t('KeyofSuccess')}</h3>
            </div>
          </div>
        </div>
      </div>
      
      <div className="news-updates">
        <div className="container">
           
          <div className="row">
            <div className="col-lg-9">
               <div className="section-heading">
                <h2 className="text-black">{t('News')} &amp; {t('Updates')}</h2>
                <a href="#">{t('ReadAllNews')}</a>
              </div>
              <div className="row">
                <div className="col-lg-6">
                  <div className="post-entry-big">
                    <a href="news-single.html" className="img-link"><img src="images/blog_large_1.jpg" alt="Image" className="img-fluid"/></a>
                    <div className="post-content">
                      <div className="post-meta"> 
                        <a href="#">{t('June62019')}</a>
                        <span className="mx-1">/</span>
                        <a href="#">{t('Admission')}</a>, <a href="#">{t('Updates')}</a>
                      </div>
                      <h3 className="post-heading"><a href="news-single.html">{t('CampusCampingandLearningSession')}</a></h3>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="post-entry-big horizontal d-flex mb-4">
                    <a href="news-single.html" className="img-link mr-4"><img src="images/blog_1.jpg" alt="Image" className="img-fluid"/></a>
                    <div className="post-content">
                      <div className="post-meta">
                        <a href="#">{t('June62019')}</a>
                        <span className="mx-1">/</span>
                        <a href="#">{t('Admission')}</a>, <a href="#">{t('Updates')}</a>
                      </div>
                      <h3 className="post-heading"><a href="news-single.html">{t('CampusCampingandLearningSession')}</a></h3>
                    </div>
                  </div>
  
                  <div className="post-entry-big horizontal d-flex mb-4">
                    <a href="news-single.html" className="img-link mr-4"><img src="images/blog_2.jpg" alt="Image" className="img-fluid"/></a>
                    <div className="post-content">
                    <div className="post-meta">
                        <a href="#">{t('June62019')}</a>
                        <span className="mx-1">/</span>
                        <a href="#">{t('Admission')}</a>, <a href="#">{t('Updates')}</a>
                      </div>
                      <h3 className="post-heading"><a href="news-single.html">{t('CampusCampingandLearningSession')}</a></h3>
                    </div>
                  </div>
  
                  <div className="post-entry-big horizontal d-flex mb-4">
                    <a href="news-single.html" className="img-link mr-4"><img src="images/blog_1.jpg" alt="Image" className="img-fluid"/></a>
                    <div className="post-content">
                    <div className="post-meta">
                        <a href="#">{t('June62019')}</a>
                        <span className="mx-1">/</span>
                        <a href="#">{t('Admission')}</a>, <a href="#">{t('Updates')}</a>
                      </div>
                      <h3 className="post-heading"><a href="news-single.html">{t('CampusCampingandLearningSession')}</a></h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="section-heading">
                <h2 className="text-black">{t('CampusVideos')}</h2>
                <a href="#">{t('ViewAllVideos')}</a>
              </div>
              <a href="https://vimeo.com/45830194" className="video-1 mb-4" data-fancybox="" data-ratio="2">
                <span className="play">
                  <span className="icon-play"></span>
                </span>
                <img src="images/course_5.jpg" alt="Image" className="img-fluid"/>
              </a>
              <a href="https://vimeo.com/45830194" className="video-1 mb-4" data-fancybox="" data-ratio="2">
                  <span className="play">
                    <span className="icon-play"></span>
                  </span>
                  <img src="images/course_5.jpg" alt="Image" className="img-fluid"/>
                </a>
            </div>
          </div>
        </div>
      </div>
  
      <div className="site-section ftco-subscribe-1" style={{backgroundImage: "url('images/bg_1.jpg')"}}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-7">
              <h2>{t('Subscribetous!')}</h2>
            </div>
            <div className="col-lg-5">
              <form action="" className="d-flex">
                <input type="text" className="rounded form-control mr-2 py-3" placeholder="Enter your email"/>
                <button className="btn btn-primary rounded py-3 px-4" type="submit">{t('Send!')}</button>
              </form>
            </div>
          </div>
        </div>
      </div> 
        </div>
    );
}

export default Home;