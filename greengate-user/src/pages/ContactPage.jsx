// ContactPage.jsx
import React from "react";
import "../styles/ContactPage.css";
import building from "../assets/img/building_contact.png";
import { useTranslation } from "react-i18next";

const ContactPage = () => {
  const { t } = useTranslation("contact");

  return (
    <section className="contact">
      <header className="contact-hero">
        <h1 className="contact-title">{t("contact-title")}</h1>
      </header>

      <div className="contact-grid">
        <div className="contact-location">
          <h2 className="block-title">{t("location-title")}</h2>
          <p className="location-lines">{t("location-address")}</p>
        </div>

        <div className="contact-form-wrap">
          <h2 className="block-title">{t("form-title")}</h2>

          <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
            <div className="row two">
              <div className="field">
                <label htmlFor="name">{t("name-label")}</label>
                <input id="name" name="name" type="text" />
              </div>
              <div className="field">
                <label htmlFor="email">{t("email-label")}</label>
                <input id="email" name="email" type="email" />
              </div>
            </div>

            <div className="row two">
              <div className="field">
                <label htmlFor="phone">{t("phone-label")}</label>
                <input id="phone" name="phone" type="tel" />
              </div>
              <div className="field">
                <label htmlFor="company">{t("company-label")}</label>
                <input id="company" name="company" type="text" />
              </div>
            </div>

            <div className="row">
              <div className="field">
                <label htmlFor="message">{t("message-label")}</label>
                <textarea id="message" name="message" rows={5}></textarea>
              </div>
            </div>

            <div className="consent">
              <input id="consent" type="checkbox" />
              <label htmlFor="consent">{t("consent-text")}</label>
            </div>

            <button type="submit" className="btn-send">
              {t("send-button")}
            </button>
          </form>
        </div>
      </div>

      <div className="contact-media">
        <div className="media-item">
          <iframe
            title="building"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4574.587905441205!2d10.634352729261822!3d35.83129274246546!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1302756e1abce3d5%3A0xc7abbb79d39a0d65!2sGreen%20Gate%20Transit%20And%20Logistics%20Services!5e0!3m2!1sfr!2stn!4v1758808016977!5m2!1sfr!2stn"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

        <figure className="media-item">
          <img src={building} alt={t("contact-title")} />
        </figure>
      </div>
    </section>
  );
};

export default ContactPage;
