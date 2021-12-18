
import './App.scss';
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import ScreenHomepage from './components/Access/ScreenHomepage';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<ScreenHomepage/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
