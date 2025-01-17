import React, { useState, useEffect } from 'react';
import { ComponentConfig } from "@measured/puck";
import { LemmyHttp } from 'lemmy-js-client';
import { User, MessageCircle } from 'lucide-react';

export interface LemmyCommentsProps {
  postId: number;
  instanceUrl?: string;
}

export const LemmyComments: ComponentConfig<LemmyCommentsProps> = {
  fields: {
    postId: { 
      type: "number", 
      label: "Lemmy Post ID" 
    },
    instanceUrl: { 
      type: "text", 
      label: "Lemmy Instance URL", 
      defaultValue: "https://lemmy.world" 
    }
  },
  render: ({ postId, instanceUrl = "https://lemmy.world" }) => {
    const [comments, setComments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      if (!postId) return;

      const client = new LemmyHttp(instanceUrl);

      const fetchComments = async () => {
        try {
          setLoading(true);
          const commentsResponse = await client.getComments({
            post_id: postId,
            max_depth: 8,
            type_: 'All',
            sort: 'Top'
          });

          setComments(commentsResponse.comments);
          setLoading(false);
        } catch (err) {
          console.error('Failed to fetch comments:', err);
          setError('Failed to load comments');
          setLoading(false);
        }
      };

      fetchComments();
    }, [postId, instanceUrl]);

    // Recursive comment rendering function
    const renderComments = (comments: any[], parentId: number | null = null) => {
      return comments
        .filter(comment => comment.parent_id === parentId)
        .map(comment => (
          <div 
            key={comment.id} 
            className="bg-adaptive-primary/10 p-4 rounded-lg my-2 ml-4 border border-adaptive-primary/20"
          >
            <div className="flex items-center mb-2">
              {comment.creator_avatar_url ? (
                <img 
                  src={comment.creator_avatar_url} 
                  alt={comment.creator_name} 
                  className="w-8 h-8 rounded-full mr-2 object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full mr-2 bg-adaptive-accent/20 flex items-center justify-center">
                  <User className="w-4 h-4 text-adaptive-accent" />
                </div>
              )}
              <span className="font-bold text-sm">{comment.creator_name}</span>
            </div>
            <p className="text-adaptive-secondary">{comment.content}</p>
            <div className="pl-4">
              {renderComments(comments, comment.id)}
            </div>
          </div>
        ));
    };

    if (loading) {
      return (
        <div className="flex items-center justify-center py-8">
          <MessageCircle className="animate-pulse text-adaptive-accent" />
          <span className="ml-2 text-adaptive-secondaryAlt">Loading comments...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-red-500 p-4 bg-red-50 rounded-lg">
          {error}
        </div>
      );
    }

    return (
      <div className="comments-section mt-8 max-w-4xl mx-auto px-4">
        <h3 className="text-2xl font-bold mb-4 flex items-center">
          <MessageCircle className="mr-2 text-adaptive-accent" />
          Comments
        </h3>
        {comments.length === 0 ? (
          <p className="text-adaptive-secondaryAlt italic">No comments yet</p>
        ) : (
          <div className="space-y-4">
            {renderComments(comments)}
          </div>
        )}
      </div>
    );
  }
};