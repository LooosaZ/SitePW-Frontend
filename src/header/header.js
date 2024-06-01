import './header.css';

const Header = ({ darkMode }) => {
    return (
        <header className={`header ${darkMode ? 'header-dark' : 'header-light'}`}>
            <div className="container">
                <h2 className="title">
                     Welcome to LuzaServices
                </h2>
            </div>
        </header>
    );
};

export default Header;
