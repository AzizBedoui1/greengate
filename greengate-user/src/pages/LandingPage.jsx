import React, { useState } from "react";
import "../styles/LandingPage.css";
import { useTranslation } from "react-i18next";

const LandingPage = () => {
    const [email, setEmail] = useState("");
    const { t } = useTranslation(["home", "values" , "opportunities"]);

    const opportunities = [
        {
            icon: "💼",
            title: t("opp1.title"  , {ns: 'opportunities'}),
            description:
                t("opp1.description"  , {ns: 'opportunities'}),
        },
        {
            icon: "🎓",
            title: t("opp2.title"  , {ns: 'opportunities'}),
            description:
                t("opp2.description"  , {ns: 'opportunities'}),
        },
        {
            icon: "📺",
            title: t("opp3.title"  , {ns: 'opportunities'}),
            description:
                t("opp3.description"  , {ns: 'opportunities'}),
        },
        {
            icon: "👥",
            title: t("opp4.title"  , {ns: 'opportunities'}),
            description:
                t("opp4.description"  , {ns: 'opportunities'}),
        },
    ];

    const values = [
        {
            image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
            title: t("value1.title"  , {ns: 'values'}),
            description: t("value1.description" , {ns: 'values'}),
        },
        {
            image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
            title: t("value2.title" , {ns: 'values'}),
            description: t("value2.description" , {ns: 'values'}),
        },
        {
            image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
            title: t("value3.title" , {ns: 'values'}),
            description: t("value3.description" , {ns: 'values'}),
        },
    ];

    const [expandedIndex, setExpandedIndex] = useState(null);

    const handleCardClick = (index) => setExpandedIndex(index);
    const closeExpanded = () => setExpandedIndex(null);

    const faqs = [
        "How do I sign up for the project?",
        "What thing that I should prepare before starting?",
        "Does my company need help for marketing services?",
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (email) {
            alert(`Thank you for subscribing with: ${email}`);
            setEmail("");
        }
    };

    return (
        <div className="landing-page">
            {/* Hero Section */}
            <section className="hero" id="home">
                <div className="hero-background">
                    <div className="hero-overlay"></div>
                </div>

                <div className="hero-content">
                    <div className="hero-text">
                        <h1 className="hero-title">{t("hero-title")}</h1>
                        <p className="hero-subtitle">{t("hero-subtitle")}</p>
                        <a href="/opportunities" className="hero-button">
                            {t("join-us-button")}
                        </a>
                    </div>
                </div>
            </section>

            {/* Statistics Section */}
            <section className="statistics" id="about">
                <div className="statistics-container">
                    {/* Statistics Left Side */}
                    <div className="stats-left">
                        <div className="stats-grid">
                            <div className="stat-item">
                                <div className="stat-number">
                                    {t("stat-number1")}
                                </div>
                                <div className="stat-label">
                                    {t("stat-label1")}
                                </div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-number">
                                    {t("stat-number2")}
                                </div>
                                <div className="stat-label">
                                    {t("stat-label2")}
                                </div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-number">
                                    {t("stat-number3")}
                                </div>
                                <div className="stat-label">
                                    {t("stat-label3")}
                                </div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-number">
                                    {t("stat-number4")}
                                </div>
                                <div className="stat-label">
                                    {t("stat-label4")}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Commitments Right Side */}
                    <div className="commitments-right">
                        <h2 className="commitments-title">
                            {t("commitments-title")}
                        </h2>
                        <p className="commitments-text">
                            {t("commitments-text")}
                        </p>
                        <a href="/about" className="learn-more-link">
                            {t("learn-more-button")}
                        </a>
                    </div>
                </div>
            </section>

            {/* Opportunities Section */}
            <section className="opportunities" id="opportunities">
                <div className="opportunities-container">
                    {/* Left Side - Introduction */}
                    <div className="opportunities-intro">
                        <h2 className="opportunities-title">
                            {t("opportunities-title")}
                        </h2>
                        <p className="opportunities-text">
                            {t("opportunities-text")}
                        </p>
                        {/* Remove the <div className="opportunities-image"> */}
                    </div>

                    {/* Right Side - Opportunities Grid */}
                    <div className="opportunities-grid">
                        {opportunities.map((opportunity, index) => (
                            <div key={index} className="opportunity-card">
                                <div className="opportunity-icon">
                                    <div className="icon-background">
                                        {opportunity.icon}
                                    </div>
                                </div>
                                <h3 className="opportunity-title">
                                    {opportunity.title}
                                </h3>
                                <p className="opportunity-description">
                                    {opportunity.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="values">
                <div className="values-container">
                    <div className="values-header">
                        <h2 className="values-title">{t("values-title")}</h2>
                    </div>

                    <div
                        className={`values-grid ${
                            expandedIndex !== null ? "blurred" : ""
                        }`}
                    >
                        {values.map((value, index) => (
                            <div
                                key={index}
                                className="value-card"
                                onClick={() => handleCardClick(index)}
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter")
                                        handleCardClick(index);
                                }}
                                style={{ cursor: "pointer" }}
                            >
                                <div className="value-image">
                                    <img src={value.image} alt={value.title} />
                                </div>
                                <div className="value-content">
                                    <h3 className="value-title">
                                        {value.title}
                                    </h3>
                                    <p className="value-description">
                                        {value.description.length > 100
                                            ? value.description.substring(
                                                  0,
                                                  100
                                              ) + "..."
                                            : value.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {expandedIndex !== null && (
                        <div className="overlay" onClick={closeExpanded}>
                            <div
                                className="expanded-card"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <button
                                    className="close-btn"
                                    onClick={closeExpanded}
                                    aria-label="Close expanded card"
                                >
                                    &times;
                                </button>
                                <div className="value-image">
                                    <img
                                        src={values[expandedIndex].image}
                                        alt={values[expandedIndex].title}
                                    />
                                </div>
                                <div className="value-content">
                                    <h3 className="value-title">
                                        {values[expandedIndex].title}
                                    </h3>
                                    <p className="value-description">
                                        {values[expandedIndex].description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* FAQ Section */}
            <section className="faq">
                <div className="faq-container">
                    {/* FAQ Left Side */}
                    <div className="faq-left">
                        <div className="faq-list">
                            {faqs.map((question, index) => (
                                <div key={index} className="faq-item">
                                    <div className="faq-question">
                                        <p>{question}</p>
                                        <div className="faq-icon">
                                            <span>●</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <a href="#more-faq" className="more-faq-link">
                                More FAQ
                            </a>
                        </div>
                    </div>

                    {/* Newsletter Right Side */}
                    <div className="newsletter-right">
                        <h2 className="newsletter-title">
                            {t("newsletter-title")}
                        </h2>
                        <p className="newsletter-text">
                            {t("newsletter-text")}
                        </p>

                        <form
                            className="newsletter-form"
                            onSubmit={handleSubmit}
                        >
                            <div className="input-group">
                                <input
                                    type="email"
                                    placeholder={t("email-placeholder")}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="email-input"
                                    required
                                />
                                <button type="submit" className="subscribe-btn">
                                    {t("subscribe-button")}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
