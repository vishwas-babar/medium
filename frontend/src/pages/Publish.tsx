import { CreateBlogInput } from "@vishwas-babar/medium-common"
import axios from "axios"
import { ChangeEvent, useEffect, useState } from "react"
import { BACKEND_URL } from "../config"
import { useNavigate } from "react-router-dom"


const Publish = () => {

    const [blogPost, setBlogPost] = useState<CreateBlogInput>({
        title: "",
        content: "",
        published: true,
    })
    const [publishingPost, setPublishingPost] = useState(false);
    const navigate = useNavigate();

    async function publishPost() {
        setPublishingPost(true)

        try {
            const res = await axios.post(`${BACKEND_URL}/blog/create`, blogPost, {
                headers: {
                    authorization: "Bearer " + localStorage.getItem('token')
                }
            })

            if (res.data.id) {
                setPublishingPost(false)
                navigate(`/blog/${res.data.id}`)
            }
            setPublishingPost(false)
        } catch (error) {
            setPublishingPost(false)
            alert("Failed to publish the post")
        }
    }

    if (publishingPost) {
        return <div className="h-screen flex items-center justify-center text-3xl font-semibold">
            Publishing...
        </div>
    }

    return (
        <div className="h-screen flex justify-center w-full">

            <div className="w-2/3 mt-28">

                <div>
                    <TextArea
                        label="Title"
                        placeholder="Enter title"
                        rows={1}
                        onChange={(e) => setBlogPost({ ...blogPost, title: e.target.value })}
                    />
                </div>

                <div className="mt-5">
                    <TextArea
                        label="Content"
                        placeholder="Enter content"
                        rows={10}
                        onChange={(e) => setBlogPost({ ...blogPost, content: e.target.value })}
                    />
                </div>
                <div className="mt-5 w-full flex items-center justify-end">
                    {/* select option private or public */}
                    <select
                        onChange={(e) => setBlogPost({ ...blogPost, published: e.target.value === 'public' ? true : false })}
                        defaultValue={'public'}
                        className="block p-2.5 w-24 text-base text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500  "
                    >
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                    </select>
                    <button
                        onClick={publishPost}
                        className="bg-blue-500 ml-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Publish</button>
                </div>
            </div>

        </div>
    )
}

const TextArea = ({ label, placeholder, rows, onChange }: { label: string, placeholder: string, rows: number, onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void }) => {
    return (
        <div>
            <label htmlFor="message" className="block mb-2 text-base font-medium text-gray-900 ">{label}</label>
            <textarea onChange={onChange} id="message" rows={rows} className="block p-2.5 w-full text-base text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500  " placeholder={placeholder}></textarea>
        </div>
    )
}

export default Publish