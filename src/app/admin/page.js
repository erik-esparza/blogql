"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  CREATE_POST,
  GET_POSTS,
  DELETE_POST,
  UPDATE_POST,
} from "../../lib/queries";
import {
  fetchMediaItems,
  setFeaturedImage,
  getRestPostId,
} from "../../lib/restApi";

export default function AdminPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [selectedImageId, setSelectedImageId] = useState(null);
  const [mediaItems, setMediaItems] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const [token, setToken] = useState(
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vcmV2ZW51ZWh1bnQubG9jYWwiLCJpYXQiOjE3MTgzMjQzNjIsIm5iZiI6MTcxODMyNDM2MiwiZXhwIjoxNzE4OTI5MTYyLCJkYXRhIjp7InVzZXIiOnsiaWQiOiIxIn19fQ.qMtUZEk9M8pNpnE2Q1JEPgCqpGMImz62pySh6lZvd4M"
  );

  const { loading, error, data, refetch } = useQuery(GET_POSTS);
  const [createPost] = useMutation(CREATE_POST, {
    onCompleted: async (data) => {
      const graphQlPostTitle = data.createPost.post.title;
      const restPostId = await getRestPostId(graphQlPostTitle, token);
      if (selectedImageId && restPostId) {
        await setFeaturedImage(restPostId, selectedImageId, token);
        refetch();
      }
    },
    onError: (error) => console.error("Error creating post:", error),
  });
  const [deletePost] = useMutation(DELETE_POST, {
    onCompleted: () => refetch(),
    onError: (error) => console.error("Error deleting post:", error),
  });
  const [updatePost] = useMutation(UPDATE_POST, {
    onCompleted: async (data) => {
      const graphQlPostTitle = data.updatePost.post.title;
      const restPostId = await getRestPostId(graphQlPostTitle, token);
      if (editingPost.selectedImageId && restPostId) {
        await setFeaturedImage(restPostId, editingPost.selectedImageId, token);
        refetch();
      }
    },
    onError: (error) => console.error("Error updating post:", error),
  });

  useEffect(() => {
    const getMedia = async () => {
      const media = await fetchMediaItems(token);
      setMediaItems(media);
    };
    if (token) getMedia();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tagsArray = tags.split(",").map((tag) => ({ name: tag.trim() }));

    try {
      await createPost({
        variables: {
          title,
          content,
          status: "PUBLISH",
          tags: { append: true, nodes: tagsArray },
        },
      });
      setTitle("");
      setContent("");
      setTags("");
      setSelectedImageId(null);
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deletePost({ variables: { id } });
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleEdit = (post) => {
    setEditingPost({
      ...post,
      tags: post.tags.nodes.map((tag) => tag.name).join(", "),
      selectedImageId: post.featuredImage?.node?.id,
    });
  };

  const handleSave = async (id) => {
    const tagsArray = editingPost.tags
      .split(",")
      .map((tag) => ({ name: tag.trim() }));

    try {
      await updatePost({
        variables: {
          id,
          title: editingPost.title,
          content: editingPost.content,
          tags: { append: true, nodes: tagsArray },
        },
      });
      setEditingPost(null);
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Admin Interface - Create a New Post
      </h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="title"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="content"
          >
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows="10"
            required
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="tags"
          >
            Tags (comma separated)
          </label>
          <input
            type="text"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="image"
          >
            Featured Image
          </label>
          <select
            id="image"
            value={selectedImageId}
            onChange={(e) => setSelectedImageId(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">Select an image</option>
            {mediaItems.map((image) => (
              <option key={image.id} value={image.id}>
                {image.title.rendered}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Submit
        </button>
      </form>
      <h2 className="text-xl font-bold mb-4">Posts</h2>
      <ul>
        {data.posts.nodes.map((post) => (
          <li
            key={post.id}
            className="mb-4 p-4 border rounded flex justify-between items-center"
          >
            {editingPost && editingPost.id === post.id ? (
              <div className="flex-grow">
                <input
                  type="text"
                  value={editingPost.title}
                  onChange={(e) =>
                    setEditingPost({ ...editingPost, title: e.target.value })
                  }
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
                />
                <textarea
                  value={editingPost.content}
                  onChange={(e) =>
                    setEditingPost({ ...editingPost, content: e.target.value })
                  }
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
                  rows="4"
                />
                <input
                  type="text"
                  value={editingPost.tags}
                  onChange={(e) =>
                    setEditingPost({ ...editingPost, tags: e.target.value })
                  }
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
                  placeholder="Tags (comma separated)"
                />
                <select
                  id="editImage"
                  value={editingPost.selectedImageId}
                  onChange={(e) =>
                    setEditingPost({
                      ...editingPost,
                      selectedImageId: e.target.value,
                    })
                  }
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
                >
                  <option value="">Select an image</option>
                  {mediaItems.map((image) => (
                    <option key={image.id} value={image.id}>
                      {image.title.rendered}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => handleSave(post.id)}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="flex-grow">
                <h3 className="text-lg font-semibold">{post.title}</h3>
                <p>{post.content}</p>
                {post.tags.nodes.length > 0 && (
                  <div className="mt-2">
                    {post.tags.nodes.map((tag) => (
                      <span
                        key={tag.id}
                        className="inline-block bg-gray-200 text-gray-700 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                )}
                {post.featuredImage && (
                  <div className="mt-2">
                    <img
                      src={post.featuredImage.node.sourceUrl}
                      alt="Featured"
                      className="w-64 h-64 object-cover"
                    />
                  </div>
                )}
              </div>
            )}
            <div className="flex-shrink-0 ml-4">
              {!editingPost || editingPost.id !== post.id ? (
                <button
                  onClick={() => handleEdit(post)}
                  className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
                >
                  Edit
                </button>
              ) : null}
              <button
                onClick={() => handleDelete(post.id)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Trash
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
