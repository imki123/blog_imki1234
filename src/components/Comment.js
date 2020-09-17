import React, { useEffect } from 'react'
import './Comment.css'

function Comment(props) {
    const {comment, login, post, refresh, setRefresh, resizeTextarea} = props
    let update = false
    let date = comment.publishedDate.substring(0,16).replace('T',' ')
    useEffect(() => {
        const textarea = document.querySelector(`#comment_${post.postId}_${comment.commentId} textarea`)
        textarea.value = comment.content
    },[comment, refresh])

    const updateComment = e => { //댓글 수정
        const textarea = document.querySelector(`#comment_${post.postId}_${comment.commentId} textarea`)
        if(!update){
            update = true
            textarea.classList.add('updateMode')
            textarea.readOnly = false
            textarea.focus()
        }else if(window.confirm('댓글을 수정하시겠습니까?')){
            update = false
            textarea.classList.remove('updateMode')
            textarea.readOnly = true
            
            let url = process.env.REACT_APP_URL+`/comments/${post.postId}/${comment.commentId}`
            //url = process.env.REACT_APP_LOCAL_URL+`/comments/${post.postId}/${comment.commentId}`
            fetch(url, {
                mode: 'cors',
                method: 'PATCH',
                credentials: "include",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: textarea.value,
                }),
            })
            .then(res => {
               if(res.status===200) { //성공하면 아래 then 작동
                    res.json().then(res =>{ 
                        console.log(`${comment.commentId}번 댓글 수정 성공`)
                        refresh ? setRefresh(false) : setRefresh(true) //포스트 다시 불러오기
                    })
                }else{
                    let message = '댓글 수정에 실패했습니다 :('
                    alert(message)
                }
            })
            .catch(e => console.error(e))
        }
    }

    const deleteComment = e => {
        if(window.confirm('삭제 후에는 복구가 불가능 합니다. 정말로 댓글을 삭제하시겠습니까?')){
            let url = process.env.REACT_APP_URL+`/comments/delete/${post.postId}/${comment.commentId}`
            //url = process.env.REACT_APP_LOCAL_URL+`/comments/delete/${post.postId}/${commentId}`
            fetch(url, {
                mode: 'cors',
                method: 'PATCH',
                credentials: "include",
            })
            .then(res => {
               if(res.status===200) { //성공하면 아래 then 작동
                    res.json().then(res =>{ 
                        console.log(`${comment.commentId}번 댓글 삭제 성공`)
                        refresh ? setRefresh(false) : setRefresh(true) //포스트 다시 불러오기
                    })
                }else{
                    let message = '댓글 삭제에 실패했습니다 :('
                    alert(message)
                }
            })
            .catch(e => console.error(e))
        }
    }

	return(
    <div className="commentWrapper" id={`comment_${post.postId}_${comment.commentId}`}>
        <div className="comment">
            <div className="commentProfile">
                {!comment.username ? 
                <img alt="PROFILE" src={process.env.PUBLIC_URL+'/images/noavatar.png'}/> :
                    comment.username === 'imki123' ?
                        <img alt="PROFILE" src={process.env.PUBLIC_URL+'/images/avatar.png'}/> :
                        <img alt="PROFILE" 
                            src={process.env.PUBLIC_URL+'/images/dog'+(Math.floor(Math.random() * (3 - 1 + 1)) + 1)+'.png'}/>}
            </div>
            <div className="commentContent">
                <span className="commentUsername">{comment.username}</span>
                <span className="commentDate"> - {date} {comment.updated && '(수정됨)'}</span>
                <textarea readOnly onChange={resizeTextarea}/>
            </div>
        </div>
        {(comment.username === login.username || login.username === 'imki123')&&
        <div className="commentButtons">
            <button className="commentButton" onClick={updateComment}>수정</button>
            <button className="commentButton" style={{background:'red'}} onClick={deleteComment}>삭제</button>
        </div>}
    </div>
    ) 
}
export default React.memo(Comment)
