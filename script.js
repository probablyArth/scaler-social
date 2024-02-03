let posts = [];

const newPostInput = document.getElementById("new-post-input");
const newPostButton = document.getElementById("new-post-button");

const saveToLocalStorage = () => {
  localStorage.setItem("posts", JSON.stringify(posts));
};

const getFromLocalStorage = () => {
  let p = localStorage.getItem("posts");

  if (!p) {
    posts = [];
    localStorage.setItem("posts", []);
    return;
  }
  posts = JSON.parse(p);
};

newPostButton.onclick = (e) => {
  if (newPostInput.value !== "") {
    addPost(newPostInput.value);
    newPostInput.value = "";
    renderFeed();
  }
};

function toggleClick(idx) {
  posts[idx].liked = !posts[idx].liked;
  renderFeed();
}

function deletePost(idx) {
  posts = posts.filter((v, i) => i !== idx);
  renderFeed();
}

function toggleCommentClick(postIdx, idx) {
  posts[postIdx].comments[idx].liked = !posts[postIdx].comments[idx].liked;
  renderFeed();
}

function deleteComment(postIdx, idx) {
  posts[postIdx].comments = posts[postIdx].comments.filter((v, i) => i !== idx);
  renderFeed();
}

function renderFeed() {
  const feedContainer = document.getElementById("feed-container");
  feedContainer.innerHTML = "";
  posts.forEach((post, idx) => {
    const newPost = newPostHtml(post, idx);
    feedContainer.appendChild(newPost);
  });
  saveToLocalStorage();
}

function openEditBox(idx) {
  const val = window.prompt("Edit the post");
  if (val) {
    posts[idx].text = val;
    renderFeed();
  }
}

function openCommentBox(idx) {
  const val = window.prompt("Enter a new comment");
  if (val) {
    posts[idx].comments.push({ text: val, liked: false });
    renderFeed();
  }
}

function openCommentEditBox(postIdx, idx) {
  const val = window.prompt("Edit the comment");
  if (val) {
    posts[postIdx].comments[idx].text = val;
    renderFeed();
  }
}

function newCommentHtml(comment, postIdx, idx) {
  const newComment = document.createElement("div");
  newComment.innerHTML = `
    <div class="comment flex" id="comment-${idx}">
  <img src="./assets/icons/user.svg" alt="" width="40px" height="40px" />
  <div class="flex-col w-full">
    <div class="flex justify-between">
      <div class="flex items-center username">
        <h3>Joanne Graham</h3>
        <span class="text-sm text-NS9">@joannegraham123</span>
      </div>
      <div class="flex items-center post-actions">
        <img src="assets/icons/edit-icon.svg" alt="" class="pointer" onclick="openCommentEditBox(${postIdx},${idx})"/>
        <img src="assets/icons/delete-icon.svg" alt="" class="pointer" onclick="deleteComment(${postIdx},${idx})"/>
      </div>
    </div>
    <p>
      ${comment.text}
    </p>
    <div class="flex reply-actions">
      <img src="assets/icons/${
        comment.liked ? "love" : "heart-icon"
      }.svg" alt="" class="pointer" onclick="toggleCommentClick(${postIdx},${idx})"/>
    </div>
    </div>
  
</div>`;
  return newComment;
}

function newPostHtml(post, postIdx) {
  const newPost = document.createElement("div");
  console.log(localStorage);
  newPost.innerHTML = `
    <div class="post flex ${
      post.comments.length > 0 && "has-comments"
    }" id="post-${postIdx}">
  <img src="./assets/icons/user.svg" alt="" width="40px" height="40px" />
  <div class="flex-col w-full">
    <div class="flex justify-between">
      <div class="flex items-center username">
        <h3>Joanne Graham</h3>
        <span class="text-sm text-NS9">@joannegraham123</span>
      </div>
      <div class="flex items-center post-actions">
        <img src="assets/icons/edit-icon.svg" alt="" class="pointer" onclick="openEditBox(${postIdx})"/>
        <img src="assets/icons/delete-icon.svg" alt="" class="pointer" onclick="deletePost(${postIdx})"/>
      </div>
    </div>
    <p>
      ${post.text}
    </p>
    <div class="flex reply-actions">
      <img src="assets/icons/chat-icon.svg" alt="" class="pointer" onclick="openCommentBox(${postIdx})"/>
      <img src="assets/icons/${
        post.liked ? "love" : "heart-icon"
      }.svg" alt="" class="pointer" onclick="toggleClick(${postIdx})"/>
    </div>
    </div>
    </div>`;
  const comments = document.createElement("div");
  comments.classList.add("comments-container");
  post.comments.forEach((comment, idx) => {
    const newComment = newCommentHtml(comment, postIdx, idx);
    comments.appendChild(newComment);
  });
  newPost.appendChild(comments);
  return newPost;
}

function addPost(text) {
  posts.push({ text, liked: false, comments: [] });
}
getFromLocalStorage();
renderFeed();
