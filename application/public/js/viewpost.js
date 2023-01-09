
function addNewComment(data){
  //Create variables for all comments and new comments
  let commentList = document.getElementById('comments');
  let newComment = document.createElement('template');
  //Create element for new comment (Date will be off)
  newComment.innerHTML = 
  `
  <div class="aComment" id="comment-${data.commentId}">
    <p class="commentData" id="commentUser">@${data.username}</p>
    <p class="commentData" id ="commentTime">${new Intl.DateTimeFormat('en-US', 
                  {year: '2-digit', 
                  month: 'numeric', 
                  day: 'numeric',
                  hour: 'numeric', 
                  minute: 'numeric'})
        .format(new Date())}</p>
    <p class="commentData" id="commentText">${data.comment}</p>
  </div>
  `;
  commentList.append(newComment.content);
  //Scroll into view the new comment
  document.getElementById(`comment-${data.commentId}`).scrollIntoView({behavior: 'smooth', block: 'start'});
}

document.getElementById("commentBTN").addEventListener("click", function (ev) {
  //Get raw comment text
  let commentText = document.getElementById("addComment").value;
  //Get post the comment belongs to
  let postId = ev.currentTarget.dataset.postid;
  //Send a nonempty comment to database
  if(!commentText) return;
    fetch("/comment/create", {
      method: "POST",
      headers: {
        "Content-Type": "Application/json",
      },
      body: JSON.stringify({
        comment: commentText,
        postId: postId,
      }),
    })
    .then(response => response.json())
    .then(res_json => {
      addNewComment(res_json.data);
    })
    .catch(err => console.log(err))
});
