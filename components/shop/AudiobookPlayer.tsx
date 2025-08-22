'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Clock,
  List,
  Heart,
  Download
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AudioTrack {
  id: string;
  title: string;
  file: string;
  duration?: string;
  type: 'chapter' | 'bonus' | 'extra';
  chapterNumber?: number;
}

interface AudiobookPlayerProps {
  bookTitle: string;
  coverImage: string;
  tracks: AudioTrack[];
  onTrackComplete?: (trackId: string) => void;
}

export default function AudiobookPlayer({ 
  bookTitle, 
  coverImage, 
  tracks, 
  onTrackComplete 
}: AudiobookPlayerProps) {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrackData = tracks[currentTrack];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      if (onTrackComplete) {
        onTrackComplete(currentTrackData.id);
      }
      
      // Auto-play next track
      if (currentTrack < tracks.length - 1) {
        setCurrentTrack(currentTrack + 1);
      } else {
        setIsPlaying(false);
      }
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrack, tracks, currentTrackData.id, onTrackComplete]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.volume = isMuted ? 0 : volume / 100;
  }, [volume, isMuted]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.playbackRate = playbackRate;
  }, [playbackRate]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const skipTrack = (direction: 'forward' | 'backward') => {
    if (direction === 'forward' && currentTrack < tracks.length - 1) {
      setCurrentTrack(currentTrack + 1);
    } else if (direction === 'backward' && currentTrack > 0) {
      setCurrentTrack(currentTrack - 1);
    }
    setIsPlaying(false);
  };

  const seekTo = (time: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.currentTime = time;
    setCurrentTime(time);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const selectTrack = (index: number) => {
    setCurrentTrack(index);
    setIsPlaying(false);
    setShowPlaylist(false);
  };

  const getTrackTypeIcon = (type: string) => {
    switch (type) {
      case 'chapter': return '📚';
      case 'bonus': return '🎁';
      case 'extra': return '💫';
      default: return '🎵';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Main Player Card */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between">
            <span>{bookTitle}</span>
            <Badge variant="secondary" className="text-xs">
              {currentTrack + 1} of {tracks.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Cover Art and Track Info */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <img 
                src={coverImage} 
                alt={bookTitle}
                className="w-48 h-48 rounded-lg shadow-lg mx-auto md:mx-0"
              />
            </div>
            
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-1">
                  {getTrackTypeIcon(currentTrackData.type)} {currentTrackData.title}
                </h3>
                <p className="text-muted-foreground">
                  {currentTrackData.type === 'chapter' && currentTrackData.chapterNumber 
                    ? `Chapter ${currentTrackData.chapterNumber}`
                    : currentTrackData.type.charAt(0).toUpperCase() + currentTrackData.type.slice(1)
                  }
                </p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="relative">
                  <Progress 
                    value={(currentTime / duration) * 100} 
                    className="w-full h-2"
                  />
                  <input
                    type="range"
                    min="0"
                    max={duration}
                    value={currentTime}
                    onChange={(e) => seekTo(Number(e.target.value))}
                    className="absolute inset-0 w-full h-2 opacity-0 cursor-pointer"
                  />
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Playback Controls */}
              <div className="flex items-center justify-center space-x-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => skipTrack('backward')}
                  disabled={currentTrack === 0}
                >
                  <SkipBack className="h-4 w-4" />
                </Button>
                
                <Button
                  size="icon"
                  onClick={togglePlay}
                  className="h-12 w-12"
                >
                  {isPlaying ? 
                    <Pause className="h-6 w-6" /> : 
                    <Play className="h-6 w-6" />
                  }
                </Button>
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => skipTrack('forward')}
                  disabled={currentTrack === tracks.length - 1}
                >
                  <SkipForward className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Additional Controls */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between pt-4 border-t">
            {/* Volume Control */}
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-24 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <span className="text-sm text-muted-foreground w-8">{volume}%</span>
            </div>

            {/* Playback Speed */}
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <select 
                value={playbackRate}
                onChange={(e) => setPlaybackRate(Number(e.target.value))}
                className="bg-background border rounded px-2 py-1 text-sm"
              >
                <option value={0.75}>0.75x</option>
                <option value={1}>1x</option>
                <option value={1.25}>1.25x</option>
                <option value={1.5}>1.5x</option>
                <option value={2}>2x</option>
              </select>
            </div>

            {/* Playlist Toggle */}
            <Button
              variant="outline"
              onClick={() => setShowPlaylist(!showPlaylist)}
              className="flex items-center space-x-2"
            >
              <List className="h-4 w-4" />
              <span>Playlist</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Playlist */}
      {showPlaylist && (
        <Card>
          <CardHeader>
            <CardTitle>Track List</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
              <div className="space-y-2">
                {tracks.map((track, index) => (
                  <div
                    key={track.id}
                    className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      index === currentTrack 
                        ? 'bg-primary/10 border border-primary/20' 
                        : 'hover:bg-muted'
                    }`}
                    onClick={() => selectTrack(index)}
                  >
                    <div className="flex-shrink-0 w-8 text-center">
                      {index === currentTrack && isPlaying ? (
                        <div className="flex items-center justify-center">
                          <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">
                          {index + 1}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span>{getTrackTypeIcon(track.type)}</span>
                        <span className={`font-medium ${
                          index === currentTrack ? 'text-primary' : ''
                        }`}>
                          {track.title}
                        </span>
                      </div>
                      {track.duration && (
                        <span className="text-sm text-muted-foreground">
                          {track.duration}
                        </span>
                      )}
                    </div>

                    <Badge variant={
                      track.type === 'chapter' ? 'default' :
                      track.type === 'bonus' ? 'secondary' : 'outline'
                    }>
                      {track.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={currentTrackData ? `/audiobook/${currentTrackData.file}` : undefined}
        preload="metadata"
      />
    </div>
  );
}
