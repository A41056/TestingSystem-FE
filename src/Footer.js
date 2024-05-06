import React, {useEffect} from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from './LanguageProvider'; 

function Footer(){

  const { t } = useTranslation();
  const { selectedLanguage } = useLanguage();

  useEffect(() => {
  }, [selectedLanguage]);

  return (
    <div className="footer">
      <div className="container">
        <div className="row">
          <div className="col-lg-3">
            <p className="mb-4"><img src="images/logo.png" alt="Image" className="img-fluid" /></p>
            <p>{t('FooterParam')}Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae nemo minima qui dolor, iusto iure.</p>  
            <p><a href="#">{t('LearnMore')}</a></p>
          </div>
          <div className="col-lg-3">
            <h3 className="footer-heading"><span>{t('OurCampus')}</span></h3>
            <ul className="list-unstyled">
                <li><a href="#">{t('Acedemic')}</a></li>
                <li><a href="#">{t('News')}</a></li>
                <li><a href="#">{t('OurInterns')}</a></li>
                <li><a href="#">{t('OurLeadership')}</a></li>
                <li><a href="#">{t('Careers')}</a></li>
                <li><a href="#">{t('HumenResources')}</a></li>
            </ul>
          </div>
          <div className="col-lg-3">
              <h3 className="footer-heading"><span>{t('OurCourses')}</span></h3>
              <ul className="list-unstyled">
                  <li><a href="#">{t('Math')}</a></li>
                  <li><a href="#">{t('Science')} &amp; {t('Engineering')}</a></li>
                  <li><a href="#">{t('Arts')} &amp; {t('Humanities')}</a></li>
                  <li><a href="#">{t('Economics')} &amp; {t('Finance')}</a></li>
                  <li><a href="#">{t('BusinessAdministration')}</a></li>
                  <li><a href="#">{t('ComputerScience')}</a></li>
              </ul>
          </div>
          <div className="col-lg-3">
              <h3 className="footer-heading"><span>{t('Contact')}</span></h3>
              <ul className="list-unstyled">
                  <li><a href="#">{t('HelpCenter')}</a></li>
                  <li><a href="#">{t('SupportCommunity')}</a></li>
                  <li><a href="#">{t('Press')}</a></li>
                  <li><a href="#">{t('ShareYourStory')}</a></li>
                  <li><a href="#">{t('OurSupporters')}</a></li>
              </ul>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="copyright">
                <p>
                    {/* Link back to Colorlib can't be removed. Template is licensed under CC BY 3.0. */}
                    {t('CopyRight')}
                    Copyright &copy;<script>document.write(new Date().getFullYear());</script> All rights reserved | This template is made with <i className="icon-heart" aria-hidden="true"></i> by <a href="https://colorlib.com" target="_blank" >Colorlib</a>
                    {/* Link back to Colorlib can't be removed. Template is licensed under CC BY 3.0. */}
                </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
