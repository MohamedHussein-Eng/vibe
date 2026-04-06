import React from 'react';
import axios from 'axios';
import { useInfiniteQuery } from '@tanstack/react-query'; // 1. Switched to useInfiniteQuery
import { baseUrl } from '../../MainData';
import LoaderHome from '../../comps/LoaderHome';
import PostCard from '../../comps/PostCard';
import CreatePost from '../../comps/CreatePost';
import SuggestedPeople from '../../comps/SuggestedPeople';


// 2. Accept pageParam and inject it into the API URL
const getAllPosts = ({ pageParam = 1 }) => {
  return axios.get(`${baseUrl}/posts?page=${pageParam}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });
};

export default function Home() {
  // 3. Setup useInfiniteQuery
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ['GetALLPosts'],
    queryFn: getAllPosts,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      // Check if the last page returned any posts
      const posts = lastPage?.data?.data?.posts;
      if (!posts || posts.length === 0) {
        return undefined; // Stop fetching
      }
      return allPages.length + 1; // Go to the next page
    }
  });


  if (isLoading) return <LoaderHome />;

  if (isError) {
    console.error("Error fetching posts");
    return <div className="text-white text-center py-10">Failed to load posts. Please try again.</div>;
  }

  
  return (
    <div className="bg-[#101622] py-10">
      <CreatePost />
      <div className="lg:flex min-h-screen">
        <div className="space-y-5 py-10 w-full">

          {data?.pages.map((page, pageIndex) => (
            <React.Fragment key={`page-${pageIndex}`}>
              {page?.data?.data?.posts?.map((post) => (
                <PostCard
                  key={post._id || post.id}
                  postData={post} 
                  isDetailsView={false}
                />
              ))}
            </React.Fragment>
          ))}

          {data?.pages[0]?.data?.data?.posts?.length === 0 && (
            <p className="text-center text-slate-400">No posts available.</p>
          )}

          {hasNextPage && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-full font-bold transition-colors disabled:opacity-50"
              >
                {isFetchingNextPage ? 'Loading...' : 'Load More Posts'}
              </button>
            </div>
          )}

        </div>

        <SuggestedPeople />
      </div>
    </div>
  );
}
