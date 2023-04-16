async function handleReply(id, isReply) {
console.log(isReply)
  const replyTo = document.getElementById(id);
  const newComment = document.createElement("div");

  const res = await fetch("data.json");
  const { currentUser, comments } = await res.json();

  let replyingTo = ''

  for (let c of comments) {
    if (c.id == id) {
      replyingTo = c.user.username;
    } else {
      for (let r of c.replies) {
        if (r.id == id) {
          replyingTo = r.user.username;
        }
      }
    }
  }

  document.getElementById("my-reply-draft")?.remove();

  newComment.className = "add-comment";
  newComment.id = "my-reply-draft";

  if (isReply === 'reply') {
      newComment.innerHTML = `
            <img id="$personal-avatar" src="${currentUser.image.png}" alt="avatar" />
            <textarea placeholder="Add a reply...">@${replyingTo}</textarea>
            <button onclick="handleAddReply(${id}, 'reply')">Reply</button>
        `;
  }
  else {
    newComment.innerHTML = `
            <img id="$personal-avatar" src="${currentUser.image.png}" alt="avatar" />
            <textarea placeholder="Add a reply...">@${replyingTo}</textarea>
            <button onclick="handleAddReply(${id}, 'comment')">Reply</button>
        `;
  }


  replyTo.parentNode.insertBefore(newComment, replyTo.nextSibling);
}

function handleEdit(id) {
  const editComment = document.getElementById(id);
  console.log(editComment);
  const text = editComment.getElementsByTagName("p")[0];
  const container = editComment.getElementsByClassName("comment-container")[0];
  const textarea = document.createElement("textarea");
  textarea.innerText = text.innerText;
  container.appendChild(textarea);

  const button = document.createElement('button')
  button.innerText = 'Update'

  button.addEventListener('click', () => {
    text.innerText = textarea.value
    container.appendChild(text)
    button.remove()
    textarea.remove()
  })

  container.appendChild(button)

  text.remove();
}

function handleDelete(id) {
    document.body.classList.toggle('overlay')

    const modal = document.getElementsByClassName('modal')[0]

    modal.style.display = 'flex'

    console.log(modal)

    modal.getElementsByClassName('modal-control-primary')[0].addEventListener('click', () => {
        handleDeleteComment(id)
    })
}

function handleCloseModal() {
    document.body.classList.toggle('overlay')

    document.getElementsByClassName('modal')[0].style.display = 'none'
}

function handleDeleteComment (id) {
    document.getElementById(id).remove()
    document.body.classList.toggle('overlay')

    document.getElementsByClassName('modal')[0].style.display = 'none'
}

function handleIncrement(id) {
    const score = document.getElementById(id).getElementsByClassName('comment-score')[0]

    score.innerText = Number(score.innerText) + 1
}

function handleDecrement(id) {
    const score = document.getElementById(id).getElementsByClassName('comment-score')[0]

    score.innerText = Number(score.innerText) - 1
}

async function handleAddComment() {

    const contentElement = document.getElementById('your-input')

    const res = await fetch('data.json')  
    const { currentUser, comments } = await res.json()

    let ids = []

    for (let c of comments) {
        ids.push(c.id)
        for (let r of c.replies) {
            ids.push(r.id)
        }
    }

    const newId = Math.max(...ids) + 1

    const commentsSection = document.getElementById('comments')

    commentsSection.innerHTML += `
        <div class="comment" id=${newId}>
            <div class="comment-container">
                <div class="comment-header">
                    <img src="${currentUser.image.png}"/>
                    <h5>${currentUser.username}</h5>
                    <span class="you">you</span>
                    <span>now</span>
                </div>
                <p>${contentElement.value}</p>
            </div>
            <div class="comment-control-container">
                <button class="comment-control comment-edit" onclick="handleEdit(${newId})">
                    Edit
                </button>
                <button class="comment-control comment-delete" onclick="handleDelete(${newId})" >
                    Delete
                </button>
            </div>
            <div class="comment-points">
                <button onclick="handleIncrement(${newId})" >&plus;</button>
                <span class="comment-score">0</span>
                <button onclick="handleDecrement(${newId})">&minus;</button>
            </div>
        </div>
    `

    contentElement.value = ''
}

async function handleAddReply(replyToId, isReply) {
    const contentElement = document.getElementById('my-reply-draft')

    const res = await fetch('data.json')  
    const { currentUser, comments } = await res.json()

    let ids = []

    for (let c of comments) {
        ids.push(c.id)
        for (let r of c.replies) {
            ids.push(r.id)
        }
    }

    const newId = Math.max(...ids) + 1

    let repliesSection

    if (isReply === 'reply') {
        const parentComment = comments.find(comment => comment.replies.find(reply => reply.id === replyToId))
        repliesSection = document.getElementById(`replies-${parentComment.id}`) 

    } else {
        repliesSection = document.getElementById(`replies-${replyToId}`) 
    }


    console.log(repliesSection)
    contentElement.remove()

    repliesSection.innerHTML += `
        <div class="comment" id=${newId}>
            <div class="comment-container">
                <div class="comment-header">
                    <img src="${currentUser.image.png}"/>
                    <h5>${currentUser.username}</h5>
                    <span class="you">you</span>
                    <span>now</span>
                </div>
                <p>${contentElement.getElementsByTagName('textarea')[0].value}</p>
            </div>
            <div class="comment-control-container">
                <button class="comment-control comment-edit" onclick="handleEdit(${newId})">
                    Edit
                </button>
                <button class="comment-control comment-delete" onclick="handleDelete(${newId})" >
                    Delete
                </button>
            </div>
            <div class="comment-points">
                <button onclick="handleIncrement(${newId})" >&plus;</button>
                <span class="comment-score">0</span>
                <button onclick="handleDecrement(${newId})">&minus;</button>
            </div>
        </div>
    `

    


}