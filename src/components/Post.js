import React, { useEffect, useState } from 'react'
import './Post.css'
import { Link, useLocation } from 'react-router-dom'
import { useQuill } from 'react-quilljs';

function Post(props){
    const {post, no, login, refresh, setRefresh} = props
    const [ps, setPs] = useState([])
    const location = useLocation()
    let date = post.publishedDate.substring(0,16).replace('T',' ')
    const {quill, quillRef} = useQuill({readOnly: true, theme: 'bubble'})

    useEffect(() => {
        if(post){
            if(typeof(post.body) === 'string'){ 
                setPs(post.body.split('\n')) //텍스트일 경우 문단으로 쪼개기
            }else{
                if(quill){
                    quill.setContents(post.body)
                }
            }
        }
    },[post, location, quill])

    const deletePost = e => {
        if(window.confirm('글 삭제 시 복구가 불가능합니다. 해당 글을 정말로 삭제하시겠습니까?')){
            const postId = e.target.id
            let url = process.env.REACT_APP_URL+'/posts/'+postId
            //url = process.env.REACT_APP_LOCAL_URL+'/posts/'+postId
            
            fetch(url,{
                mode: 'cors',
                method: 'DELETE',
                credentials: "include",
            })
            .then(res => {
                if(res.status===200 || res.status===204) { //성공하면 아래 then 작동
                    res.json().then(res =>{ 
                        console.log(`${postId}번 글 삭제 성공`)
                        refresh ? setRefresh(false) : setRefresh(true)
                    })
                }else{
                    let message = '글 삭제에 실패했습니다 :('
                    alert(message)
                }
            })
            .catch(e => console.error(e))
        }
    }

    return(
        <div className="post" id={`post_${no}`}>
            <div className="nav">{date}</div>
            <h2 className="postTitle">{no}. {post.title}</h2>
            <div className="postContent">
                {typeof(post.body) === 'string' ? 
                    ps.map((p,idx) => <p key={idx}>{p}</p>) :
                    <div id="editor">
                        <div ref={quillRef} />
                    </div>
                }
                <div className="tags">
                <span>태그 : </span>
                {post.tags && post.tags.map((i,idx) => 
                    idx === 0 ? 
                    <span key={i}><Link to={i === 'home' ? '/' : `/${i}`}>{i}</Link></span> : 
                    <span key={i}>, <Link to={`/${i}`}>{i}</Link></span>)}
                </div>
            </div>
            

            {login && login.username === 'imki123' && <div className="postButtons">
                <Link to={`/quill?postId=${post.postId}`}>수정</Link>&nbsp;
                <button onClick={deletePost} id={post.postId} style={{background: 'red'}}>삭제</button>
            </div>}
            
        </div>
    )
}
export default React.memo(Post)