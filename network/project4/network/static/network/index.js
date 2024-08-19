document.addEventListener("DOMContentLoaded", () => {
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    const allPosts = document.querySelectorAll(".post");

    allPosts.forEach((postElement) => {
        const postID = postElement.id.split('-')[1];
        const likeToggle = postElement.querySelector(".like-toggle");
        const likeCount = postElement.querySelector(".like-count");
        const commentToggle = postElement.querySelector(".comment-toggle");
        const comments = postElement.querySelector(".all-comments");

        likeToggle.addEventListener("click", () => {
            likeUnlikePost(postID, likeCount, likeToggle, csrfToken);
        });

        commentToggle.addEventListener("click", () => {
            showHideComments(comments, commentToggle);
        });

        // Load the comment form and existing comments
        loadComments(comments, postID, csrfToken);
    });

    function likeUnlikePost(postID, likeCount, likeToggle, csrfToken) {
        const like = likeToggle.innerText === "Like";
        fetch(`/post/${postID}/like-unlike/`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
            body: JSON.stringify({ like: like }),
        })
        .then(response => response.status)
        .then(status => {
            if (status === 200) {
                likeToggle.innerText = like ? "Unlike" : "Like";
                likeCount.innerText = like ? parseInt(likeCount.innerText) + 1 : parseInt(likeCount.innerText) - 1;
                
                likeToggle.classList.toggle("btn-outline-primary", !like);
                likeToggle.classList.toggle("btn-primary", like);
            } else {
                insertMessage("An error occurred. Please try again.", "alert-danger");
            }
        });
    }

    function showHideComments(comments, commentToggle) {
        commentToggle.innerText = commentToggle.innerText === "Show Comments" ? "Hide Comments" : "Show Comments";
        comments.style.display = comments.style.display === "block" ? "none" : "block";
    }

    function insertMessage(message, alertClass) {
        messageBox.style.display = "block";
        const messageBox = document.querySelector(".message");
        messageBox.className = `alert ${alertClass} mt-3`; // Apply the Bootstrap alert class
        messageBox.innerText = message;
        messageBox.style.display = "block";

        setTimeout(() => {
            messageBox.style.display = "none";
        }, 3000); // Extend display time for better visibility
    }

    function loadComments(comments, postID, csrfToken) {
        comments.innerHTML = ''; // Clear existing comments

        // Add comment form
        const commentForm = document.createElement("form");
        commentForm.classList.add("mt-3");

        const commentBox = document.createElement("textarea");
        commentBox.classList.add("form-control", "mb-2");
        commentBox.setAttribute("placeholder", "Add a comment...");
        commentBox.setAttribute("rows", "3");

        const submitBtn = document.createElement("button");
        submitBtn.classList.add("btn", "btn-primary");
        submitBtn.setAttribute("type", "submit");
        submitBtn.innerText = "Submit Comment";

        commentForm.append(commentBox, submitBtn);
        comments.append(commentForm);

        commentForm.onsubmit = (ev) => {
            ev.preventDefault();
            if (commentBox.value.trim() !== "") {
                fetch(`/post/${postID}/addcomment/`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrfToken,
                    },
                    body: JSON.stringify({ content: commentBox.value }),
                })
                .then(response => response.status)
                .then(status => {
                    if (status === 200) {
                        // Reload comments after successful submission
                        loadComments(comments, postID, csrfToken);
                    } else {
                        insertMessage("An error occurred. Please try again.", "alert-danger");
                    }
                });
            } else {
                insertMessage("Comment cannot be empty!", "alert-warning");
            }
        };

        // Load existing comments
        fetch(`/post/${postID}`)
        .then(response => response.json())
        .then(post => {
            post.comments.forEach(comment => {
                const commentBox = document.createElement("div");
                commentBox.classList.add("comment", "mb-3", "p-3", "border", "rounded", "bg-white");

                const header = document.createElement("div");
                header.classList.add("comment-header", "d-flex", "justify-content-between", "align-items-center");

                const owner = document.createElement("a");
                owner.classList.add("comment-owner", "font-weight-bold", "text-primary");
                owner.setAttribute("href", `/user_profile/${comment.owner.id}/`);
                owner.innerText = comment.owner.username;

                const timestamp = document.createElement("small");
                timestamp.classList.add("text-muted");
                timestamp.innerText = comment.timestamp;

                header.append(owner, timestamp);

                const content = document.createElement("pre");
                content.classList.add("comment-content", "mt-2");
                content.innerText = comment.content;

                commentBox.append(header, content);
                comments.append(commentBox);
            });
        });
    }
});
