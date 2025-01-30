
export interface PostProps {
    id: string;
    title: string;
    imageUrl: string;
    content: string;
    rating: number;
}

export type PostType = PostProps


export function Post({ id, title, imageUrl ,content, rating }: PostProps) {
    if (!id) {
        id = "-1"
    }
    if (!title) {
        title = "No Title"
    }
    if (!content) {
        content = "No Content"
    }
    if (!imageUrl) {
        imageUrl = "No Image"
    }
    if (!rating) {
        rating = 0
    }

    return (
        <div>
            <h1>{title}</h1>
            <p>{content}</p>
        </div>
    )
}

export default Post;