import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function PostDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const fetchPost = async () => {
    try {
      const res = await fetch(`http://localhost:3128/family/fetch-single-post/${id}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (res.ok) {
        setPost(data.post);
        setComments([...comments,...data.post.comments])
      }
    } catch (error) {
      console.error("Failed to fetch post:", error);
    }
  };
  useEffect(() => {
    fetchPost();
  }, []);

  const handleLike = () => setLiked(!liked);

  const sendComment = async () => {
   try {
     const res = await fetch(`http://localhost:3128/comment/${id}`, {
       method: "POST",
       credentials: "include",
       body: JSON.stringify({"commentText":newComment}),
       headers: { "Content-Type": "application/json" },
     });
   } catch (error) {
     console.error("Failed to fetch post:", error);
   }
 };
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    sendComment()
    setComments([...comments,newComment])
    setNewComment("");
  };

  const handleDelete = async (commentId) =>{
     try {
     const res = await fetch(`http://localhost:3128/delete-comment/${id}/${commentId}`, {
       method: "POST",
       credentials: "include",
       headers: { "Content-Type": "application/json" },
       
     });
     if(res.ok){
        window.location.reload();
     };
     
   } catch (error) {
     console.error("Failed to fetch post:", error);
   }

  }

  if (!post) {
    return <p>Loading post...</p>;
  }

  return (
    <div className="text-black max-w-xl mx-auto mt-10 p-4 border rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-2">{post.text || "Untitled Post"}</h1>
      <p>posted by: <b className="text-sm italic">{post.member_name}</b></p>
      <p className="text-gray-600 text-sm mb-4">{new Date(post.createdAt).toLocaleDateString()}</p>

      {post.media && (
        <div className="mb-4">
          {post.media.type === "video" ? (
            <video controls src={post.media.url} className="w-full rounded" />
          ) : (
            <img src={post.media[0].url} alt="Post Media" className="w-full rounded" />
          )}
        </div>
      )}
      <p className="italic">Description:</p>
      {post.description && (
        <p className="text-gray-800 mb-4 whitespace-pre-line">&nbsp;&nbsp;{post.description}</p>
      )}

      {post.author && (
        <p className="text-gray-700 font-semibold mb-4">Posted by: {post.author}</p>
      )}

      <div className="mb-6">
        {/* <button
          onClick={handleLike}
          className={`px-4 py-2 rounded ${liked ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          {liked ? "Liked" : "Like"}
        </button> */}
      </div>

      <div className="mb-4">
        <h2 className="font-semibold mb-2">Comments</h2>
        {comments.length === 0 ? (
          <p className="text-sm text-gray-500">No comments yet.</p>
        ) : (
          <ul className="space-y-2">
            {comments.map((comment, index) => (
              <li key={index} className="bg-gray-100 p-2 rounded text-black">
                {comment.text||comment} <span className="float-right text-red-700 cursor-pointer" onClick={()=>handleDelete(comment._id)}>{comment.name?<p>delete</p>:''}</span><p className="text-[.8rem] text-gray-500 my-1">~{comment.name||"YOU"}</p>
              </li>
       
            ))}
          </ul>
        )}
      </div>

      <form onSubmit={handleCommentSubmit} className="flex gap-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 border px-3 py-2 rounded"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Post
        </button>
      </form>

      <button
        onClick={() => navigate(-1)}
        className="mt-6 text-blue-500 underline text-sm"
      >
        Go Back
      </button>
    </div>
  );
}
