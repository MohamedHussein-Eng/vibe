import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import post_image from '../../images/PostImage.png'

export default function MyPostsSaved({ posts, savedPosts, profile }) {
  const [activeFilter, setActiveFilter] = useState('posts')


  return (


    <section className="mt-8">
      <div className="px-8 border-b border-slate-200 dark:border-slate-800 flex items-center gap-8 overflow-x-auto no-scrollbar">

        {/* "Posts" Button */}
        <button
          onClick={() => setActiveFilter('posts')}
          className={`py-4 border-b-2 font-semibold flex items-center gap-2 transition-colors ${activeFilter === 'posts'
            ? 'border-primary text-primary'
            : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
        >
          <span>Posts</span>
        </button>
        {!profile &&

          <button
            onClick={() => setActiveFilter('saved')}
            className={`py-4 border-b-2 font-semibold flex items-center gap-2 transition-colors ${activeFilter === 'saved'
              ? 'border-primary text-primary'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
          >
            <span>Saved</span>
          </button>
        }
      </div>

      {/* --- RENDER POSTS --- */}
      {(activeFilter === 'posts') && (
        posts?.length === 0 ? <p className='text-white font-bold py-10 text-2xl text-center'>No Posts Yet!!!</p> :
          <div className="mb-8">
            {<h3 className="px-8 pt-6 text-xl font-bold text-white">My Posts</h3>}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-8">
              {posts?.map((post) => (
                <Link key={`post-${post._id}`} to={`/details/${post._id}`}>
                  <div className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer bg-slate-200 dark:bg-slate-800">
                    <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Post" src={post.image || post_image} />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 text-white font-bold">
                      <span className="flex items-center gap-1.5"><span className="material-icons">Likes</span> {post.likesCount}</span>
                      <span className="flex items-center gap-1.5"><span className="material-icons">Comments</span> {post.commentsCount}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
      )}

      {/* --- RENDER SAVED --- */}
      {!profile &&
        (activeFilter === 'saved') && (
          savedPosts?.length === 0 ? <p className='text-white font-bold py-10 text-2xl text-center'>No Saved Posts Yet!!!</p> :

            <div className="mb-8">
              {<h3 className="px-8 pt-2 text-xl font-bold text-white">Saved Posts</h3>}

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-8">
                {savedPosts?.map((post) => (
                  <Link key={`saved-${post._id}`} to={`/details/${post._id}`}>
                    <div className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer bg-slate-200 dark:bg-slate-800">
                      <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Saved post" src={post.image || post_image} />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 text-white font-bold">
                        <span className="flex items-center gap-1.5"><span className="material-icons">Likes</span> {post.likesCount}</span>
                        <span className="flex items-center gap-1.5"><span className="material-icons">Comments</span> {post.commentsCount}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
        )
      }
    </section>
  )
}

