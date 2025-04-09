import './index.scss'

function MenuToggleButton({ onClick, className }) {
    return (
        <button className={className} onClick={onClick}>
            <div className='bar'/>
            <div className='bar'/>
            <div className='bar'/>
        </button>
    );
}

export default MenuToggleButton