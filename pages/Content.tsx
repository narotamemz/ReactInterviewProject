import React, { FC, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import getConfig from 'next/config';

interface ContentProps {
  data: any;
  totalRecords: number;
}

const Content: FC<ContentProps> = ({ data, totalRecords }) => {
  const [posts, setPosts] = useState(data);
  const [hasMore, setHasMore] = useState(true);

  const { publicRuntimeConfig } = getConfig();

  const getMorePost = async () => {
    if (posts.length >= totalRecords) {
      setHasMore(false);
    } else {
      const res = await fetch(
        `${publicRuntimeConfig.BASE_URL}api/boreds?_start=${posts.length}&_limit=5`
      );
      const newPosts = await res.json();
      setPosts((data: any) => [...data, ...newPosts]);
    }
  };

  return (
    <>
      {posts ? (
        <div>
          <InfiniteScroll
            dataLength={posts.length}
            next={getMorePost}
            hasMore={hasMore}
            loader={<h3> Loading...</h3>}
            endMessage={<h4>Nothing more to show</h4>}
          >
            {posts.map((data: any) => (
              <div
                key={data.id}
                className="bg-slate-100 pt-6 text-left p-3 mt-4 rounded-lg"
              >
                <img
                  className="w-24 h-24 rounded-full mx-auto"
                  src={
                    'https://source.unsplash.com/random/200x200?sig=' + data.id
                  }
                  alt=""
                  width="384"
                  height="512"
                />
                <p className="text-sm text-slate-400">{data.id}</p>
                <p className="text-sm text-slate-400">{data.key}</p>
                <p className="text-sm text-slate-400">{data.type}</p>
                <p className="text-lg text-black">{data.activity}</p>
              </div>
            ))}
          </InfiniteScroll>
          <style jsx>
            {`
              .back {
                padding: 10px;
                background-color: dodgerblue;
                color: white;
                margin: 10px;
              }
            `}
          </style>
        </div>
      ) : (
        ''
      )}
    </>
  );
};

export default Content;
