document.addEventListener("DOMContentLoaded", () => {
    // Select all elements with the class .people
    let followings = document.querySelectorAll(".people");

    // Check if the list is empty
    if (followings.length === 0) {
        const messageDiv = document.createElement("div");
        messageDiv.textContent = "No one in the follow list";
        messageDiv.className = "alert alert-info text-center"; // Add Bootstrap classes for styling if needed
        document.querySelector(".following-list").appendChild(messageDiv);
    } else {
        followings.forEach((people) => {
            console.log(people);
            const unfollow = people.querySelector(".unfollow");
            if (unfollow) {
                unfollow.addEventListener("click", (event) => {
                    event.preventDefault(); // Prevent the default link action

                    // Perform fetch request to follow/unfollow
                    fetch(`/follow-unfollow/${unfollow.id}`)
                        .then((response) => response.status)
                        .then((status) => {
                            if (status === 200) {
                                people.style.animationPlayState = "running"; // Start the animation
                                people.addEventListener("animationend", () => {
                                    people.remove();

                                    followings = document.querySelectorAll(".people");
                                    if (followings.length === 0) {
                                        const messageDiv = document.createElement("div");
                                        messageDiv.textContent = "No one in the follow list";
                                        messageDiv.className = "alert alert-info text-center"; // Add Bootstrap classes for styling if needed
                                        document.querySelector(".following-list").appendChild(messageDiv);
                                    }
                                });
                            }
                        });

                      
                });
            }
        });
    }
});
