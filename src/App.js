import './App.css';
import React, { useState } from "react";
import Players from "./players/Players.js";
import HomePage from "./homePage/HomePage";
import LoginForm from "./login/LoginForm";
import { Route, Routes, useNavigate } from "react-router-dom";

function App() {
    const [darkMode, setDarkMode] = useState(false);
    const navigate = useNavigate();

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-light'}`}>
            <main>
                <Routes>
                    <Route path="/" element={<HomePage/>}/>
                    <Route path="/login" element={<LoginForm darkMode={darkMode} setDarkMode={setDarkMode} />} />
                    <Route path="/players" element={<Players/>}/>
                </Routes>
            </main>
        </div>
    );
}

export default App;