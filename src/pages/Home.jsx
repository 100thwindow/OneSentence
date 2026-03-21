import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="practice-page">
      <div className="practice-page__bg" aria-hidden="true">
        <span className="practice-page__blob practice-page__blob--1" />
        <span className="practice-page__blob practice-page__blob--2" />
        <span className="practice-page__blob practice-page__blob--3" />
      </div>

      <main className="app-layout practice-layout">
        <header className="practice-header home-header">
          <h1 className="app-title home-brand">FixerAI</h1>
          <p className="app-subtitle home-tagline">Daily English Practice</p>
          <p className="prompt-text practice-header__prompt home-intro">
            <strong>Type something and let AI to fix it</strong>
          </p>
        </header>

        <section className="home-cta-section">
          <Link to="/practice" className="primary-button primary-button--large home-cta">
            Start
          </Link>
        </section>
      </main>
    </div>
  );
}

export default Home;