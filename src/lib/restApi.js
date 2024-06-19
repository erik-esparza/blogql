import axios from "axios";

const BASE_URL = "http://revenuehunt.local/wp-json/wp/v2";

/**
 * Fetch media items using REST API.
 */
export const fetchMediaItems = async (token) => {
  if (!token) throw new Error("Token is not defined");
  try {
    const response = await axios.get(`${BASE_URL}/media`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching media items:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

/**
 * Get the REST API post ID for a post created via GraphQL.
 */
export const getRestPostId = async (title, token) => {
  if (!token) throw new Error("Token is not defined");
  try {
    const response = await axios.get(`${BASE_URL}/posts`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        search: title,
      },
    });
    const post = response.data.find((p) => p.title.rendered === title);
    return post ? post.id : null;
  } catch (error) {
    console.error(
      "Error fetching post ID:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

/**
 * Set the featured image for a post using REST API.
 */
export const setFeaturedImage = async (restPostId, mediaId, token) => {
  if (!token) throw new Error("Token is not defined");
  try {
    const response = await axios.post(
      `${BASE_URL}/posts/${restPostId}`,
      { featured_media: mediaId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error setting featured image:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};
