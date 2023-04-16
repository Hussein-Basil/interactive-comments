
fetch("data.json")
  .then((res) => res.json())
  .then((response) => {
    const profile = document.getElementById("personal-avatar");
    profile.src = response.currentUser?.image?.png;

    const comments = document.getElementById("comments");

    const responseComments = response.comments.sort((a, b) => b.score - a.score)

    responseComments.forEach(comment => {
        const commentTemplate = `
            <div class="comment" id=${comment.id}>
                <div class="comment-container">
                    <div class="comment-header">
                        <img src="${comment.user.image.png}"/>
                        <h5>${comment.user.username}</h5>
                        ${comment.user.username === response.currentUser.username ?`<span class="you">you</span>` : ''}
                        <span>${comment.createdAt}</span>
                    </div>
                    <p>
                        <span class="reply-tag">${comment.replyingTo ? '@' + comment.replyingTo : ''}</span> ${comment.content}
                    </p>
                </div>
                ${comment.user.username === response.currentUser.username ?
                    `<div class="comment-control-container">
                    <button class="comment-control comment-edit" onclick="handleEdit(${comment.id})">
                        Edit
                    </button>
                    <button class="comment-control comment-delete" onclick="handleDelete(${comment.id})" >
                        Delete
                    </button>
                </div>
                ` : `<button class="comment-control comment-reply" onclick="handleReply(${comment.id}, 'comment')" >
                    Reply
                </button>`
                }
                
                <div class="comment-points">
                    <button onclick="handleIncrement(${comment.id})" >&plus;</button>
                    <span class="comment-score">${comment.score}</span>
                    <button onclick="handleDecrement(${comment.id})">&minus;</button>
                </div>
            </div>
        `    
        
        if (comment.replies.length !== 0) {
            let replies = ''

            for (let reply of comment.replies) {
                replies += `
                    <div class="comment" id=${reply.id}>
                        <div class="comment-container">
                            <div class="comment-header">
                                <img src="${reply.user.image.png}"/>
                                <h5>${reply.user.username}</h5>
                                ${reply.user.username === response.currentUser.username ?`<span class="you">you</span>` : ''}
                                <span>${reply.createdAt}</span>
                            </div>
                            <p>
                                <span class="reply-tag">${reply.replyingTo ? '@' + reply.replyingTo : ''}</span> ${reply.content}
                            </p>
                            
                        </div>
                        ${reply.user.username === response.currentUser.username ?
                            `<div class="comment-control-container">
                                <button class="comment-control comment-edit" onclick="handleEdit(${reply.id})">
                                    Edit
                                </button>
                                <button class="comment-control comment-delete" onclick="handleDelete(${reply.id})" >
                                    Delete
                                </button>
                            </div>
                            ` : `<button class="comment-control comment-reply" onclick="handleReply(${reply.id}, 'reply')" >
                                Reply
                            </button>`
                        }
                        <div class="comment-points">
                            <button onclick="handleIncrement(${reply.id})" >&plus;</button>
                            <span class="comment-score">${reply.score}</span>
                            <button onclick="handleDecrement(${reply.id})">&minus;</button>
                        </div>
                    </div>
                `
            }

            comments.innerHTML += `
                <div class="comment-and-replies">
                    ${commentTemplate}        
                    <div class="replies" id="replies-${comment.id}">${replies}</div>
                </div>
            `
        } else {
            comments.innerHTML += `<div class="comment-and-replies">${commentTemplate}
            <div class="replies" id="replies-${comment.id}"></div>
            </div>`
        }
    })
  });
