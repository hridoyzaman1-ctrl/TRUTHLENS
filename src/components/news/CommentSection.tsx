import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MessageSquare, ThumbsUp, Reply, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: Date;
  likes: number;
  replies?: Comment[];
}

// Mock comments for demonstration
const mockComments: Comment[] = [
  {
    id: '1',
    author: 'John Doe',
    content: 'This is a really insightful article. The research is thorough and well-presented.',
    createdAt: new Date('2026-01-13T10:00:00'),
    likes: 12,
    replies: [
      {
        id: '1-1',
        author: 'Jane Smith',
        content: 'I agree! The author did a great job covering all the key points.',
        createdAt: new Date('2026-01-13T12:00:00'),
        likes: 5
      }
    ]
  },
  {
    id: '2',
    author: 'Sarah Wilson',
    content: 'Great coverage of an important topic. Would love to see more follow-up stories on this.',
    createdAt: new Date('2026-01-12T15:00:00'),
    likes: 8
  }
];

interface CommentSectionProps {
  articleId: string;
}

export const CommentSection = ({ articleId }: CommentSectionProps) => {
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [newComment, setNewComment] = useState({ author: '', content: '' });
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.author.trim() || !newComment.content.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    const comment: Comment = {
      id: Date.now().toString(),
      author: newComment.author,
      content: newComment.content,
      createdAt: new Date(),
      likes: 0,
      replies: []
    };

    setComments([comment, ...comments]);
    setNewComment({ author: '', content: '' });
    toast.success('Comment posted successfully!');
  };

  const handleSubmitReply = (parentId: string) => {
    if (!replyContent.trim()) {
      toast.error('Please enter a reply');
      return;
    }

    const reply: Comment = {
      id: `${parentId}-${Date.now()}`,
      author: 'Guest User',
      content: replyContent,
      createdAt: new Date(),
      likes: 0
    };

    setComments(comments.map(comment => {
      if (comment.id === parentId) {
        return {
          ...comment,
          replies: [...(comment.replies || []), reply]
        };
      }
      return comment;
    }));

    setReplyingTo(null);
    setReplyContent('');
    toast.success('Reply posted successfully!');
  };

  const handleLike = (commentId: string, isReply: boolean = false, parentId?: string) => {
    setComments(comments.map(comment => {
      if (isReply && parentId && comment.id === parentId) {
        return {
          ...comment,
          replies: comment.replies?.map(reply =>
            reply.id === commentId ? { ...reply, likes: reply.likes + 1 } : reply
          )
        };
      }
      if (comment.id === commentId) {
        return { ...comment, likes: comment.likes + 1 };
      }
      return comment;
    }));
  };

  const CommentItem = ({ comment, isReply = false, parentId }: { comment: Comment; isReply?: boolean; parentId?: string }) => (
    <div className={`${isReply ? 'ml-8 mt-4' : ''}`}>
      <div className="flex gap-3">
        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
          <User className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-foreground">{comment.author}</span>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
            </span>
          </div>
          <p className="mt-1 text-sm text-foreground">{comment.content}</p>
          <div className="mt-2 flex items-center gap-4">
            <button
              onClick={() => handleLike(comment.id, isReply, parentId)}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              <ThumbsUp className="h-4 w-4" />
              {comment.likes > 0 && comment.likes}
            </button>
            {!isReply && (
              <button
                onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                <Reply className="h-4 w-4" />
                Reply
              </button>
            )}
          </div>

          {/* Reply Form */}
          {replyingTo === comment.id && (
            <div className="mt-4 flex gap-2">
              <Textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write a reply..."
                rows={2}
                className="flex-1"
              />
              <div className="flex flex-col gap-1">
                <Button size="sm" onClick={() => handleSubmitReply(comment.id)}>
                  Reply
                </Button>
                <Button size="sm" variant="outline" onClick={() => setReplyingTo(null)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="border-l-2 border-border pl-4 mt-4">
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} isReply parentId={comment.id} />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="border-t border-border pt-8 mt-8">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="h-5 w-5 text-primary" />
        <h3 className="font-display text-xl font-bold text-foreground">
          Comments ({comments.length})
        </h3>
      </div>

      {/* Comment Form */}
      <form onSubmit={handleSubmitComment} className="mb-8 p-4 rounded-xl bg-muted/50">
        <h4 className="font-medium text-foreground mb-4">Leave a Comment</h4>
        <div className="space-y-4">
          <div>
            <Label htmlFor="author">Name</Label>
            <Input
              id="author"
              value={newComment.author}
              onChange={(e) => setNewComment({ ...newComment, author: e.target.value })}
              placeholder="Your name"
              required
            />
          </div>
          <div>
            <Label htmlFor="content">Comment</Label>
            <Textarea
              id="content"
              value={newComment.content}
              onChange={(e) => setNewComment({ ...newComment, content: e.target.value })}
              placeholder="Share your thoughts..."
              rows={4}
              required
            />
          </div>
          <Button type="submit">Post Comment</Button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>

      {comments.length === 0 && (
        <p className="text-center text-muted-foreground py-8">
          No comments yet. Be the first to share your thoughts!
        </p>
      )}
    </div>
  );
};
