import React, { useState } from 'react';
import {
  ThumbsUp,
  MessageSquare,
  Share2,
  Send,
  Sparkles,
  TrendingUp,
  UserPlus,
  Check,
  Clock,
  MoreHorizontal,
  Bookmark,
  ExternalLink,
  Briefcase,
  Zap,
} from 'lucide-react';
import { useCareer } from '../../context/CareerContext';

interface NetworkFeedProps {
  onOpenShare: () => void;
}

export const NetworkFeed: React.FC<NetworkFeedProps> = ({ onOpenShare }) => {
  const {
    profile,
    posts,
    createPost,
    toggleLikePost,
    addCommentToPost,
    networkContacts,
    toggleConnect,
    setCurrentMode,
    atsBreakdown,
  } = useCareer();

  const [newPostContent, setNewPostContent] = useState('');
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState<{ [postId: string]: string }>({});

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;
    createPost(newPostContent);
    setNewPostContent('');
  };

  const handleAddComment = (postId: string) => {
    const text = commentInput[postId];
    if (!text || !text.trim()) return;
    addCommentToPost(postId, text);
    setCommentInput((prev) => ({ ...prev, [postId]: '' }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Profile Snapshot Card & ATS Health */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="h-20 bg-gradient-to-r from-blue-700 via-indigo-700 to-cyan-600 relative">
              <img
                src={profile.bannerUrl}
                alt="Profile Banner"
                className="w-full h-full object-cover opacity-30"
              />
            </div>
            <div className="px-5 pb-5 pt-0 relative">
              <div className="-mt-10 mb-3 flex justify-between items-end">
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-16 h-16 rounded-full object-cover ring-4 ring-slate-900 shadow-md"
                />
                <button
                  onClick={() => setCurrentMode('linkedin_profile')}
                  className="text-xs font-medium text-blue-400 hover:text-blue-300 transition"
                >
                  Edit Profile
                </button>
              </div>
              <h3 className="font-bold text-white text-base leading-tight">{profile.name}</h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">{profile.headline}</p>

              {/* Profile Metrics */}
              <div className="mt-4 pt-4 border-t border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Profile views</span>
                  <span className="font-semibold text-blue-400 font-mono">{profile.profileViews.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Post impressions</span>
                  <span className="font-semibold text-blue-400 font-mono">{profile.postImpressions.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Search appearances</span>
                  <span className="font-semibold text-blue-400 font-mono">{profile.searchAppearances.toLocaleString()}</span>
                </div>
              </div>

              {/* ATS Resume Quick Score Card */}
              <div className="mt-4 p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-300">Live ATS Resume Score</span>
                  <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded ${
                    atsBreakdown.totalScore >= 90 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-blue-500/20 text-blue-300'
                  }`}>
                    {atsBreakdown.totalScore}/100
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">Ready for automated applicant tracking systems.</p>
                <button
                  onClick={() => setCurrentMode('ats_checker')}
                  className="w-full mt-2.5 py-1.5 px-2 bg-blue-600/10 hover:bg-blue-600/20 text-blue-300 border border-blue-500/30 rounded-lg text-xs font-medium transition flex items-center justify-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Open ATS Resume Lab</span>
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* CENTER COLUMN: Post Composer & Social Feed */}
        <div className="lg:col-span-6 space-y-5">
          
          {/* Post Composer */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
            <div className="flex gap-3">
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-10 h-10 rounded-full object-cover shrink-0 ring-1 ring-slate-700"
              />
              <div className="flex-1">
                <textarea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="Share a career achievement, engineering insight, or hiring update..."
                  rows={3}
                  className="w-full bg-slate-950 text-slate-100 placeholder-slate-500 text-xs p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/40 resize-none transition"
                />
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-800/80">
                  <div className="flex gap-1.5 text-xs text-slate-400">
                    <span className="text-[11px] text-slate-500 hidden sm:inline">Add tags:</span>
                    <button
                      type="button"
                      onClick={() => setNewPostContent((p) => p + ' #TechCareers')}
                      className="text-[11px] text-blue-400 hover:text-blue-300"
                    >
                      #TechCareers
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewPostContent((p) => p + ' #AI')}
                      className="text-[11px] text-blue-400 hover:text-blue-300"
                    >
                      #AI
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewPostContent((p) => p + ' #DistributedSystems')}
                      className="text-[11px] text-blue-400 hover:text-blue-300"
                    >
                      #DistributedSystems
                    </button>
                  </div>
                  <button
                    onClick={handlePostSubmit}
                    disabled={!newPostContent.trim()}
                    className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:hover:bg-blue-600 text-white text-xs font-semibold rounded-lg transition shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Post</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Feed Posts */}
          <div className="space-y-4">
            {posts.map((post) => (
              <article
                key={post.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3.5"
              >
                {/* Author Info */}
                <div className="flex items-start justify-between">
                  <div className="flex gap-3">
                    <img
                      src={post.authorAvatar}
                      alt={post.authorName}
                      className="w-10 h-10 rounded-full object-cover shrink-0 ring-1 ring-slate-800"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-white hover:text-blue-400 transition cursor-pointer">
                        {post.authorName}
                      </h4>
                      <p className="text-[11px] text-slate-400 leading-tight">{post.authorRole}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{post.timestamp} · 🌐</p>
                    </div>
                  </div>
                  <button
                    onClick={onOpenShare}
                    className="p-1.5 text-slate-500 hover:text-slate-300 rounded-lg hover:bg-slate-800 transition"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Content */}
                <p className="text-xs text-slate-200 whitespace-pre-line leading-relaxed">
                  {post.content}
                </p>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {post.tags.map((tag, idx) => (
                      <span key={idx} className="text-[11px] font-medium text-blue-400 hover:underline cursor-pointer">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Post Metrics Bar */}
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800/80">
                  <span className="flex items-center gap-1">
                    <span className="w-4 h-4 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-[10px]">👍</span>
                    {post.likesCount} likes
                  </span>
                  <div className="flex gap-3">
                    <span>{post.commentsCount} comments</span>
                    <span>{post.sharesCount} reposts</span>
                  </div>
                </div>

                {/* Action Buttons: Like, Comment, Repost, Share */}
                <div className="grid grid-cols-3 gap-1 pt-1 border-t border-slate-800">
                  <button
                    onClick={() => toggleLikePost(post.id)}
                    className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition ${
                      post.userLiked
                        ? 'text-blue-400 bg-blue-500/10'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span>{post.userLiked ? 'Liked' : 'Like'}</span>
                  </button>

                  <button
                    onClick={() =>
                      setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)
                    }
                    className="flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Comment</span>
                  </button>

                  <button
                    onClick={onOpenShare}
                    className="flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                </div>

                {/* Comments Section */}
                {(activeCommentPostId === post.id || post.comments.length > 0) && (
                  <div className="pt-3 border-t border-slate-800 space-y-3">
                    
                    {/* Add Comment Input */}
                    <div className="flex gap-2">
                      <img
                        src={profile.avatar}
                        alt={profile.name}
                        className="w-7 h-7 rounded-full object-cover shrink-0"
                      />
                      <div className="flex-1 flex gap-1.5">
                        <input
                          type="text"
                          value={commentInput[post.id] || ''}
                          onChange={(e) =>
                            setCommentInput((prev) => ({ ...prev, [post.id]: e.target.value }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleAddComment(post.id);
                          }}
                          placeholder="Add a constructive insight..."
                          className="flex-1 bg-slate-950 text-slate-200 placeholder-slate-500 text-xs px-3 py-1.5 rounded-lg border border-slate-800 focus:outline-none focus:border-blue-500/60"
                        />
                        <button
                          onClick={() => handleAddComment(post.id)}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-lg transition"
                        >
                          Send
                        </button>
                      </div>
                    </div>

                    {/* Existing Comments List */}
                    {post.comments.map((comment) => (
                      <div key={comment.id} className="flex gap-2.5 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/60">
                        <img
                          src={comment.authorAvatar}
                          alt={comment.authorName}
                          className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-semibold text-slate-200">{comment.authorName}</span>
                            <span className="text-[10px] text-slate-500">{comment.timestamp}</span>
                          </div>
                          <p className="text-[10px] text-slate-400">{comment.authorRole}</p>
                          <p className="text-xs text-slate-300 mt-1">{comment.text}</p>
                        </div>
                      </div>
                    ))}

                  </div>
                )}

              </article>
            ))}
          </div>

        </div>

        {/* RIGHT COLUMN: Network Connections & Trending Career Intelligence */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Suggested Connections */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">People in Your Network</h4>
              <span className="text-[11px] text-blue-400 cursor-pointer hover:underline">View All</span>
            </div>
            <div className="space-y-3.5">
              {networkContacts.map((contact) => (
                <div key={contact.id} className="flex items-start justify-between gap-2.5">
                  <div className="flex gap-2.5 min-w-0">
                    <img
                      src={contact.avatar}
                      alt={contact.name}
                      className="w-9 h-9 rounded-full object-cover shrink-0 ring-1 ring-slate-800"
                    />
                    <div className="min-w-0">
                      <h5 className="text-xs font-semibold text-white truncate">{contact.name}</h5>
                      <p className="text-[11px] text-slate-400 truncate">{contact.role}</p>
                      <p className="text-[10px] text-slate-500">{contact.mutualConnections} mutual connections</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleConnect(contact.id)}
                    className={`shrink-0 px-2.5 py-1 text-xs font-medium rounded-lg border transition flex items-center gap-1 ${
                      contact.isConnected
                        ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                        : contact.connectionPending
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                        : 'bg-blue-600/10 border-blue-500/40 text-blue-400 hover:bg-blue-600/20'
                    }`}
                  >
                    {contact.isConnected ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>Connected</span>
                      </>
                    ) : contact.connectionPending ? (
                      <>
                        <Clock className="w-3 h-3" />
                        <span>Pending</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-3 h-3" />
                        <span>Connect</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Trending Career Topics */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
              <span>Trending in Tech Careers</span>
            </h4>
            <div className="space-y-2.5 text-xs">
              <div className="group cursor-pointer">
                <p className="font-semibold text-slate-200 group-hover:text-blue-400 transition">Workday ATS Keyword Parser Update</p>
                <p className="text-[11px] text-slate-500">2,840 discussions · ATS optimization</p>
              </div>
              <div className="group cursor-pointer">
                <p className="font-semibold text-slate-200 group-hover:text-blue-400 transition">AI Infrastructure & GPU Orchestration Surge</p>
                <p className="text-[11px] text-slate-500">4,120 discussions · High demand</p>
              </div>
              <div className="group cursor-pointer">
                <p className="font-semibold text-slate-200 group-hover:text-blue-400 transition">STAR-Method Behavioral Screens at FAANG</p>
                <p className="text-[11px] text-slate-500">1,940 discussions · Interview prep</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
