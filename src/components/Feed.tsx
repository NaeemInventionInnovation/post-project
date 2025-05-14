"use client";
import { useEffect, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import PostComponent from "./PostComponent";

type Post = {
  id: number;
  title: string;
  body: string;
  userId: number;
  tags: string[];
  reactions: number;
};

type ApiResponse = {
  posts: Post[];
  total: number;
  skip: number;
  limit: number;
};

export default function Feed() {
  const observerTarget = useRef(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery<ApiResponse>({
    queryKey: ['posts'],
    queryFn: async ({ pageParam = 0 }) => {
      const limit = 10;
      const res = await fetch(
        `https://dummyjson.com/posts?limit=${limit}&skip=${pageParam}`
      );
      return res.json();
    },
    getNextPageParam: (lastPage) => {
      const { skip, limit, total } = lastPage;
      return skip + limit < total ? skip + limit : undefined;
    },
    initialPageParam: 0,              
  });

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (status === 'pending') {
    return <div>Loading initial posts...</div>;
  }

  if (status === 'error') {
    return <div>Error loading posts</div>;
  }

  return (
    <div className="feed-container">
      {data.pages.flatMap(page => page.posts).map((post) => (
        <PostComponent key={post.id} post={post} />
      ))}

      <div ref={observerTarget} className="py-4">
        {isFetchingNextPage && (
          <div className="loading-spinner">Loading more posts...</div>
        )}
        {!hasNextPage && (
          <div className="no-more-posts">No more posts to load</div>
        )}
      </div>
    </div>
  );
}