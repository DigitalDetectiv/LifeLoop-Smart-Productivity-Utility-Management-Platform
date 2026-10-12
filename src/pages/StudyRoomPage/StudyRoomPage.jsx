import '../CategoryPage/CategoryPage.css';
import './StudyRoomPage.css';
import Bubbles from '../../components/Background/Bubbles.jsx';
import PhotoBackground from '../../components/Background/PhotoBackground.jsx';
import Header from '../../components/Header/Header.jsx';
import LiveClock from '../../components/StudyRoom/LiveClock.jsx';
import PomodoroTimer from '../../components/StudyRoom/PomodoroTimer.jsx';
import Stopwatch from '../../components/StudyRoom/Stopwatch.jsx';
import AmbientPlayer from '../../components/StudyRoom/AmbientPlayer.jsx';

// Set this to an imported image once you have your own aesthetic
// background photo ready, same pattern as the Today page's
// homeBackgroundImage in data/mockData.js.
const studyRoomBackgroundImage = null;

export default function StudyRoomPage() {
  return (
    <div className="category-page study-room-page">
      <PhotoBackground src={studyRoomBackgroundImage} />
      <Bubbles />
      <Header title="Study room" subtitle="A quiet corner for focused work - timer, stopwatch, and ambient sound." />
      <div className="category-scroll">
        <LiveClock />
        <div className="study-room-grid">
          <PomodoroTimer />
          <Stopwatch />
          <AmbientPlayer />
        </div>
      </div>
    </div>
  );
}
