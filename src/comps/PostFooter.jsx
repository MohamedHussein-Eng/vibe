import { CardFooter, Spinner } from "@heroui/react";
import axios from 'axios'
import React from 'react'
import { AiFillLike, AiOutlineLike } from 'react-icons/ai'
import { BiCommentAdd } from 'react-icons/bi'
import { FaRegBookmark, FaBookmark } from 'react-icons/fa'
import { TbMessage2Share } from 'react-icons/tb'
import { Link } from 'react-router-dom'
import { baseUrl } from '../MainData'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export default function PostFooter(props) {
  const { likesCount, shareCount, commentCount, id, isLiked = false } = props;
  const queryClient = useQueryClient()

  // Optimistic update for like/unlike
  const { mutate: like, isPending: isLiking } = useMutation({
    mutationFn: () => axios.put(`${baseUrl}/posts/${id}/like`, {}, {
      headers: { "AUTHORIZATION": `Bearer ${localStorage.getItem("token")}` }
    }),
    onMutate: async () => {
      // Cancel any outgoing refetches to avoid overwriting our optimistic update
      await queryClient.cancelQueries({ queryKey: ["GetALLPosts"] });
      await queryClient.cancelQueries({ queryKey: ["feedHome"] });
      await queryClient.cancelQueries({ queryKey: ['getSinglePost'] });

      // Snapshot the previous values
      const previousPosts = queryClient.getQueryData(["GetALLPosts"]);
      const previousFeed = queryClient.getQueryData(["feedHome"]);
      const previousSingle = queryClient.getQueryData(['getSinglePost']);

      // Optimistically update all relevant caches
      const updatePostLike = (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages?.map(page => ({
            ...page,
            data: {
              ...page.data,
              data: {
                ...page.data?.data,
                posts: page.data?.data?.posts?.map(post =>
                  post._id === id || post.id === id
                    ? {
                        ...post,
                        likesCount: isLiked ? post.likesCount - 1 : post.likesCount + 1,
                        isLiked: !isLiked
                      }
                    : post
                )
              }
            }
          }))
        };
      };

      queryClient.setQueryData(["GetALLPosts"], updatePostLike);
      queryClient.setQueryData(["feedHome"], updatePostLike);
      queryClient.setQueryData(['getSinglePost'], (old) => {
        if (!old) return old;
        const post = old.data?.data?.post;
        if (post && (post._id === id || post.id === id)) {
          return {
            ...old,
            data: {
              ...old.data,
              data: {
                ...old.data.data,
                post: {
                  ...post,
                  likesCount: isLiked ? post.likesCount - 1 : post.likesCount + 1,
                  isLiked: !isLiked
                }
              }
            }
          };
        }
        return old;
      });

      return { previousPosts, previousFeed, previousSingle };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousPosts) queryClient.setQueryData(["GetALLPosts"], context.previousPosts);
      if (context?.previousFeed) queryClient.setQueryData(["feedHome"], context.previousFeed);
      if (context?.previousSingle) queryClient.setQueryData(['getSinglePost'], context.previousSingle);
    },
    onSettled: () => {
      // Refetch to sync with server (optional, can rely on optimistic update)
      queryClient.invalidateQueries({ queryKey: ["GetALLPosts"] });
      queryClient.invalidateQueries({ queryKey: ["feedHome"] });
      queryClient.invalidateQueries({ queryKey: ['getSinglePost'] });
    }
  });

  // Bookmark mutation (unchanged)
  const { mutate: save, isPending: isSaving } = useMutation({
    mutationFn: () => axios.put(`${baseUrl}/posts/${id}/bookmark`, {}, {
      headers: { "AUTHORIZATION": `Bearer ${localStorage.getItem("token")}` }
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetALLPosts"] });
      queryClient.invalidateQueries({ queryKey: ["feedHome"] });
      queryClient.invalidateQueries({ queryKey: ['getSinglePost'] });
    }
  });

  return (
    <>
      <CardFooter>
        <div className="w-full flex justify-center items-center gap-10 text-slate-500">
          {/* Like Button */}
          <button
            className={`flex items-center gap-2 group transition-colors ${
              isLiked ? 'text-primary' : 'hover:text-primary'
            }`}
            onClick={like}
            disabled={isLiking}
            aria-label={isLiked ? "Unlike" : "Like"}
            aria-pressed={isLiked}
          >
            <div className="p-2 rounded-full transition-colors">
              {isLiking ? (
                <Spinner color='primary' size="sm" />
              ) : isLiked ? (
                <AiFillLike className="text-primary group-hover:bg-primary/10" />
              ) : (
                <AiOutlineLike className="group-hover:bg-primary/10" />
              )}
            </div>
            <span className={`text-xs font-medium transition-colors ${isLiked ? 'text-primary' : ''}`}>
              {likesCount}
            </span>
          </button>

          {/* Comments */}
          <Link to={`/details/${id}`} className="flex items-center gap-2 group hover:text-green-500 transition-colors">
            <div className="p-2 group-hover:bg-green-500/10 rounded-full">
              <BiCommentAdd />
            </div>
            <span className="text-xs font-medium">{commentCount}</span>
          </Link>

          {/* Share */}
          <button className="flex items-center gap-2 group hover:text-primary transition-colors">
            <div className="p-2 group-hover:bg-pink-500/10 rounded-full">
              <Link to={"/share/" + id}><TbMessage2Share /></Link>
            </div>
            <span className="text-xs font-medium">{shareCount}</span>
          </button>

          {/* Bookmark */}
          <button
            className="flex items-center gap-2 group hover:text-yellow-500 transition-colors"
            onClick={save}
            disabled={isSaving}
          >
            <div className="p-2 group-hover:bg-green-500/10 rounded-full">
              {isSaving ? (
                <Spinner color="primary" />
              ) : (
                <FaBookmark />
              )}
            </div>
          </button>
        </div>
      </CardFooter>
    </>
  )
}