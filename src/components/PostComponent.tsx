import React from "react";

type Post = {
  id: number;
  title: string;
  body: string;
  userId: number;
  reactions: {
    likes: number;
    dislikes: number;
  };
  tags: string[];
  views?: number;
};

type PostComponentProps = {
  post: Post;
};

const PostComponent: React.FC<PostComponentProps> = ({ post }) => {
  return (
    <div className="post bg-white rounded-lg shadow-md p-4 mb-4 max-w-2xl mx-auto">
      {/* Post Header */}
      <div className="post-header mb-3">
        <h2 className="text-xl font-semibold text-gray-800">{post.title}</h2>
        <p className="text-xs text-gray-500">User ID: {post.userId}</p>
      </div>

      {/* Post Content */}
      <div className="post-content mb-3">
        <p className="text-gray-800">{post.body}</p>
      </div>

      {/* Tags */}
      <div className="tags flex flex-wrap gap-2 mb-3">
        {post.tags.map((tag, index) => (
          <span
            key={index}
            className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Reactions and Views */}
      <div className="post-stats flex justify-between text-sm text-gray-500 border-t pt-2">
        <div className="reactions flex gap-4">
          <span className="flex items-center">👍 {post.reactions.likes}</span>
          <span className="flex items-center">
            👎 {post.reactions.dislikes}
          </span>
        </div>
        <div className="views">👁️ {post.views || 0} views</div>
      </div>
    </div>
  );
};

export default PostComponent;
