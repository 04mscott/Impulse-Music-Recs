import './index.scss';
import React, { useState, useEffect, useMemo } from 'react';
import WebPlayer from '../WebPlayer';
import { ReactComponent as WaveHeader } from '../../assets/images/icons/header-wave.svg';
import { ReactComponent as ImpulseLogo } from '../../assets/images/icons/Impulse_Full_Logo.svg';

function Home() {
    const [token, setToken] = useState(null);
    const [songId, setSongId] = useState(null);
    // const [expiresAt, setExpiresAt] = useState(null);
    // Use when implemented recommendations endpoint in backend
    // const [songs, setSongs] = useState([]);
    const songs = useMemo(() => [
        '003vvx7Niy0yvhvHt4a68B', 
        '00AKWl27RTGdG1mMciYRUu', 
        '00hVU6kDP67JHurfwG2dtq', 
        '00qXpbgBV1qrO5d9DvBdGM', 
        '00SmB7n85SKROGjybsyq5i'
    ], []);
    const [songIndex, setSongIndex] = useState(0);

    // Use when implemented endpoint in backend
    // useEffect(() => {
    //     fetch('http://localhost:8080/api/recommendations')
    //     .then(res => res.json())
    //     .then(data => {
    //         setSongs(data);
    //         setSongIndex(0);
    //     });
    // }, []);

    useEffect(() => {
        if (songs.length > 0) {
          setSongId(songs[songIndex]);
        }
      }, [songs, songIndex]);

    // useEffect(() => {
    //     fetch('http://localhost:8080/api/spotify/token', { credentials: 'include'})
    //     .then(res => res.json())
    //     .then(data => {
    //         if (data.error) {
    //             console.error('Spotify auth error: ', data.error);
    //             return;
    //         }

    //         setToken(data.access_token);
    //         setExpiresAt(new Date(data.expires_at));
    //     })
    //     .catch(err => console.error('Token fetch failed: ', err));
    // }, []);

    // useEffect(() => {
    //     const now = new Date();
    //     const timeLeft = expiresAt ? (expiresAt - now) / 1000 : Infinity

    //     if (timeLeft < 300) {
    //         console.log('Refreshing token before it expires...')
    //     }
    // });

    useEffect(() => {
        setSongId(songs[songIndex])
        setToken('BQADToiAvma9cw7BTRhJStRHI-1SDzsHlqDXBQrr-ak6n-6pBDexqlmjJ9XYaKtpx5Mt27yDswM83zE1690I2BOd06LPH4foC-0gKRHHuczMrnfSlnRBzfyjnok03L0hf2tQfbTMFCdRZDtAJEix4yvSdyiYVd9vSNInopwvtk6JsmVoujQjqE2zNvrCr_DM6raEYxgkhMeKwGYzgYFp2SsOjxbcksP-yfJ4sUhmDPA8tpeQb1bn_rDgT_z1uqMg9QLcTTqkNWIMTSM6U5ycM9kOehg8ofIqww');
    }, [songs, songIndex]);


    const songActions = {
        like: (songId) => {
            if (!songId) return;
            fetch('http://localhost:8080/api/song/like', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ songId })
            })
            .then(res => res.json())
            .then(data => console.log('Liked:', data))
            .catch(err => console.error('Error liking song:', err));
            if (songIndex + 1 < songs.length) {
                setSongIndex(prev => prev + 1);
            } else {
                console.warn("Reached end of song list — need to implement fetching more.");
                throw new Error("Not implemented yet");
            };
        },
        pass: (songId) => {
            if (!songId) return;
            fetch('http://localhost:8080/api/song/pass', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ songId })
            })
            .then(res => res.json())
            .then(data => console.log('Passed:', data))
            .catch(err => console.error('Error passing song:', err));
            if (songIndex + 1 < songs.length) {
                setSongIndex(prev => prev + 1);
            } else {
                console.warn("Reached end of song list — need to implement fetching more.");
                throw new Error("Not implemented yet");
            };
        },
    }

    return (
        <div className='home-container' >
            <div className='header-wrapper'>
                <ImpulseLogo className='impulse-logo'/>
                <WaveHeader className='wave-svg'/>
            </div>
            <div className='card'>
                {token && songId && (
                    <WebPlayer 
                        token={token} 
                        songId={songId} 
                        songActions={songActions}
                    />
                )} 
            </div>      
        </div>
    );
}

export default Home;
