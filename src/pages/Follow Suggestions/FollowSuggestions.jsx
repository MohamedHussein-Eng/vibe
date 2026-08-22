import axios from 'axios';
import React, { useState, useEffect, useCallback } from 'react';
import { baseUrl } from '../../MainData';
import { useInfiniteQuery } from '@tanstack/react-query';
import SuggestFollewer from '../../comps/SuggestFollewercomp';
import { Button, Spinner, Input } from '@heroui/react';

export default function FollowSuggestions() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Debounce search term - wait 300ms after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchSuggestions = useCallback(({ pageParam = 1 }) => {
    return axios.get(`${baseUrl}/users/suggestions?page=${pageParam}&q=${debouncedSearchTerm}`, {
      headers: {
        "AUTHORIZATION": `Bearer ${localStorage.getItem("token")}`
      }
    });
  }, [debouncedSearchTerm]);

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching
  } = useInfiniteQuery({
    queryKey: ["Suggested", debouncedSearchTerm],
    queryFn: fetchSuggestions,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const suggestions = lastPage?.data?.data?.suggestions;
      if (!suggestions || suggestions.length === 0) {
        return undefined;
      }
      return allPages.length + 1;
    },
  });

  // Clear search
  const handleClearSearch = () => {
    setSearchTerm("");
    setDebouncedSearchTerm("");
  };

  if (isLoading) return <Spinner className="mx-auto my-8" />;

  return (
    <div className="flex flex-col gap-4 p-3">
      <div className="mb-4 relative">
        <Input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pr-10"
          wrapperClassName="bg-slate-800 border-slate-700 focus:border-primary"
          inputClassName="text-white placeholder-slate-500"
          startContent={
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          }
          endContent={searchTerm && (
            <button
              onClick={handleClearSearch}
              className="text-slate-400 hover:text-white transition-colors p-1"
              aria-label="Clear search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

        {data?.pages.map((page, pageIndex) => (
          <React.Fragment key={pageIndex}>

            {page?.data?.data?.suggestions?.map((suggest) => (
              <div key={suggest._id} className='border border-primary rounded-2xl'>
                <SuggestFollewer
                  name={suggest.name}
                  userName={suggest.username ?? "UserName"}
                  image={suggest.photo}
                  id={suggest._id}
                />
              </div>
            ))}

          </React.Fragment>
        ))}

      </div>

      {isFetching && !isLoading && (
        <div className="flex justify-center py-2">
          <Spinner className="w-5 h-5" />
        </div>
      )}

      <Button
        color="primary"
        onPress={() => fetchNextPage()}
        isLoading={isFetchingNextPage}
        isDisabled={!hasNextPage}
      >
        {isFetchingNextPage ? 'Loading more...' : hasNextPage ? 'Load More' : 'Nothing more to load'}
      </Button>
    </div>
  );
}