import { gql } from "@apollo/client";

export const GET_POSTS = gql`
  query GetPosts {
    posts {
      nodes {
        id
        title
        uri
        content
        date
        author {
          node {
            name
          }
        }
        featuredImage {
          node {
            sourceUrl
          }
        }
        tags {
          nodes {
            id
            name
          }
        }
      }
    }
  }
`;

export const GET_MEDIA_ITEMS = gql`
  query GetMediaItems {
    mediaItems {
      edges {
        cursor
        node {
          id
          title
          altText
          sourceUrl
        }
      }
    }
  }
`;

export const CREATE_POST = gql`
  mutation CreatePost(
    $title: String!
    $content: String!
    $status: PostStatusEnum!
    $tags: PostTagsInput!
  ) {
    createPost(
      input: { title: $title, content: $content, status: $status, tags: $tags }
    ) {
      post {
        id
        title
        content
        status
        tags {
          nodes {
            id
            name
          }
        }
        featuredImage {
          node {
            id
            sourceUrl
          }
        }
      }
    }
  }
`;

export const DELETE_POST = gql`
  mutation DeletePost($id: ID!) {
    deletePost(input: { id: $id }) {
      deletedId
    }
  }
`;

export const UPDATE_POST = gql`
  mutation UpdatePost(
    $id: ID!
    $title: String!
    $content: String!
    $tags: PostTagsInput!
  ) {
    updatePost(
      input: { id: $id, title: $title, content: $content, tags: $tags }
    ) {
      post {
        id
        title
        content
        tags {
          nodes {
            id
            name
          }
        }
        featuredImage {
          node {
            id
            sourceUrl
          }
        }
      }
    }
  }
`;
