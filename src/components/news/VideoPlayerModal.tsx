import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

interface VideoPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  title: string;
}

export const VideoPlayerModal = ({ isOpen, onClose, videoUrl, title }: VideoPlayerModalProps) => {
  // Convert YouTube URL to embed format if needed
  const getEmbedUrl = (url: string) => {
    if (url.includes('youtube.com/watch')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    }
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    }
    if (url.includes('youtube.com/embed')) {
      return url.includes('autoplay') ? url : `${url}?autoplay=1`;
    }
    return url;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-[95vw] p-0 bg-black border-none overflow-hidden">
        <VisuallyHidden>
          <DialogTitle>{title}</DialogTitle>
        </VisuallyHidden>
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
          <div className="aspect-video w-full">
            <iframe
              src={getEmbedUrl(videoUrl)}
              title={title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div className="p-4 bg-card">
            <h3 className="font-display font-semibold text-foreground line-clamp-2">
              {title}
            </h3>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
