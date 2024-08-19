document.addEventListener("DOMContentLoaded", () => {
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    
    const all_posts = document.querySelector(".all-posts");
    fetch(`posts/`)
        .then((response) => {
            return response.json();
        })
        .then((posts) => {
            posts.map((post) => {
                const [
                    post_box, headding, owner, timestamp, title, content,
                    like_count, comment_toggle, like_toggle, comments
                ] = [
                    "div", "div", "a", "div", "div", "pre", "span",
                    "button", "button", "div"
                ].map((tag) => document.createElement(tag));

                headding.classList.add("post-heading");
                owner.classList.add("post-owner");
                owner.innerText = post.owner.username;
                owner.setAttribute("href", `user_profile/${post.owner.id}/`);

                timestamp.classList.add("post-timestamp");
                timestamp.innerText = post.timestamp;

                headding.append(owner);
                headding.append(timestamp);
                post_box.append(headding);

                title.classList.add("post-title");
                title.innerText = `Title: ${post.title}`;
                post_box.append(title);

                content.classList.add("post-content");
                content.innerText = post.content;
                post_box.append(content);

                like_toggle.classList.add("like-toggle");
                like_toggle.innerText = post.like_status ? "Unlike" : "Like";
                post_box.append(like_toggle);

                like_count.classList.add("like-count");
                like_count.innerText = post.like_count;
                post_box.append(like_count);

                comment_toggle.classList.add("comment-toggle");
                comment_toggle.innerText = "Show Comments";
                post_box.append(comment_toggle);

                comments.classList.add("all-comments");
                comments.style.display = "none";
                post_box.append(comments);
                all_posts.append(post_box);

                load_comments(comments, post.comments, post.id);
                comment_toggle.addEventListener("click", () => {
                    show_hide_comments(comments, post, comment_toggle);
                });
                like_toggle.addEventListener("click", () => {
                    like_unlike_post(post, like_count, like_toggle, csrfToken);
                });
            });
        });

    
    function show_hide_comments(comments, post, comment_toggle) {
        comment_toggle.innerText =
            comment_toggle.innerText == "Show Comments" ? "Hide Comments" : "Show Comments";
        comments.style.display = comments.style.display == "block" ? "none" : "block";
    }

    function load_comments(comments, comment_arr, postID) {
        comments.innerHTML = '';
        load_comment_form(comments, postID);
        if (comment_arr.length == 0) {
            const message = document.createElement("div");
            message.classList = "alert-warning";
            message.innerText = "No Comment to Show!";
            comments.append(message);
            return;
        }

        comment_arr.map((comment) => {
            const [comment_box, content, header, timestamp, owner] = [
                "div", "pre", "div", "div", "div"
            ].map((tag) => document.createElement(tag));
            header.classList.add("comment-header");
            owner.innerText = comment.owner.username;
            timestamp.innerText = comment.timestamp;
            header.append(owner, timestamp);
            content.classList.add("comment-content");
            content.innerText = comment.content;
            comment_box.append(header, content);
            comments.append(comment_box);
        });
    }

    function like_unlike_post(post, like_count, like_toggle, csrfToken) {
        const like = like_toggle.innerText === "Like";
        fetch(`post/${post.id}/like-unlike/`, {
            method: "POST",
            headers: {
                'X-CSRFToken': csrfToken,
            },
            body: JSON.stringify({like: like}),
        })
        .then((response) => {
            return response.status;
        })
        .then((status) => {
            if (status == 200) {
                like_toggle.innerText = like ? "Unlike" : "Like";
                like_count.innerText = like ? parseInt(like_count.innerText) + 1 : parseInt(like_count.innerText) - 1;
            } else if (status == 404) {
                insert_message("Login First!");
            } else {
                insert_message("Bad Request!");
            }
        });
    }

    function insert_message(message) {
        const message_box = document.querySelector(".message");
        message_box.style.display = "block";
        message_box.classList = "message aleart-warning";
        message_box.innerText = message;

        setTimeout(()=> {
            message_box.innerHTML = "";
            message_box.innerText = "";
            message_box.style.display = "none";
        }, 2000);
    }

    function load_comment_form(comments, postID) {
        const [comment_form, comment_box, submit_btn] = ["form", "textarea", "input"].map( (tag )=> document.createElement(tag));
        submit_btn.setAttribute("type", "submit");
        submit_btn.setAttribute("value", "Submit");

        comment_form.append(comment_box, submit_btn);
        comments.append(comment_form);

        comment_form.onsubmit = (ev) => {
            ev.preventDefault();
            if(ev.target.querySelector("textarea").value != ""){
                fetch(`post/${postID}/addcomment/`, {
                    method: "POST",
                    headers: {
                        'Content-Type': "application/json",
                        'X-CSRFToken': csrfToken,
                    },
                    body: JSON.stringify({content: comment_box.value}),
                })
                .then((response)=>response.status)
                .then((status) => {
                    if (status == 200) {
                        fetch(`post/${postID}`)
                        .then((response) => response.json())
                        .then((post) => {
                            // console.log(post)
                            load_comments(comments, post.comments, postID);
                        })
                    } else if (status == 404) {
                        insert_message("Login First!");
                    } else {
                        insert_message("Bad Request!");
                    }
                });

            }
            else{
                insert_message("Comment Can not be empty!");
            }
        }

    }
});
