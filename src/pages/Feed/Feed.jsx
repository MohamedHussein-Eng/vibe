import React from 'react';
import axios from 'axios';
import { useInfiniteQuery } from '@tanstack/react-query'; 
import { baseUrl } from '../../MainData';
import LoaderHome from '../../comps/LoaderHome';
import PostCard from '../../comps/PostCard';

const getHomeFeed = ({ pageParam = 1 }) => {
  return axios.get(`${baseUrl}/posts/feed?only=following&limit=10&page=${pageParam}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });
};

export default function Feed() {
  const { 
    data,
    isLoading,
    isError, 
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage 
  } = useInfiniteQuery({
    queryKey: ["feedHome"],
    queryFn: getHomeFeed,
    initialPageParam: 1, 
    getNextPageParam: (lastPage, pages) => {
      const posts = lastPage?.data?.data?.posts;
      
      if (!posts || posts.length === 0) {
        return undefined;
      }
      return pages.length + 1;
    }
  });

  if (isLoading) return <LoaderHome />;
  if (isError) return <div className="text-center py-10">Failed to load feed.</div>;

  return (
    <div className="lg:flex min-h-screen">
      <div className="space-y-5 py-10 w-full">
        
        {data?.pages.map((page, pageIndex) => (
          <React.Fragment key={`page-${pageIndex}`}>
            {page?.data?.data?.posts?.map((post) => (
              <PostCard
                key={post._id || post.id}
                postData={post}
                isLiked={post.isLiked ?? false}
              />
            ))}
          </React.Fragment>
        ))}

        {data?.pages[0]?.data?.data?.posts?.length === 0 && (
          <p className="text-center text-gray-500">No posts to show right now.</p>
        )}
      {/* The Load More Button */}
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

    
    </div>
  );
}