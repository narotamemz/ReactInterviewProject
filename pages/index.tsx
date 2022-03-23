import type { GetStaticPropsContext } from 'next';
import React, { useState, FC } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import Content from './Content';
import getConfig from 'next/config';
import prisma from '../lib/prisma';

const { publicRuntimeConfig } = getConfig();
interface IndexViewProps {
  data: any;
  totalRecords: any;
}

const ProductView = ({ data, totalRecords }: IndexViewProps) => {
  const router = useRouter();
  const userData = useSession();
  const [showMe, setShowMe] = useState(false);

  const syncData = async () => {
    for (let i = 0; i < 10; i++) {
      const activityData = await fetch(
        `https://www.boredapi.com/api/activity`
      ).then((response) => response.json());

      const add = await fetch(
        `${publicRuntimeConfig.BASE_URL}api/create-bored`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(activityData),
        }
      );
      setShowMe(!showMe);
    }
  };

  return router.isFallback ? (
    <h1>Page loading...</h1>
  ) : (
    <div className="container mx-auto sm:px-6 lg:px-8 h-screen">
      <div className="grid gap-4 grid-cols-4 p-5">
        <div>
          <div className="grid grid-cols-1 divide-y bg-slate-200 rounded-lg p-8 text-center">
            <h1 className="text-2xl text-center break-words">
              Choose Activity {userData.data?.user?.email}
            </h1>
            <span className="border-none block text-center mb-4">
              You can choose more then one
            </span>
            <div>
              {userData.data ? (
                <>
                  <button
                    onClick={() => syncData()}
                    className="bg-indigo-500 w-full rounded-full inline-block text-white p-2 px-4"
                  >
                    Sync Data
                  </button>
                  <button
                    onClick={() => signOut()}
                    className="mt-4 bg-indigo-500 w-full rounded-full inline-block text-white p-2 px-4"
                  >
                    SignOut
                  </button>
                </>
              ) : (
                ''
              )}
            </div>
            <div style={{ display: showMe ? 'block' : 'none' }}>
              <div
                className="bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md"
                role="alert"
              >
                <div className="flex">
                  <div className="py-1">
                    <svg
                      className="fill-current h-6 w-6 text-teal-500 mr-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold">Data Sync Successfully!</p>
                  </div>
                </div>
              </div>
            </div>

            {userData.data ? (
              <Content data={data} totalRecords={totalRecords} />
            ) : (
              ''
            )}
            <div className="text-center mt-4">
              {userData.data ? (
                ''
              ) : (
                <button
                  onClick={() => signIn()}
                  className="bg-indigo-500 w-full rounded-full inline-block text-white p-2 px-4"
                >
                  SignIn
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductView;

export async function getStaticProps() {
  try {
    const data = await fetch(
      `${publicRuntimeConfig.BASE_URL}api/boreds?_limit=5`
    )
      .then((response) => response.json())
      .catch((error) => console.log(error));

    const totalRecords = await prisma.boreds.count();

    return {
      props: { data, totalRecords },
    };
  } catch (error) {
    console.log(error);
  }
}
