function user_profile_follow_unfollow(peopleID){
    fetch(`/follow-unfollow/${peopleID}/`)
    .then((response) => response.status == 200 ? response.json() : {"message": "Bad Request"})
    .then((data) => {
        if(data.message != "Bad Request"){
            const fun_btn = document.querySelector(".f-un-status");
            fun_btn.innerText = data.message == "Unfollowed" ? "Follow" : "Unfollow";
        }
    })
}