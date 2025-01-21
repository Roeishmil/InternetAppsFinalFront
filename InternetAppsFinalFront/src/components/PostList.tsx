import Post from './Post';


const PostList = () => {

    return (
        <>
            <div className='m-5'>
                <Post title='Title 1' content='Content 1' />
                <Post title='Title 2' content='Content 2' />
                <Post title='Title 3' content='Content 3' />
            </div>
        </>
    );
}


export default PostList;