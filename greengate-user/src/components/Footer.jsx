import React from "react";
import "../styles/Footer.css";
import logo from "../assets/img/Asset 7.png";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";


const Footer = () => {
    const { t } = useTranslation("footer");

    return (
        <footer className="footer">
            <div className="footer-content">
                {/* Pages Column */}
                <div className="footer-column">
                    <h3 className="footer-heading">{t("pages-title")}</h3>
                    <ul className="footer-links">
                        <li>
                            <Link to="/opportunities">{t("opportunities")}</Link>
                        </li>
                        <li>
                            <Link to="/about">{t("about-us")}</Link>
                        </li>
                        <li>
                            <Link href="/blog">{t("blog")}</Link>
                        </li>
                        <li>
                            <Link to="/contact">{t("contact-us")}</Link>
                        </li>
                    </ul>
                </div>

                {/* Social Media Column */}
                <div className="footer-column">
                    <h3 className="footer-heading">{t("social-title")}</h3>
                    <ul className="footer-links">
                        <li>
                            <a href="https://www.instagram.com/greengate4my">{t("instagram")}</a>
                        </li>
                        <li>
                            <a href="https://www.linkedin.com/company/greengate4menayouth">{t("linkedin")}</a>
                        </li>
                    </ul>
                </div>

                {/* Legal Column */}
                <div className="footer-column">
                    <h3 className="footer-heading">{t("legal-title")}</h3>
                    <ul className="footer-links">
                        <li>
                            <Link to="/privacy">{t("privacy-policy")}</Link>
                        </li>
                        <li>
                            <Link to="/terms">{t("terms-conditions")}</Link>
                        </li>
                    </ul>
                </div>

                {/* Brand Logo and Name */}

                {/* Brand Logo and Name */}
                <div className="footer-brand">
                    <Link to="/">
                        <img
                            src={logo}
                            alt="Green Gate 4 MENA Youth"
                            className="footer-logo"
                        />
                    </Link>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="footer-bottom">
                <div className="footer-copyright">
                    <p>{t("copyright")}</p>
                </div>

            </div>
        </footer>
    );
};

export default Footer;
