import './index.scss';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import WebPlayer from '../WebPlayer';
import { ReactComponent as WaveHeader } from '../../assets/images/icons/header-wave.svg';
import { ReactComponent as ImpulseLogo } from '../../assets/images/icons/Impulse_Full_Logo.svg';
import MrBrightside from '../../assets/images/mr-brightside.jpeg'
import ShowMe from '../../assets/images/show-me.jpeg'
import Georgia from '../../assets/images/georgia.jpeg'
import StuckBetween from '../../assets/images/stuck-between.jpeg'
import ThankGod from '../../assets/images/thank-god.jpeg'
import Daydream from '../../assets/images/daydream.jpeg'
import Redbone from '../../assets/images/redbone.png'
import Aerials from '../../assets/images/aerials.jpeg'
import Sparks from '../../assets/images/sparks.png'
import Roxanne from '../../assets/images/roxanne.jpeg'


function Home({ darkMode }) {
    const [token, setToken] = useState(null);
    const [songId, setSongId] = useState(null);
    const [expiresAt, setExpiresAt] = useState(null);
    const [userId, setUserId] = useState(null)
    // Use when implemented recommendations endpoint in backend
    // const [songs, setSongs] = useState([]);
    const songs = useMemo(() => [
        {
            name: 'Mr. Brightside',
            artists: [{name: 'The Killers'}],
            album: {
                name: 'Hot Fuss',
                images: [{url: MrBrightside}]
            }
        },
        {
            name: 'Show Me',
            artists: [{name: 'Joey Bada$$'}],
            album: {
                name: '2000',
                images: [{url: ShowMe}]
            }
        },
        {
            name: 'Georgia (2023 Remaster)',
            artists: [{name: 'Bobz Scaggs'}],
            album: {
                name: 'Silk Degrees (2023 Remaster)',
                images: [{url: Georgia}]
            }
        },
        {
            name: 'Stuck Between',
            artists: [{name: 'Dutch Criminal Record'}],
            album: {
                name: 'Stuck Between',
                images: [{url: StuckBetween}]
            }
        },
        {
            name: 'THANK GOD',
            artists: [{name: 'Travis Scott'}],
            album: {
                name: 'UTOPIA',
                images: [{url: ThankGod}]
            }
        },
        {
            name: 'Daydream',
            artists: [{name: 'Gunter Kallmann Choir'}],
            album: {
                name: 'The Fantastic Sound Of',
                images: [{url: Daydream}]
            }
        },
        {
            name: 'Redbone',
            artists: [{name: 'Childish Gambino'}],
            album: {
                name: '"Awaken, My Love!"',
                images: [{url: Redbone}]
            }
        },
        {
            name: 'Aerials',
            artists: [{name: 'System Of A Down'}],
            album: {
                name: 'Toxicity',
                images: [{url: Aerials}]
            }
        },
        {
            name: 'Sparks',
            artists: [{name: 'Coldplay'}],
            album: {
                name: 'Parachutes',
                images: [{url: Sparks}]
            }
        },
        {
            name: 'Roxanne',
            artists: [{name: 'The Police'}],
            album: {
                name: "Outlandos D'Amour (Remastered 2003)",
                images: [{url: Roxanne}]
            }
        },
        null
            
    ], []);
    const [songIndex, setSongIndex] = useState(0);
    const [swipeDirection, setSwipeDirection] = useState(null)

    useEffect(() => {
        if (songs.length > 0) {
            setSongId(songs[songIndex]);
        }
    }, [songs, songIndex]);

    useEffect(() => {
        const now = new Date();
        const timeLeft = expiresAt ? (expiresAt - now) / 1000 : Infinity

        if (timeLeft < 300) {
            console.log('Refreshing token before it expires...')
        }
    });

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('access_token');
        const userId = params.get('user_id');
      
        if (token && userId) {
          setToken(token)
          setUserId(userId)
      
          // Clean up the URL
          window.history.replaceState({}, document.title, '/');
        }
      
        const storedToken = localStorage.getItem('spotify_access_token');
        if (storedToken) {
          setToken(storedToken);
        }
      }, []);

    const handleSwipe = useCallback(async (type, songId) => {
        if (!songId) return;
    
        const direction = type === 'like' ? 'swipe-right' : 'swipe-left';
        setSwipeDirection(direction);
    
        const spotifyIframe = document.querySelector('iframe[src*="spotify.com"]');
        if (spotifyIframe?.contentWindow) {
            spotifyIframe.contentWindow.postMessage({ command: 'pause' }, '*');
        }
    
        try {
            await fetch(`http://localhost:8080/api/song/${type}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ songId })
            });
        } catch (err) {
            console.error(`Error during ${type}:`, err);
        }
    
        setTimeout(() => {
            setSwipeDirection(null);
            setSongId(null);
    
            if (songIndex + 1 < songs.length) {
                setSongIndex(prev => prev + 1);
            } else {
                setSongIndex(songs.length - 1)
                console.warn("Reached end of song list — implement backend fetch.");
                throw new Error("Not implemented yet");
            }
        }, 500);
    }, [songIndex, songs]);    


    const songActions = {
        like: () => handleSwipe('like', songId),
        pass: () => handleSwipe('pass', songId)
    }

    return (
        <div className='home-container' >
            <div className='header-wrapper'>
                <h1 className='visually-hidden'>Impulse</h1>
                <ImpulseLogo className='impulse-logo'/>
                <WaveHeader className='wave-svg'/>
            </div>
            <div className='card-wrapper'>
                <div className={`card ${swipeDirection || 'fade-in'}`}>
                    <WebPlayer 
                        token={token} 
                        songId={songId} 
                        songActions={songActions}
                        darkMode={darkMode}
                        song={songs[songIndex]}
                    />
                </div>
            </div>    
        </div>
    );
}

export default Home;
