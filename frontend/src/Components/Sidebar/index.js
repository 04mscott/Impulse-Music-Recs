import './index.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser, faGear, faFileContract, faCircleInfo, faUserLock } from '@fortawesome/free-solid-svg-icons';
import MenuToggleButton from '../MenuToggleButton';
import ToggleButton from '../ToggleButton';
import ProfilePic from '../../assets/images/profile.png'
import { useEffect, useState } from 'react';

function SideBar({ className, onClose, darkMode, toggleDarkMode }) {
    const [activeMenu, setAvtiveMenu] = useState('profile');
    const [email, setEmail] = useState('masonscott141@gmail.com');
    const [imgUrl, setImgUrl] = useState(ProfilePic);
    const [numSongs, setNumSongs] = useState(927);
    const [numRecs, setNumRecs] = useState(10);
    const [numLikes, setNumLikes] = useState(5);
    const [recentLike, setRecentLike] = useState('Roxanne by The Police');
    const [likePercent, setLikePercent] = useState(50.0);
    const [showInfo, setShowInfo] = useState(false);

    useEffect(() => {
        // http://localhost:8080/api/user/stats
        fetch('', {credentials: 'include'})
        .then(res => res?.json())
        .then(res => {
            if (res.redirected) {
                // Let the browser handle the redirect
                window.location.href = res.url;
                return;
            }
            return res.json();
        })
        .then(({ email, img_url, songs_analyzed, num_recs, num_likes, recent_like, percent }) => {
            setEmail(email);
            setImgUrl(img_url);
            setNumSongs(songs_analyzed);
            setNumRecs(num_recs);
            setNumLikes(num_likes);
            setRecentLike(recent_like);
            setLikePercent(percent);
        })
        .catch(err => {
            console.error('Token fetch failed:', err);
        });
      }, []);

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
                    <button className={`privacy-button ${activeMenu === 'privacy' ? 'active' : ''}`} onClick={() => setAvtiveMenu('privacy')}>
                        <FontAwesomeIcon icon={faUserLock} className='privacy-icon'/>
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
                            {imgUrl ? (
                                <img className='profile-image' src={imgUrl} alt='Album Art'/>
                            ) : (
                                <FontAwesomeIcon icon={faCircleUser} className='profile-image-placeholder'/>
                            )}
                            {email ? (
                                <p className='email'>{email}</p>
                            ) : (
                                <div className='email-placeholder'></div>
                            )}
                            <div className='stats'>
                                <h3>Your Stats</h3>
                                <div className='stat-row'>
                                    <p>Songs analyzed: {numSongs}</p>
                                    <button
                                        className='info-button'
                                        onMouseEnter={() => setShowInfo(true)}
                                        onMouseLeave={() => setShowInfo(false)}
                                    >
                                        <FontAwesomeIcon icon={faCircleInfo} className='info-icon'/>
                                        {showInfo && (
                                            <div className='info-box'>
                                                <p>Songs Impulse has analyzed to personalize your recommendations. More songs means better suggestions.</p>
                                            </div>
                                        )}
                                    </button>
                                </div>
                                <p>Total Recommendations given: {numRecs}</p>
                                <p>{recentLike ? `Most Recent Like: ${recentLike}` : "You haven't liked any songs yet"}</p>
                                <p>Number of likes: {numLikes}</p>
                                <p>Like Percent: {likePercent}%</p>
                            </div>
                        </div>
                    </>
                }
                {activeMenu === 'terms' && 
                    <>
                        <h2>Terms & Conditions</h2>
                        <div className='terms-menu'>
                            <p>Last updated: April 10, 2025</p>
                            <p>
                                Welcome to Impulse! These Terms and Conditions ("Terms") govern your use of the Impulse application. 
                                By using the app, you agree to the following:
                            </p>
                            <h3>1. Use of the Service</h3>
                            <p>
                                Impulse provides music discovery and playback features through integration with Spotify. 
                                Use of this app requires a valid Spotify account and your acceptance of Spotify's own Terms of Service and Privacy Policy.
                            </p>
                            <h3>2. Early Access & Account Whitelisting</h3>
                            <p>
                                Impulse is currently in early-access developer mode as defined by Spotify's Developer Platform. Access to the app is 
                                restricted to users who have been explicitly added to the application via Spotify's dashboard.
                            </p>
                            <p>
                                In order to request access, users must provide their Spotify account email address and legal/display name 
                                (as set in their Spotify profile). This information is collected via a form and used solely for whitelisting purposes. 
                                If you are not on the approved list, you will not be able to log in or use the application.
                            </p>
                            <h3>3. Data Collected</h3>
                            <p>Upon authorization through Spotify, Impulse collects the following data:</p>
                            <ul>
                                <li>Your Spotify user ID and email address</li>
                                <li>Your top 50 tracks and top artists</li>
                                <li>Your saved (liked) songs</li>
                                <li>Songs from all playlists you own or follow</li>
                                <li>A list of artists you follow</li>
                            </ul>
                            <p>
                                This information is used to generate personalized song recommendations and playback features within the app.
                            </p>
                            <h3>4. Data Storage</h3>
                            <p>
                                User data is stored in a private MySQL database that is part of the application's containerized infrastructure. 
                                The entire application, including its backend, frontend, and database, is deployed within a secure Docker environment 
                                on a private virtual private server (VPS).
                            </p>
                            <p>
                                This data is used exclusively for recommendation and playback features within the app and is not sold, shared, or used 
                                for advertising purposes.
                            </p>
                            <p>
                                All data remains under the control of the app's developer. You may request deletion of your data at any time by contacting 
                                the developer via the GitHub project or the access request form.
                            </p>
                            <h3>5. Intellectual Property</h3>
                            <p>
                                Impulse does not host or distribute any music files. All music content streamed or recommended by the app is delivered 
                                through the official Spotify API and governed by Spotify's terms.
                            </p>
                            <h3>6. Open Source</h3>
                            <p>
                                Impulse is an open-source project built for educational and portfolio purposes. The source code is available publicly 
                                on GitHub for transparency and technical review.
                            </p>
                            <h3>7. Disclaimer</h3>
                            <p>
                                Impulse is not affiliated with or endorsed by Spotify. The application is provided "as is" without warranties of any kind. Use at your own risk.
                            </p>
                            <h3>8. Changes</h3>
                            <p>
                                These terms may be updated at any time. Continued use of the app implies acceptance of the latest version.
                            </p>
                            <p>
                                For questions, feedback, or data-related concerns, please refer to the GitHub repository or reach out via the provided access request form.
                            </p>
                        </div>
                    </>
                }
                {activeMenu === 'privacy' &&
                    <>
                        <h2>Privacy Policy</h2>
                        <div className='privacy-menu'>
                            <p>Last updated: April 10, 2025</p>
                            <p>
                                Impulse is a music recommendation and playback app that uses Spotify's API to deliver personalized content. 
                                This Privacy Policy explains what data is collected and how it is used.
                            </p>
                            <h3>Information Collected</h3>
                            <p>We collect the following information from users who request access via our sign-up form:</p>
                            <ul>
                                <li>Spotify account email address</li>
                                <li>Your name (as shown in your Spotify profile)</li>
                            </ul>
                            <p>
                                Once you are granted access and authorize the app, we also collect the following data from Spotify:
                            </p>
                            <ul>
                                <li>Your Spotify user ID and email</li>
                                <li>Your top tracks and top artists</li>
                                <li>Your saved (liked) songs</li>
                                <li>Songs from playlists you own or follow</li>
                                <li>Artists you follow</li>
                            </ul>
                            <h3>Purpose of Data Collection</h3>
                            <p>This data is used solely to:</p>
                            <ul>
                                <li>Allow access to the application in developer mode (via Spotify's whitelisting system)</li>
                                <li>Generate music recommendations personalized to your listening history</li>
                                <li>Power playback functionality through Spotify's Web Playback SDK</li>
                            </ul>
                            <h3>Data Storage</h3>
                            <p>
                                All collected data is stored in a secure MySQL database deployed within a private Docker container on a virtual private server (VPS) 
                                under the control of the developer. No data is sold, rented, or shared with third parties.
                            </p>
                            <h3>Your Privacy Rights</h3>
                            <p>
                            You can request that your data be deleted at any time. To request removal or ask questions, please reach out through the GitHub repository or the original access form.
                            </p>
                            <h3>Open Source & Transparency</h3>
                            <p>
                                Impulse is an open-source portfolio project. The source code is available on GitHub to promote transparency and learning.
                            </p>
                            <p>By using this app, you consent to the collection and use of your data as described above.</p>
                        </div>
                    </>
                }
                {activeMenu === 'settings' && 
                    <>
                        <h2>Settings</h2>
                        <div className='settings-menu'>
                            <div className='visuals'>
                                <h3>Visuals</h3>
                                <div className='visual-toggle'>
                                    <p>App Appearance</p>
                                    <ToggleButton darkMode={darkMode} className={'toggle-button'} onClick={toggleDarkMode}/>
                                </div>
                                <div className={`background ${darkMode ? 'dark' : 'light'}`}></div>
                            </div>
                        </div>
                    </>
                }
            </div>
        </div>
    );
}

export default SideBar