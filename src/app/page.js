"use client";

import { useQuery } from "@apollo/client";
import { GET_POSTS } from "../lib/queries";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import parse from "html-react-parser";

export default function HomePage() {
  const { loading, error, data } = useQuery(GET_POSTS);
  const [selectedTag, setSelectedTag] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      document.body.classList.add("bg-[#212121]", "text-white");
      document.body.classList.remove("bg-white", "text-black");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.add("bg-white", "text-black");
      document.body.classList.remove("bg-[#212121]", "text-white");
    }

    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShowScrollToTop(true);
      } else {
        setShowScrollToTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isDarkMode]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const scrollToBottom = () => {
    bottomRef.current.scrollIntoView({ behavior: "smooth" });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const posts = data.posts.nodes;

  // Sort posts by date for the latest posts section
  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  // Get the first post for the large singular post
  const firstPost = sortedPosts[0];

  // Get the latest three posts excluding the first post
  const latestPosts = sortedPosts.slice(1, 4);

  const uniqueTags = [
    ...new Set(posts.flatMap((post) => post.tags.nodes.map((tag) => tag.name))),
  ];

  const filteredPosts = selectedTag
    ? posts.filter((post) =>
        post.tags.nodes.some((tag) => tag.name === selectedTag)
      )
    : posts;

  const handleTagClick = (tag) => {
    setSelectedTag(tag);
    scrollToBottom();
  };

  return (
    <div
      className={`w-full h-full min-h-screen px-10 pt-7 ${
        isDarkMode
          ? "bg-[#212121] text-white"
          : "bg-white gradient-background text-black"
      }`}
    >
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="z-50 fixed bottom-4 right-4 p-2 bg-gray-600 text-white rounded-full shadow-lg"
        aria-label="Toggle dark mode"
      >
        {isDarkMode ? "☀️" : "🌙"}
      </button>

      {/* Scroll to Top Button */}
      {showScrollToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-4 left-4 p-2 bg-gray-600 text-white rounded-full shadow-lg"
          aria-label="Scroll to top"
        >
          ↑
        </button>
      )}

      {/* Floating Chat Widget */}
      <div
        onClick={() => (window.location.href = "https://docs.revenuehunt.com")}
        className="fixed bottom-4 z-50 left-4 p-2 bg-sky-500 bg-opacity-70 text-white rounded-full shadow-lg cursor-pointer hover:bg-opacity-90"
        style={{ borderRadius: "25px 25px 25px 0" }}
      >
        Have any questions? Visit our docs!
      </div>

      {/* Flex Container for Main Post and PDF Download */}
      <div className="w-full flex flex-col md:flex-row items-center mb-8 gap-8">
        {/* Large Singular Post */}
        <div
          className={`flex-3 p-4 w-full lg:w-2/3 gap-8 flex flex-col lg:flex-row rounded-lg shadow-lg hover-effect ${
            isDarkMode ? "bg-[#323232]" : "bg-gray-100"
          }`}
        >
          {firstPost.featuredImage && (
            <div className="relative w-full lg:w-1/2 h-64">
              <Image
                src={firstPost.featuredImage.node.sourceUrl}
                alt="Featured"
                layout="fill"
                objectFit="cover"
                className="rounded-lg mb-4"
              />
            </div>
          )}
          <div className="w-full lg:w-1/2 flex flex-col justify-between h-full lg:ml-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">{firstPost.title}</h2>
              <div className="mb-4">
                {parse(firstPost.content.substring(0, 200))}...
              </div>
            </div>
            <div className="text-sm flex flex-wrap">
              {firstPost.tags.nodes.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => handleTagClick(tag.name)}
                  className={`px-2 py-1 m-1 rounded-full ${
                    selectedTag === tag.name
                      ? "bg-black text-white"
                      : "bg-gray-200 text-black"
                  }`}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>
        </div>
        {/* Sign Up to Download PDF */}
        <div
          className={`flex-2 p-4 min-w-min md:w-1/4 self-start rounded-lg shadow-lg hover-effect ${
            isDarkMode ? "bg-[#313131]" : "bg-gray-100"
          }`}
        >
          <h3 className="text-xl font-bold mb-4">
            Join our newsletter, receive the latest tips & tricks
          </h3>
          <p className={`mb-4 ${isDarkMode ? "text-white" : "text-black"}`}>
            Join 4,500+ customers receiving bi-monthly information about our
            app, how to use quizzes and the best tips & tricks for your
            ecommerce.
          </p>
          <form className="flex flex-col md:flex-row items-center">
            <input
              type="email"
              placeholder="Enter your email"
              className="p-2 rounded-lg mb-4 md:mb-0 md:mr-4 flex-1"
            />
            <button
              type="submit"
              className="p-2 bg-blue-500 text-white rounded-lg hover-effect"
            >
              Download
            </button>
          </form>
        </div>
      </div>

      {/* Latest Posts */}
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4">Latest Posts</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {latestPosts.map((post) => (
            <Link key={post.id} href={post.uri} passHref>
              <div
                className={`rounded-lg overflow-hidden shadow-lg block cursor-pointer h-full hover-effect ${
                  isDarkMode ? "bg-[#313131]" : "bg-gray-100"
                }`}
              >
                {post.featuredImage && (
                  <div className="relative w-full h-64">
                    <Image
                      src={post.featuredImage.node.sourceUrl}
                      alt="Featured"
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                )}
                <div className="p-4 flex flex-col justify-between h-full">
                  <div>
                    <h2 className="text-lg font-bold mb-2">{post.title}</h2>
                    <div className="mb-2">
                      {parse(post.content.substring(0, 100))}...
                    </div>
                  </div>
                  <div className="text-sm mt-auto">
                    <span>{post.author.node.name}</span> |{" "}
                    <span>{new Date(post.date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Static Banner for Partners Section */}
      <div
        className={`mb-8 p-4 rounded-lg shadow-lg hover-effect ${
          isDarkMode ? "bg-[#313131]" : "bg-gray-100"
        }`}
      >
        <h3 className="text-xl font-bold mb-4">Partners</h3>
        <div className="flex flex-col items-center justify-center text-center">
          <p className="mb-4 text-2xl">
            Become a partner and join our platform to gain exclusive benefits!
          </p>
          <p className="mb-4 text-lg">
            Join our Partner Program and earn a 20% lifetime commission on
            referred clients. Enjoy exclusive benefits like personalized partner
            management, access to exclusive content, and a spot in our Partner
            Directory. Empower your clients with RevenueHunt's tools and watch
            their businesses thrive.
          </p>
          <Link href="https://revenuehunt.com/partners" passHref>
            <div className="p-2 bg-blue-500 text-white rounded-lg text-lg cursor-pointer">
              Learn More
            </div>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex justify-start md:justify-end space-x-2 mb-4 overflow-x-auto md:overflow-x-visible px-2 md:px-0">
        <button
          onClick={() => setSelectedTag(null)}
          className={`px-4 py-2 rounded-full ${
            selectedTag === null
              ? "bg-black text-white"
              : "bg-gray-200 text-black"
          }`}
        >
          All
        </button>
        {uniqueTags.map((tag) => (
          <button
            key={tag}
            onClick={() => handleTagClick(tag)}
            className={`px-4 py-2 rounded-full ${
              selectedTag === tag
                ? "bg-black text-white"
                : "bg-gray-200 text-black"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
      <div
        ref={bottomRef}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredPosts.map((post) => (
          <Link key={post.id} href={post.uri} passHref>
            <div
              className={`rounded-lg overflow-hidden shadow-lg block cursor-pointer h-full hover-effect ${
                isDarkMode ? "bg-[#313131]" : "bg-gray-100"
              }`}
            >
              {post.featuredImage && (
                <div className="relative w-full h-64">
                  <Image
                    src={post.featuredImage.node.sourceUrl}
                    alt="Featured"
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
              )}
              <div className="p-4 flex flex-col justify-between h-full">
                <div>
                  <div className="text-sm mb-2 flex flex-wrap">
                    {post.tags.nodes.map((tag) => (
                      <button
                        key={tag.id}
                        onClick={() => handleTagClick(tag.name)}
                        className={`px-2 py-1 m-1 rounded-full ${
                          selectedTag === tag.name
                            ? "bg-black text-white"
                            : "bg-gray-200 text-black"
                        }`}
                      >
                        {tag.name}
                      </button>
                    ))}
                  </div>
                  <h2 className="text-lg font-bold mb-2">{post.title}</h2>
                  <div className="mb-2">
                    {parse(post.content.substring(0, 100))}...
                  </div>
                </div>
                <div className="text-sm mt-auto">
                  <span>{post.author.node.name}</span> |{" "}
                  <span>{new Date(post.date).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
