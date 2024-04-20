import Link from "next/link";
import { Suspense } from "react";

import Avatar from "./avatar";
import CoverImage from "./cover-image";
import DateComponent from "./date";
import MoreStories from "./more-stories";
import Onboarding from "./onboarding";
import PortableText from "./portable-text";

import type { HeroQueryResult, SettingsQueryResult } from "@/sanity.types";
import * as demo from "@/sanity/lib/demo";
import { sanityFetch } from "@/sanity/lib/fetch";
import { heroQuery, settingsQuery } from "@/sanity/lib/queries";

function Intro(props: { title: string | null | undefined; description: any }) {
  const title = props.title || demo.title;
  // const description = props.description?.length
  //   ? props.description
  //   : demo.description;
  return (
    // <section className="mt-16 mb-16 flex flex-col items-center lg:mb-12 lg:flex-row lg:justify-between">
    //   <h1 className="text-balance text-6xl font-bold leading-tight tracking-tighter lg:pr-8 lg:text-8xl">
    //     {title || demo.title}
    //   </h1>
    //   <h2 className="text-pretty mt-5 text-center text-lg lg:pl-8 lg:text-left">
    //     <PortableText
    //       className="prose-lg"
    //       value={description?.length ? description : demo.description}
    //     />
    //   </h2>
    // </section>

    // todo
    <header className="header fixed top-0 left-0 right-0 z-[2] bg-slate-900 text-gray-300">
      <div className="w-full px-3 md:px-4 lg:px-8 relative">
        <div className="navbar text-pastelBlue items-center justify-between">
          <div className="navmenu">
            <details className="dropdown">
              <summary className=" mr-4 sm:mr-8 btn bg-transparent border-none text-pastelBlue p-1 hover:bg-slate-900 lg:hidden">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
              </summary>
              <ul className="menu menu-sm dropdown-content mt-1 z-[1] p-2 shadow bg-slate-900 rounded-box w-52">
                <li><a href="/">Home</a></li>
                <li><a href="live.html">Live</a></li>
                <li><a href="news.html">News</a></li>
                <li tabIndex={0}>
                  <details>
                    <summary>Movies</summary>
                    <ul className="">
                      <li><a href="single-page.html">Movie Category</a></li>
                      <li><a href="#">Movie Category</a></li>
                      <li><a href="#">Movie Category</a></li>
                    </ul>
                  </details>
                </li>
                <li><a href="news.html">Web Series</a></li>
                <li><a href="tv-channel.html">Live TV</a></li>
              </ul>
            </details>
            {/* Navbar Brand */}
            <div>
              <a href="/">
                <h1 className="text-xl font-bold">{title || demo.title}</h1>
              </a>
            </div>
            <div className="hidden lg:flex">
              <ul className="menu menu-horizontal px-1">
                <li><a href="news.html">About Me</a></li>
                <li><a href="news.html">My Edits</a></li>
                <li className="dropdown dropdown-hover">
                  <summary tabIndex={0} className="">Dropdown</summary>
                  <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow-xl bg-slate-900 rounded-lg w-52">
                    <li><a href="single-page.html">Item 1</a></li>
                    <li><a href="#">Item 2</a></li>
                    <li><a href="#">Item 3</a></li>
                    <li><a href="#">Item 4</a></li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
          {/* End Navbar Start */}
          {/* End Navabr Center */}
          <div className="flex gap-4 items-center">
            <div className="hidden lg:flex gap-4">
              <a href="/">Home</a>
            </div>
          </div>
          {/* End Navbar End */}
        </div>
      </div>
    </header>
  );
}

function HeroPost({
  title,
  slug,
  excerpt,
  coverImage,
  date,
  author,
}: Pick<
  Exclude<HeroQueryResult, null>,
  "title" | "coverImage" | "date" | "excerpt" | "author" | "slug"
>) {
  return (
    <article>
      <Link className="group mb-8 block md:mb-16" href={`/posts/${slug}`}>
        <CoverImage image={coverImage} priority />
      </Link>
      <div className="mb-20 md:mb-28 md:grid md:grid-cols-2 md:gap-x-16 lg:gap-x-8">
        <div>
          <h3 className="text-pretty mb-4 text-4xl leading-tight lg:text-6xl">
            <Link href={`/posts/${slug}`} className="hover:underline">
              {title}
            </Link>
          </h3>
          <div className="mb-4 text-lg md:mb-0">
            <DateComponent dateString={date} />
          </div>
        </div>
        <div>
          {excerpt && (
            <p className="text-pretty mb-4 text-lg leading-relaxed">
              {excerpt}
            </p>
          )}
          {author && <Avatar name={author.name} picture={author.picture} />}
        </div>
      </div>
    </article>
  );
}

export default async function Page() {
  const [settings, heroPost] = await Promise.all([
    sanityFetch<SettingsQueryResult>({
      query: settingsQuery,
    }),
    sanityFetch<HeroQueryResult>({ query: heroQuery }),
  ]);

  return (
    <div className="container mx-auto px-5">
      <Intro title={settings?.title} description={settings?.description} />
      {heroPost ? (
        <HeroPost
          title={heroPost.title}
          slug={heroPost.slug}
          coverImage={heroPost.coverImage}
          excerpt={heroPost.excerpt}
          date={heroPost.date}
          author={heroPost.author}
        />
      ) : (
        <Onboarding />
      )}
      {heroPost?._id && (
        <aside>
          <h2 className="mb-8 text-6xl font-bold leading-tight tracking-tighter md:text-7xl">
            More Stories
          </h2>
          <Suspense>
            <MoreStories skip={heroPost._id} limit={100} />
          </Suspense>
        </aside>
      )}
    </div>
  );
}
