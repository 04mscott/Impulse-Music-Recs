import './index.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser, faGear, faFileContract, faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import MenuToggleButton from '../MenuToggleButton';
import { useState } from 'react';

function SideBar({ className, onClose }) {
    const [activeMenu, setAvtiveMenu] = useState('profile')
    const [numSongs, setNumSongs] = useState(0)
    const [numRecs, setNumRecs] = useState(0)
    const [numLikes, setNumLikes] = useState(0)
    const [recentLike, setRecentLike] = useState(null)

    let likePassRatio;
    if (numLikes === numRecs) {
        likePassRatio = 0;
    } else if (numRecs - numLikes === 0) {
        likePassRatio = 1;
    } else {
        likePassRatio = (numLikes / (numRecs - numLikes)).toFixed(2);
    }

    return (
        <div className={className}>
            <div className='menus'>
                <div className='upper-container'>
                    <MenuToggleButton onClick={onClose} className={'sidebar-menu-button'}/>
                    <button className={`user-button ${activeMenu === 'profile' ? 'active' : ''}`} onClick={() => setAvtiveMenu('profile')}>
                        <FontAwesomeIcon icon={faCircleUser} className="user-icon" />
                    </button>
                </div>
                <div className='lower-container'>
                    <button className={`terms-button ${activeMenu === 'terms' ? 'active' : ''}`} onClick={() => setAvtiveMenu('terms')}>
                        <FontAwesomeIcon icon={faFileContract} className='term-icon'/>
                    </button>
                    <button className={`settings-button ${activeMenu === 'settings' ? 'active' : ''}`} onClick={() => setAvtiveMenu('settings')}>
                        <FontAwesomeIcon icon={faGear} className="gear-icon"/>
                    </button>
                </div>
            </div>
            <div className='menu-display'>
                {activeMenu === 'profile' && 
                    <>
                        <div className='profile-menu'>
                            <h2>Profile</h2>
                            <FontAwesomeIcon icon={faCircleUser} className='profile-image-placeholder'/>
                            <div className='email'></div>
                            <div className='stats'>
                                <h3>Your Stats</h3>
                                <div className='stat-row'>
                                    <p>Songs analyzed: {numSongs}</p>
                                    <FontAwesomeIcon icon={faCircleInfo} className='info-icon'/>
                                </div>
                                <p>Total Recommendations given: {numRecs}</p>
                                <p>{recentLike ? `Most Recent Like: ${recentLike}` : "You haven't liked any songs yet"}</p>
                                <p>Number of likes: {numLikes}</p>
                                <p>Like Pass Ratio: {likePassRatio}</p>
                            </div>
                        </div>
                    </>
                }
                {activeMenu === 'terms' && 
                    <div className='terms-menu'>

                    </div>
                }
                {activeMenu === 'settings' && 
                    <div className='settings-menu'>

                    </div>
                }
            </div>
        </div>
    );
}

export default SideBar