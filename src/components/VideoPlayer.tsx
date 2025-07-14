"use client";

import type { Video } from '@/lib/types';
import { useState, useMemo } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { PlayCircle } from 'lucide-react';

interface VideoPlayerProps {
  videos: Video[];
  movieTitle: string;
}

const getEmbedUrl = (video: Video) => {
    if (!video || !video.key) return null;
    if (video.site === 'YouTube') {
        return `https://www.youtube.com/embed/${video.key}`;
    }
    if (video.url && video.url.includes('youtube.com/watch?v=')) {
        const key = video.url.split('v=')[1];
        return `https://www.youtube.com/embed/${key}`;
    }
    return video.url; // Fallback
};

export function VideoPlayer({ videos, movieTitle }: VideoPlayerProps) {
  // Prioritize trailers, then clips, then the first video
  const initialVideo = useMemo(() => {
    return (
      videos.find((v) => v.type === 'Trailer') ||
      videos.find((v) => v.type === 'Clip') ||
      videos[0]
    );
  }, [videos]);

  const [selectedVideo, setSelectedVideo] = useState<Video>(initialVideo);

  const selectedEmbedUrl = getEmbedUrl(selectedVideo);

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-headline font-bold mb-6">Videos Related to {movieTitle}</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {selectedEmbedUrl ? (
            <>
              <div className="aspect-video mb-2 bg-black rounded-lg">
                <iframe
                  key={selectedVideo.key} // Add key to force re-render
                  src={selectedEmbedUrl}
                  title={selectedVideo.name}
                  className="w-full h-full rounded-lg"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <h3 className="font-semibold text-lg">{selectedVideo.name}</h3>
              <p className="text-sm text-muted-foreground">{selectedVideo.type}</p>
            </>
          ) : (
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
              <p>Video not available.</p>
            </div>
          )}
        </div>
        <div className="lg:col-span-1">
          <ScrollArea className="h-[27rem] pr-4 border rounded-lg">
            <div className="flex flex-col">
              {videos.map((video, index) => (
                <button
                  key={video.key || video.url}
                  onClick={() => setSelectedVideo(video)}
                  className={cn(
                    "flex items-center gap-4 p-3 text-left transition-colors w-full",
                    selectedVideo.key === video.key ? "bg-accent" : "hover:bg-accent/50",
                    index !== 0 && "border-t"
                  )}
                >
                  <div className="relative w-12 h-12 bg-muted rounded-md shrink-0 flex items-center justify-center">
                     <PlayCircle className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-semibold text-sm leading-tight line-clamp-2">{video.name}</h4>
                    <p className="text-xs text-muted-foreground">{video.type}</p>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
