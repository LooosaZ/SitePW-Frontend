import Player from './Player';
import './Players.css';
import Config from '../config';
import React, { useState, useEffect } from 'react';
import PlayerForm from "./add/PlayersForm";
import { useNavigate, Link } from 'react-router-dom';

const Players = () => {
    let navigate = useNavigate()
   const [loading, setLoading] = useState(true)
   const [players, setPlayers] = useState([]);
   const [showForm, setShowForm] = useState(false);

   const onClickShowForm = () => {
    setShowForm(!showForm);
   };

   const showFormMessage = showForm ? "Hide Form" : "Show Form";


   useEffect(() => {
    fetch('http://127.0.0.1:3001/team/players', {
        headers: { 'Accept': 'application/json', 'x-access-token': Config.token }
    })
    .then((response) => response.json())
    .then((response) => {
        console.log(response);
        const { auth, players = [] } = response;

        if (auth) {
        setLoading(false);
        setPlayers(players);
        }
    });

    return () => setPlayers([]);
   }, [])

   if (!Config.token) {
    navigate("/");
   }

   if(loading) {
    return <h1>LOADING...</h1>
   }

   return (
    <div className="players">
        <div className="links">
            <Link to="/"> HomePage </Link>
            <button className="buttons" onClick={onClickShowForm}>
                {showFormMessage}
            </button>
        </div>
        <label>PLAYERS: </label>
        <div className="player-container">
            {players.map((player) => (
            <Player key={player._id} {...player} />
            ))}
        </div>

        {showForm && <PlayerForm />}
    </div>
   );
};

export default Players;