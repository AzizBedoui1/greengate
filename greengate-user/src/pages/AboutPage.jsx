import React, { useState } from "react";
import "../styles/AboutPage.css";
import forest from "../assets/img/frame3_aboutus.png";
import team from "../assets/img/frame2_aboutus.png";
import { useTranslation } from "react-i18next";


const AboutPage = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const { t } = useTranslation(["about", "team"]);

    const teamMembers = [
        {
            name: t("pers1.name",{ns: "team"}),
            position: t("pers1.position",{ns: "team"}),
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        },
        {
            name: t("pers2.name",{ns: "team"}),
            position: t("pers2.position",{ns: "team"}),
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        },
        {
            name: t("pers2.name",{ns: "team"}),
            position: t("pers2.position",{ns: "team"}),
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        },
        {
            name: t("pers2.name",{ns: "team"}),
            position: t("pers2.position",{ns: "team"}),
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
        },
    ];

    const cardsToShow = 2;
    const totalCards = teamMembers.length;
    const cardWidthPercent = 30;

    const nextSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex >= totalCards - cardsToShow ? 0 : prevIndex + 1
        );
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex <= 0 ? totalCards - cardsToShow : prevIndex - 1
        );
    };

    return (
        <section className="about">
            <header className="about-hero">
                <h1 className="about-title">{t("title")}</h1>
            </header>

            <div className="about-section">
                <div className="about-top">
                    <div className="about-left">
                        <h2 className="about-heading">
                            {t("heading")}
                        </h2>
                    </div>
                    <br />
                    <figure className="about-figure">
                        <img src={team} alt="Team in a meeting" />
                        <figcaption className="about-caption">
                        </figcaption>
                    </figure>
                </div>

                <div className="about-paragraphs">
                    <p>
                        {t("paragraph1")}
                    </p>
                </div>

                <div className="about-banner">
                    <img src={forest} alt="Forest" />
                    <div className="about-banner-text">
                        {t("banner-text")}
                    </div>
                </div>

                <div className="about-bottom">
                    <p>
                        {t("paragraph2")}
                    </p>
                </div>
            </div>

            {/* Team Carousel */}
            <div className="team-header">
                <h2 className="team-title">
                    Our Team
                </h2>
            </div>
            <div className="team-carousel">
                <div
                    className="carousel-container"
                    style={{ overflow: "hidden" }}
                >
                    <div
                        className="carousel-track"
                        style={{
                            display: "flex",
                            transition: "transform 0.5s ease",
                            width: "max-content",
                            transform: `translateX(-${
                                cardWidthPercent * currentIndex
                            }%)`,
                        }}
                    >
                        {teamMembers.map((member, index) => (
                            <div key={index} className="team-member-card">
                                <div className="member-image">
                                    <img src={member.image} alt={member.name} />
                                </div>
                                <div className="member-info">
                                    <h3 className="member-name">
                                        {member.name}
                                    </h3>
                                    <p className="member-position">
                                        {member.position}
                                    </p>
                                    <p className="member-description">
                                        {member.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="carousel-controls">
                    <button
                        onClick={prevSlide}
                        className="carousel-btn prev-btn"
                    >
                        ←
                    </button>
                    <button
                        onClick={nextSlide}
                        className="carousel-btn next-btn"
                    >
                        →
                    </button>
                </div>
            </div>
        </section>
    );
};

export default AboutPage;
