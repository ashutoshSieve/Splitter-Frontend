import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from "./components/Home";
import Signup from './components/Signup';
import Login from './components/Login';
import Main from './components/Main';
import Community from './components/Community';
import Form from './components/Form';
import Items from './components/Items';
import Transcation from './components/Transcations';
import CommTransaction from "./components/CommTransaction";
import ReadDetails from './components/ReadDetails';




function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/main" element={<Main/>} />
        <Route path="/community/:name" element={<Community/>} />
        <Route path="/form" element={<Form/>} />
        <Route path="/items" element={<Items/>} />
        <Route path="/transaction" element={<Transcation/>} />
        <Route path="/commTransaction/:name" element={<CommTransaction/>} />
        <Route path="/details/:name/:ID" element={<ReadDetails/>} />
      </Routes>
    </Router>
  );
}

export default App;
