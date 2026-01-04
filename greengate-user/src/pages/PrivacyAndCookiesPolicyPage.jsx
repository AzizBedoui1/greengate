import React from 'react';
import '../styles/PrivacyAndCookiesPolicy.css';

const PrivacyAndCookiesPolicyPage = () => {
  return (
    <section className="privacyandcookiespolicy">
      <header className="privacycookies-hero">
        <h1 className="privacycookies-title">Privacy and Cookies Policy</h1>
      </header>

      <div className="privacy-section">
        <div className="privacy-top">
          <div className="privacy-left">
            <div>
            <h3 className="privacy-heading">1. Information we collect</h3>
            <div className="privacy-paragraphs">
                <p>
                    We gather various types of information to enhance and optimize our services. This includes personal information such as your name, email
                    address, phone number, and mailing address, collected when you register for an account, contact us, or use our services. We also gather 
                    usage information, which encompasses details about your interactions with our website and services, including your IP address, browser
                    type, device information, pages visited, and actions taken.
                </p>
            </div>
            </div>

            <div>
            <h3 className="privacy-heading">2. How we use your information</h3>
            <div className="privacy-paragraphs">
                <p>
                    Our utilization of the information we collect serves multiple purposes. We use your personal data to furnish requested services, such as
                    responding to inquiries, processing orders, and delivering newsletters or updates if you opt to receive them. Additionally, we analyze usage 
                    information to gain insights into how our website and services are used, which informs our continuous improvement efforts, content 
                    customization, and enhancements to user experiences.
                </p>
            </div>
            </div>

            <div>
            <h3 className="privacy-heading">3. Communication</h3>
            <div className="privacy-paragraphs">
                <p>
                    We may employ your contact information to communicate with you concerning our services, provide updates, and convey important notices. You have the option to opt out of marketing communications at any time.
                </p>
            </div>
            </div>

            <div>
            <h3 className="privacy-heading">4. Cookies and Tracking Technologies</h3>
            <div className="privacy-paragraphs">
                <p>
                   To better understand your browsing behavior and improve your website experience, we utilize cookies and similar tracking technologies. 
                   Cookies are small data files stored on your device that facilitate our comprehension of your preferences.By utilizing our website, you
                   implicitly consent to our use of cookies, as detailed in our Cookies Policy. You maintain the ability to manage your cookie preferences
                   through your browser settings.
                </p>
            </div>
            </div>

            <div>
            <h3 className="privacy-heading">5. Security</h3>
            <div className="privacy-paragraphs">
                <p>
                    We prioritize data security and employ reasonable measures to safeguard your information from unauthorized access, disclosure,
                    alteration, or destruction. While we diligently strive to protect your data, it's important to acknowledge that no method of transmission
                    over the internet or electronic storage is entirely secure. Consequently, we cannot provide absolute security guarantees.
                </p>
            </div>
            </div>
        </div>
    </div>
    </div>
    </section>
  );
};

export default PrivacyAndCookiesPolicyPage;


