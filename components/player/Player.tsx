"use client";

import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/audio.css';
import '@vidstack/react/player/styles/default/layouts/video.css';


import { useEffect, forwardRef, useImperativeHandle, useRef, useState } from "react";
import { MediaPlayer, MediaProvider, Poster, Track, Spinner, Controls } from "@vidstack/react"
import { DefaultVideoLayout, defaultLayoutIcons } from '@vidstack/react/player/layouts/default';
import { Gesture } from '@vidstack/react';
import { SeekBackward10Icon, SeekForward10Icon } from '@vidstack/react/icons';




interface VidstackPlayerProps {
  logo: string;
  poster: string;
  color: string;
  streamUrl: string;
  captions: any[];
  defaultSubtitlesLanguage: string;
  onTimeUpdate: (position: number) => void;
  onComplete: () => void;
  onError: () => void;
  onServerChange: () => void;
}

const VidstackPlayer = forwardRef(
  (
    {logo, poster, color, streamUrl, captions, defaultSubtitlesLanguage, onTimeUpdate, onComplete, onError, onServerChange }: VidstackPlayerProps,
    ref
  ) => {

    const playerRef = useRef<any>(null);
    const isReadyRef = useRef(false); // track when player is ready
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    // Expose seek method via ref

    useImperativeHandle(ref, () => ({
      seek: (time: number) => {
        if (isReadyRef.current && playerRef.current) {
          // Use the correct Vidstack player API for seeking
          playerRef.current.currentTime = time;
        } else {
          console.warn("Player not ready yet.");
        }
      },
    }));

    useEffect(() => {
      if (playerRef.current) {
        isReadyRef.current = true;
      }
    }, [playerRef.current]);

    useEffect(()=>{
      console.log("color:",color)
    },[])

    const playerStyle: React.CSSProperties & {
      [key: `--${string}`]: string | number | null | undefined;
    } = {
      "--media-buffering-track-fill-color": color,
    };


    return (
    <MediaPlayer
      className="w-full h-full"
      ref={playerRef}
      autoplay
      muted
      src={streamUrl}
      poster={poster}
      playsInline
      logLevel="warn"
      style={playerStyle}
      onCanPlay={() => setIsLoading(false)}
      onError={() => {
        setHasError(true);
        onError();
      }}
      onEnded={onComplete}
      onTimeUpdate={({ currentTime }) => onTimeUpdate(currentTime)}
    >


        <MediaProvider>
          {poster && <Poster className="vds-poster" />}
          {/* Captions */}
          {captions?.map((cap) => (
            <Track
              src={cap?.file || cap?.url}
              kind="captions"
              label={cap?.label}
              lang={cap?.language}
              type="srt"
              default={cap?.language === defaultSubtitlesLanguage}
            />
          ))}
            <Gesture className="vds-gesture" event="pointerup" action="toggle:paused" />
            <Gesture className="vds-gesture" event="pointerup" action="toggle:controls" />
            <Gesture className="vds-gesture" event="dblpointerup" action="seek:-10" />
            <Gesture className="vds-gesture" event="dblpointerup" action="seek:10" />
            <Gesture className="vds-gesture" event="dblpointerup" action="toggle:fullscreen" />

        </MediaProvider>



        {/*Change Server Icon */}
        <DefaultVideoLayout
          icons={defaultLayoutIcons}
          slots={{
            beforeCaptionButton: (
              <button
                className="vds-button"
                aria-label="Change Server"
                onClick={onServerChange}
              >
                <img src="/assets/servers.svg" alt="Change Server" className="w-7 h-8" />
              </button>
            ),
            beforeFullscreenButton: (
              <>
              <button
                className="vds-button y-10"
                aria-label="Seek Backward 10 seconds"
                onClick={() => {
                  if (playerRef.current) {
                    playerRef.current.currentTime -= 10;
                  }
                }}
              >
              <SeekBackward10Icon className="w-h h-7" />
              </button>
              <button
                className="vds-button mx-50"
                aria-label="Seek Forward 10 seconds"
                onClick={() => {
                  if (playerRef.current) {
                    playerRef.current.currentTime += 10;
                  }
                }}
              >
              <SeekForward10Icon className="w-h h-7" />
              </button>
              </>
              
            ),

          }}
        />




        {/* Watermark logo */}
        {logo && (
          <div className="absolute top-2 right-2 z-[1]">
            <img src={logo} alt="Logo" className="h-14 w-14 opacity-80" />
          </div>
        )}
      </MediaPlayer>
    );
  }
);

VidstackPlayer.displayName = "VidstackPlayer";

export default VidstackPlayer;