
import './App.css';
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import GetScreen from './components/Login/GetScreen';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<GetScreen/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
