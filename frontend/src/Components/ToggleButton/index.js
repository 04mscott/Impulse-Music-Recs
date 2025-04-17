import './index.scss'

function ToggleButton({ onClick, className, darkMode }) {
    return(
        <button className={className} onClick={onClick}>
            <div className={`toggle-body ${darkMode ? 'dark' : 'light'}`}>
                <div className={`toggle-switch ${darkMode ? 'moon' : 'sun'}`}></div>
            </div>
        </button>
    );
}

export default ToggleButton;