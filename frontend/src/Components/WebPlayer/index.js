import './index.scss'
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlay, faCirclePause } from '@fortawesome/free-solid-svg-icons';
import { ReactComponent as WhiteSpotifyLogo } from '../../assets/images/2024-spotify-full-logo/Full_Logo_White_RGB.svg'
import { ReactComponent as GreenSpotifyLogo } from '../../assets/images/2024-spotify-full-logo/Full_Logo_Green_RGB.svg'
import { ReactComponent as Pass } from '../../assets/images/icons/X-Circle-Fill--Streamline-Bootstrap.svg'
import { ReactComponent as Like } from '../../assets/images/icons/Heart-Circle--Streamline-Ionic-Filled.svg'

function WebPlayer({ token, songId, songActions, darkMode, song }) {
    const [player, setPlayer] = useState(null);
    const [deviceId, setDeviceId] = useState(null);
    const [isPaused, setPaused] = useState(false);
    const [currentSong, setSong] = useState(null);
    const [animateIn, setAnimateIn]= useState(false);
    const hasTransferredRef = useRef(false);
    const sdkInitialized = useRef(false);
    const [playerReady, setPlayerReady] = useState(false);

    useEffect(() => {
        if (!song) {
            setSong(null);
            return
        }
        if (song.name === 'Mr. Brightside') {
            const timeout = setTimeout(() => {
                setSong(song);
            }, 300);
            return () => clearTimeout(timeout);
        } else {
            setSong(song)
        }
    }, [song]);  

    // const playSong = useCallback(async (songId) => {
    //     if (!token || !deviceId) return;

    //     const uri = `spotify:track:${songId}`;

    //     try {
    //         // https://api.spotify.com/v1/me/player/play?device_id=${deviceId}
    //         const res = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
    //             method: 'PUT',
    //             headers: {
    //                 'Authorization': `Bearer ${token}`,
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify({
    //                 uris: [uri]
    //             })
    //         });

    //         if (res.status === 204) {
    //             console.log(`Now playing track ${songId}`)
    //         } else {
    //             const error = await res.text();
    //             console.error('Could not start playback:', error);
    //         }
    //     } catch (err) {
    //         console.error('Error playing track:', err)
    //     }
    // }, [deviceId, token]);

    // useEffect(() => {
    //     setAnimateIn(true);
    //     const timer = setTimeout(() => setAnimateIn(false), 400);

    //     return () => clearTimeout(timer);
    // }, [songId]);

    // useEffect(() => {
    //     if (!songId || !token || !deviceId || !playerReady) return;
    //     playSong(songId);
    // }, [songId, token, deviceId, playerReady, playSong]);
    
    // useEffect(() => {
    //     if (sdkInitialized.current) return;
    //     sdkInitialized.current = true;
    //     const script = document.createElement('script');
    //     // https://sdk.scdn.co/spotify-player.js
    //     script.src = 'https://sdk.scdn.co/spotify-player.js';
    //     script.async = true;
    //     document.body.appendChild(script)

    //     window.onSpotifyWebPlaybackSDKReady = () => {
    //         const player = new window.Spotify.Player({
    //             name: "Impulse Web Player",
    //             getOAuthToken: (cb) => { cb(token); },
    //             volume: 0.5,
    //         });

    //         setPlayer(player);

    //         player.addListener('ready', ({ device_id }) => {
    //             console.log('Ready with Device ID', device_id);
    //             setDeviceId(device_id);
            
    //             if (!hasTransferredRef.current) {
    //                 hasTransferredRef.current = true;
            
    //                 fetch('https://api.spotify.com/v1/me/player', {
    //                     method: 'PUT',
    //                     headers: {
    //                         'Authorization': `Bearer ${token}`,
    //                         'Content-Type': 'application/json'
    //                     },
    //                     body: JSON.stringify({
    //                         device_ids: [device_id],
    //                         play: false
    //                     })
    //                 })
    //                 .then(res => {
    //                     if (!res.ok) throw new Error(`Transfer failed: ${res.status}`);
    //                     console.log('Playback transferred to web player');
    //                     setPlayerReady(true);
    //                 })
    //                 .catch(err => console.error(err));
    //             }
    //         });
            

    //         player.addListener('not_ready', ({ device_id }) => {
    //             console.log('Device ID has gone offline', device_id);
    //         });
        
    //         player.addListener('initialization_error', ({ message }) => {
    //             console.error('Init Error:', message);
    //         });
        
    //         player.addListener('authentication_error', ({ message }) => {
    //             console.error('Auth Error:', message);
    //         });
        
    //         player.addListener('account_error', ({ message }) => {
    //             console.error('Account Error:', message);
    //         });

    //         player.addListener('player_state_changed', (state) => {
    //             if (!state || !state.track_window?.current_track) return;
            
    //             // const currentTrack = state.track_window.current_track;
    //             // setSong(currentTrack);
    //             setPaused(state.paused);
    //         });
            


    //         player.connect().then(success => {
    //             if (success) {
    //                 console.log('Connected to Spotify!')
    //             } else {
    //                 console.error('Failed to connect to Spotify')
    //             }
    //         });
    //     };
    // }, [token]);

    return (
        <div className={`playback-container ${animateIn ? 'pulse-in' : ''}`}>
            <div className='logo-container'>
                {darkMode ? (
                    <WhiteSpotifyLogo className='spotify-logo'/>
                ) : (
                    <GreenSpotifyLogo className='spotify-logo'/>
                )}
            </div>
            {currentSong && currentSong.album ? (
                <div className='song-info'>
                    <img
                        className='album-cover'
                        src={currentSong.album.images[0]?.url}
                        alt='Album Art'
                    />
                    <h2 className='title'>{currentSong.name}</h2>
                    <h3 className='artist'>
                        {currentSong.artists.map(artist => artist.name).join(', ')}
                    </h3>
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
                <button 
                    className='playback-button' 
                    onClick={async () => {
                        if (!player) return;

                        try {
                            if (isPaused) {
                                await player.resume();
                            } else {
                                await player.pause();
                            }
                        } catch (err) {
                            console.error("Playback toggle error:", err);
                        }
                    }}
                >
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