import './Player.css';

const Player = (props) => {

    const renderHobbies = (hobbies) => {
        return hobbies.map((hobbie) => {
            return (
                <label key={hobbie._id}> { hobbie.name };</label>
            )
        })
    }

    return (
        <li className="player">
            <div className="player-cell player-name">
            <label className="player-label"> Name: { props.name } </label>
        </div>
        <div className="player-cell player-lastName"> 
            <label className="player-label"> LastName: { props.lastName} </label>
        </div>
            <div className="player-cell player-hobbies">
                <label className="player-label">Hobbies: 
                {
                    renderHobbies(props.hobbies)
                }
                </label>
            </div>
        </li>
    )
}

export default Player;