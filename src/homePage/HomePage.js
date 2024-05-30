import "./HomePage.css";
import { Link } from "react-router-dom";

const HomePage = () => {
    return (
        <div className="homePage">
            <Link to="/login">
                <button>LOGIN</button>
            </Link>
        </div>
    );
};

export default HomePage;