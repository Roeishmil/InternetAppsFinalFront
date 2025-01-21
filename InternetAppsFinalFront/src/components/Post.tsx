
interface PostProps {
    title: string
    content: string
}

export type PostType = PostProps


export function Post({ title, content }: PostProps) {
    if (!title) {
        title = "No Title"
    }
    if (!content) {
        content = "No Content"
    }
    return (
        <div>
            <h1>{title}</h1>
            <p>{content}</p>
        </div>
    )
}

export default Post;