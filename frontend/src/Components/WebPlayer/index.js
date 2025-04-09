import './index.scss'
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlay, faCirclePause } from '@fortawesome/free-solid-svg-icons';
import { ReactComponent as SpotifyLogo } from '../../assets/images/2024-spotify-full-logo/Full_Logo_White_RGB.svg'
import { ReactComponent as Pass } from '../../assets/images/icons/X-Circle-Fill--Streamline-Bootstrap.svg'
import { ReactComponent as Like } from '../../assets/images/icons/Heart-Circle--Streamline-Ionic-Filled.svg'

function WebPlayer({ token, songId, songActions }) {
    const [player, setPlayer] = useState(null);
    const [deviceId, setDeviceId] = useState(null);
    const [isPaused, setPaused] = useState(false);
    const [currentSong, setSong] = useState(null);
    const lastSongIdRef = useRef(songId);
    const debounceRef = useRef(null);
    const [animateIn, setAnimateIn]= useState(false);
      
    const playSong = useCallback(async (songId) => {
        if (!token || !deviceId) return;

        const uri = `spotify:track:${songId}`;

        try {
            // https://api.spotify.com/v1/me/player/play?device_id=${deviceId}
            const res = await fetch(``, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    uris: [uri]
                })
            });

            if (res.status === 204) {
                console.log(`Now playing track ${songId}`)
            } else {
                const error = await res.text();
                console.error('Could not start playback:', error);
            }
        } catch (err) {
            console.error('Error playing track:', err)
        }
    }, [deviceId, token]);

    useEffect(() => {
        setAnimateIn(true);
        const timer = setTimeout(() => setAnimateIn(false), 400);

        return () => clearTimeout(timer);
    }, [songId]);

    useEffect(() => {
        if (songId && token && deviceId) {
            playSong(songId);
        }
    }, [songId, token, deviceId, playSong]);
    
    useEffect(() => {
        const script = document.createElement('script');
        // https://sdk.scdn.co/spotify-player.js
        script.src = '';
        script.async = true;
        document.body.appendChild(script)

        window.onSpotifyWebPlaybackSDKReady = () => {
            const player = new window.Spotify.Player({
                name: "Reverbly Web Player",
                getOAuthToken: (cb) => { cb(token); },
                volume: 0.5,
            });

            setPlayer(player);

            player.addListener('ready', ({ device_id }) => {
                console.log('Ready with Device ID', device_id);
                setDeviceId(device_id);

                // https://api.spotify.com/v1/me/player
                fetch('', {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        device_ids: [device_id],
                        play: true
                    })
                });
            });

            player.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id);
            });
        
            player.addListener('initialization_error', ({ message }) => {
                console.error('Init Error:', message);
            });
        
            player.addListener('authentication_error', ({ message }) => {
                console.error('Auth Error:', message);
            });
        
            player.addListener('account_error', ({ message }) => {
                console.error('Account Error:', message);
            });

            player.addListener('player_state_changed', (state) => {
                if (!state || !state.track_window?.current_track) return;


                clearTimeout(debounceRef.current);

                debounceRef.current = setTimeout(() => {
                    const currentTrack = state.track_window.current_track;
                    const isFinished = state.position === 0 && state.paused === true;

                    setSong(currentTrack);
                    setPaused(state.paused);
                    
                    if (isFinished && songId === lastSongIdRef.current) {
                        console.log('Auto-replaying current song...');
                        playSong(songId)
                    }

                    lastSongIdRef.current = currentTrack.id;
                }, 100); // wait 100ms before applying new state
            });


            player.connect().then(success => {
                if (success) {
                    console.log('Connected to Spotify!')
                } else {
                    console.error('Failed to connect to Spotify')
                }
            });
        };
    }, [token, playSong, songId]);

    return (
        <div className={`playback-container ${animateIn ? 'pulse-in' : ''}`}>
            <div className='logo-container'>
                <SpotifyLogo className='spotify-logo'/>
            </div>
            {currentSong && currentSong.album ? (
                <div className='song-info'>
                    <img
                        className='album-cover'
                        src={currentSong.album.images[0]?.url}
                        alt='Album Art'
                    />
                    <h2 className='title'>{currentSong.name}</h2>
                    <p className='artist'>
                        {currentSong.artists.map(artist => artist.name).join(', ')}
                    </p>
                    <p className='album' >{currentSong.album.name}</p>
                </div>
            ) : (
                <div className='placeholders'>
                    <div className='album-cover-placeholder'></div>
                    <div className='title-placeholder'></div>
                    <div className='artist-placeholder'></div>
                    <div className='album-placeholder'></div>
                </div>
            )}
            <div className='buttons'>
                <button className='pass-button' onClick={() => songActions.pass(songId)}>
                    <Pass className='pass-icon'/>
                </button>
                <button className='playback-button' onClick={() => {
                    if (player) {
                        console.log('Toggling playback');
                        player.togglePlay();
                    } else {
                        console.warn('No player available')
                    }
                }}>
                    {/* {isPaused ? <PlayButton className='icon'/> : <PauseButton className='icon'/>} */}
                    <FontAwesomeIcon icon={isPaused ? faCirclePlay : faCirclePause} className="icon" />
                </button>
                <button className='like-button' onClick={() => songActions.like(songId)}>
                    <Like className='like-icon'/>
                </button>
            </div>
        </div>     
    );
}

export default WebPlayer;