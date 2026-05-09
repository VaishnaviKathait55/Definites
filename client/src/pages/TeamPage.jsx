import Team from '../components/Team';
import Navbar from '../components/Navbar';

function TeamPage() {
  return (
    <div className="app-container">
      <Navbar />
      <main><Team /></main>
    </div>
  );
}
export default TeamPage;