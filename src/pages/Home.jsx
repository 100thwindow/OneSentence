import { Link } from "react-router-dom";

function Home() {
  return (
    <main className="app-layout">
      <header className="app-header">
        <h1 className="app-title">FixerAI</h1>
        <p className="app-subtitle">Daily English Practice</p>
      </header>

      <section className="prompt-section">
        {/* <h2 className="prompt-title">Today's prompt</h2> */}
        

        <Link to="/practice" className="primary-button">
          Start
        </Link>
      </section>
    </main>
  );
}

export default Home;