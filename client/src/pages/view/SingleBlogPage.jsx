import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Header } from "./layout/Header";
import { Footer } from "./layout/Footer";
import Error404 from "./404";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import {ArrowLeft, ArrowRight} from 'lucide-react';
import { RiFacebookLine } from "react-icons/ri";
import { VscTwitter } from "react-icons/vsc";
import { PiPinterestLogo } from "react-icons/pi";
dayjs.extend(utc);
dayjs.extend(timezone);

export default function SingleBlogPage(){
    const [loader, setLoader] = useState(false);
    const { slug } = useParams();
    const [blog, setBlog] = useState([]);
    useEffect(() => {
        setLoader(true);
        const getSinglePost = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_HOST_URL}/post/${slug}`);
                const data = await response.json();
                setBlog(data.data);
            } catch(error) {
                console.log(error);
            } finally {
                setLoader(false);
            }
        };
        getSinglePost();
    }, [slug]);

    // console.log(blog.categories[0].cat_name);
    // const [blog,` setBlog] = useState([
    //     {
    //     "id": 1,
    //     "title": "The Future of Remote Work in 2026",
    //     "slug": "future-of-remote-work-2026",
    //     "published_date": "2026-07-15T09:00:00Z",
    //     "updated_date": "2026-07-22T14:15:00Z",
    //     "status": "published",
    //     "reading_time_minutes": 5,
    //     "author": {
    //         "id": 101,
    //         "name": "Jane Doe",
    //         "avatar": "https://picsum.photos",
    //         "bio": "Tech journalist and workspace designer focusing on the evolution of digital collaboration."
    //     },
    //     "category": {
    //         "id": 1,
    //         "name": "Technology",
    //         "slug": "technology"
    //     },
    //     "tags": [
    //         { "id": 10, "name": "Remote Work", "slug": "remote-work" },
    //         { "id": 11, "name": "AI", "slug": "ai" },
    //         { "id": 12, "name": "Productivity", "slug": "productivity" }
    //     ],
    //     "images": {
    //         "featured": "https://picsum.photos",
    //         "thumbnail": "https://picsum.photos",
    //         "alt_text": "A modern minimalist home office setup with advanced digital displays."
    //     },
    //     "seo": {
    //         "meta_title": "The Future of Remote Work in 2026 | TechTrends",
    //         "meta_description": "An in-depth look at how artificial intelligence and virtual reality are reshaping the modern hybrid workspace.",
    //         "og_type": "article"
    //     },
    //     "summary": "An in-depth look at how artificial intelligence and virtual reality are reshaping the modern hybrid workspace.",
    //     "content": "<h2>The Next Evolution of Work</h2><p>Remote work is no longer just about Zoom calls and Slack channels. As we cross into 2026, artificial intelligence agents and spatial computing environments are fundamentally redefining what it means to collaborate asynchronously.</p><h2>Spatial Workspaces Rise</h2><p>Virtual reality headsets have grown lightweight enough for daily 4-hour shifts. Teams now meet in persistent digital twins of physical offices, reducing screen fatigue dramatically.</p><h2>AI-Driven Asynchronous Alignment</h2><p>The biggest shift comes from autonomous meeting summarizers. Missing a morning sync no longer penalizes a worker, as localized AI agents deliver bespoke, hyper-relevant action points based on individual project roles.</p>",
    //     "comments": [
    //         {
    //         "id": 501,
    //         "user": "Alice Vance",
    //         "avatar": "https://picsum.photos",
    //         "comment_date": "2026-07-16T10:20:00Z",
    //         "text": "The bit about spatial computing reducing screen fatigue is spot on. Our team tried it last week!"
    //         }
    //     ],
    //     "related_posts": [
    //         {
    //         "id": 3,
    //         "title": "Mastering CSS Grid in 10 Minutes",
    //         "slug": "mastering-css-grid",
    //         "featured_image": "https://picsum.photos"
    //         }
    //     ]
    //     }
    // ]);
    return(
        <main className="w-full h-screen bg-gray-100">
            <Header />
            {
            blog ? (
            <div className="w-full h-auto bg-gray-100">
                <div className="md:w-[80%] w-full flex flex-col items-center justify-center mx-auto h-full md:px-10 px-3">
                            {loader ? (
                                <Box sx={{ display: 'flex', width: '100%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: '55vh' }}>
                                    <CircularProgress aria-label="Loading…" />
                                </Box>
                                ) : (
                    <div className="md:w-[70%] gap-5 w-full h-full">
                        {/*Breadcrumbs */}
                        <div className="w-full h-full mt-5">
                            <div className="w-full h-10 flex items-center">
                                <Link to="/" className="text-gray-500 hover:text-orange-400">Home</Link>
                                <span className="text-gray-500 mx-2">/</span>
                                <Link to="/posts" className="text-gray-500 hover:text-orange-400">Blogs</Link>
                                <span className="text-gray-500 mx-2">/</span>
                                <span className="text-gray-500">{blog.title}</span>
                            </div>
                        </div>
                        {/* Blog Image */}
                        <div className="w-full h-full md:mt-5 mt-2">
                            <div className="w-full h-auto flex items-center">
                                <img src={blog.post_image_url} alt={blog.title} className="w-full h-full object-cover rounded-3xl" />
                            </div>
                        </div>
                        {/* Blog Content */}
                        <div className="w-full mx-auto  md:mt-10 mt-5">
                            {/* Category */}
                            <div className="w-full h-full md:mt-5 mt-2">
                                <div className="w-full h-auto flex items-center ">
                                    {blog.categories ? blog.categories.map((category) => (
                                        <Link to={`/category/${category.cat_slug}`} key={category.id}  className="text-white md:text-md text-sm  bg-orange-400 rounded-full md:px-5 px-3 py-1">{category.cat_name}</Link>
                                    )) : (
                                        ''
                                    )}
                                </div>
                            </div>
                            {/* Blog Title */}
                            <div className="w-full h-full md:mt-5 mt-2">
                                <h1 className="md:text-5xl text-3xl font-semibold">{blog.title}</h1>
                            </div>
                            {/* Blog Date, Last modified and Author. Date Format : July 23, 2026 */}
                            <div className="w-full h-full md:mt-5 mt-2">
                                <div className="w-full h-auto flex md:flex-row flex-col md:items-center items-start gap-2 md:gap-8 gap-4 flex-wrap">
                                    <li className="text-gray-500 list-none">{ blog.created_at ? "Published : " + dayjs(blog.created_at).tz('Asia/Kolkata').format('ddd, MMMM YYYY') : ''}</li>
                                    <li className="text-gray-500 list-none">Last modified: {blog.updated_at ? dayjs(blog.updated_at).tz('Asia/Kolkata').format('ddd, MMMM YYYY') : ''}</li>
                                    { 
                                     blog.author ? <li className="text-gray-500 flex items-center gap-1 list-none md:list-disk">By: <img className="w-[16px] h-[16px] rounded-full  hover:scale-110 transition-all duration-300 ease-in-out " src={blog.author.profile_image} alt={blog.author.username} /><Link to={`/author/${blog.author.id}`}>{blog.author.user_name}</Link></li> : <li>By:</li>
                                    }
                                </div>
                            </div>
                            {/* Content in proper html */}
                            <div className="w-full h-full mt-5">
                                <div className="w-full h-auto flex items-center  tiptap tiptap-frontend">
                                    <p className="text-gray-500 blog-content" dangerouslySetInnerHTML={{ __html: blog?.description }}></p>
                                </div>
                            </div>
                            {/* Next and Previous Post */}
                            <div className="w-full h-full mt-5 flex items-center justify-between">
                                    <div >
                                            <p className="text-gray-500">Previous Post:</p>
                                            <button className={`${blog?.prev_post ? "" : "opacity-50 cursor-not-allowed"} flex flex-row items-center gap-2 cursor-pointer text-black`}>
                                            <ArrowLeft className="w-5 h-5" />
                                            {blog?.prev_post ? <Link to={`/post/${blog?.prev_post?.slug}`}>{blog?.prev_post?.title}</Link> : 'No previous post'}
                                        </button>
                                    </div>
                                    <div >
                                        <p className="text-gray-500">Next Post:</p>
                                        <button className={`${blog?.next_post ? "" : "opacity-50 cursor-not-allowed"} flex flex-row-reverse items-center gap-2 cursor-pointer text-black`}>
                                            <ArrowRight className="w-5 h-5" />
                                            {blog?.next_post ? <Link to={`/post/${blog?.next_post?.slug}`}>{blog?.next_post?.title}</Link> : 'No next post'}
                                        </button>
                                    </div>
                            </div>
                            {/* Tags and Social */}
                            <div className="w-full h-full md:mt-20 mt-10">
                                <div className="w-full h-auto flex flex-row items-center md:justify-between justify-end  mb-10 md:mb-0">
                                    <div className="w-[60%] h-auto flex md:flex-row flex-col md:items-center items-start gap-2">
                                        <p className="text-black font-semibold">Tags:</p>
                                        <div className='flex items-center gap-2 flex-wrap'>
                                        {blog.tags ? blog.tags.map((tag) => (
                                            <Link to={`/posts/tag/${tag.tag_slug}`} className="text-black md:text-md text-sm hover:text-white border hover:border-orange-400 border-gray-400 hover:bg-orange-400 bg-white rounded-full md:px-5 px-3 py-1">{tag.tag_name}</Link>
                                        ))
                                        : ''
                                        }
                                        </div>
                                    </div>
                                    <div className="w-[40%] h-auto md:mt-0 md:mt-5 mt-0 md:ml-0 ml-5 flex md:flex-row flex-col md:items-center items-start justify-end gap-2">
                                        <p className="text-black font-semibold">Social:</p>
                                        <div className="flex items-center gap-2">
                                            <span className="border hover:bg-orange-400 hover:text-white hover:border-orange-400 bg-white rounded-full p-2">
                                                <RiFacebookLine  className="text-black md:text-xl text-md cursor-pointer" />
                                            </span>
                                            <span className="border hover:bg-orange-400 hover:text-white hover:border-orange-400 bg-white rounded-full p-2">
                                                <VscTwitter className="text-black md:text-xl text-md cursor-pointer" />
                                            </span>
                                            <span className="border hover:bg-orange-400 hover:text-white hover:border-orange-400 bg-white rounded-full p-2">
                                                <PiPinterestLogo className="text-black md:text-xl text-md cursor-pointer" />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <hr className="mt-10 mb-10 border-gray-200 md:block hidden" />
                            </div>
                        </div>
                    </div> 
                )}
                </div>
            </div>
                ):(
                    <>
                    <Error404 />
                    </>
                )}
            <Footer />  
        </main>
    );
}