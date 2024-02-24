
document.addEventListener("DOMContentLoaded", () => {
    // By default get the posts
    getPosts("all", 1);


})

function getPosts(action, page){

    
    if (action == "all"){

        const posts_container = document.querySelector("#posts")
        posts_container.innerHTML = "";

        fetch(`load_Posts/${action}/${page}`)
        .then(response => response.json())
        .then(posts => {
            
            posts.forEach(post => {
                // console.log(post);

                const post_num = document.createElement("div");
                post_num.id = `post${post.id}`;
                post_num.setAttribute("class","container w-95 mx-auto shadow rounded");
                post_num.style.border = "1px solid gray";
                post_num.style.marginBottom = "5px";

                const info = document.createElement("div");
                info.id = "info";
                info.setAttribute("class","d-flex bd-highlight");

                const post_info = document.createElement("div");
                post_info.id = "post_info";
                post_info.setAttribute("class","p-1 flex-grow-1 d-flex align-items-center bd-highlight");

                const poster = document.createElement("div");
                poster.id = "poster";
                const profile_link = document.createElement("a")
                profile_link.setAttribute("href", `profile/${post.poster}`);
                profile_link.setAttribute("id", "profile_link");
                profile_link.innerHTML = `${post.poster}`;

                const post_action = document.createElement("div");
                post_action.id = "post_action";
                post_action.setAttribute("class","d-flex flex-row p-2 bd-highlight align-items-center");

                if (!post.isfollow){

                    const follow = document.createElement("div");
                    follow.id = "follow";
                    const btn = document.createElement("button");
                    btn.setAttribute("class","btn btn-primary");
                    btn.setAttribute("data-posterId", `${post.poster_id}`);
                    btn.innerHTML = "Follow";
                    follow.append(btn);
                    post_action.append(follow);
                    
                }
                
    
                const post_content = document.createElement("div");
                post_content.id = "post_content";
                post_content.setAttribute("class","text-truncate-vertical");
                const spanC = document.createElement("span");
                spanC.innerHTML = `${post.content}`;

                const post_timestamp = document.createElement("div");
                post_timestamp.id = "post_timestamp";
                const spanT = document.createElement("span");
                spanT.setAttribute("class","text-secondary");
                spanT.innerHTML = `${post.timestamp}`;

                const post_likes = document.createElement("div");
                post_likes.id = "post_likes";
                post_likes.setAttribute("data-post", `${post.id}`);
                const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
                if (post.isliked){
                    svg.setAttribute("class", "like");
                }else{
                    svg.setAttribute("class", "unlike");
                }

                const likes_count = document.createElement("div");
                likes_count.id = "likes_count";
                likes_count.innerHTML = `${post.likes} Likes`;
                
                
                svg.setAttributeNS(null, "id", "heart");
                svg.setAttributeNS(null, "viewBox","0 0 24 24");
                const path = document.createElementNS("http://www.w3.org/2000/svg" , "path");
                path.setAttributeNS(null, "d", "M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z")
                

                const post_comments = document.createElement("div");
                post_comments.id = "post_comments";
                post_comments.setAttribute("class","mb-2");
                const spanCom = document.createElement("span");
                spanCom.setAttribute("class","text-secondary");
                spanCom.innerHTML = "Comment";
                

                poster.append(profile_link);
                post_info.append(poster);
                info.append(post_info);
                info.append(post_action);
                post_content.append(spanC);
                post_timestamp.append(spanT);
                svg.append(path);
                post_likes.append(svg);
                post_likes.append(likes_count);
                post_comments.append(spanCom);
                post_num.append(info);
                post_num.append(post_content);
                post_num.append(post_timestamp);
                post_num.append(post_likes);
                post_num.append(post_comments);
                posts_container.append(post_num);
            });


            // eventListener to all the like btn
            const hearts = document.querySelectorAll("#heart");

            hearts.forEach(heart => {
                
                heart.addEventListener("click", likeUnlikePost);
            });


            // eventListener to all the follow btn
            const btns = document.querySelectorAll("button");
            
            btns.forEach(btn => {
                btn.addEventListener("click", follow);
            })

            // EventListener on the page button
            const page_btn = document.querySelectorAll("#page");

            page_btn.forEach(btn => {
                const page_num = btn.dataset.page_num

                btn.addEventListener('click', () => getPosts("all", page_num))
            })

        })
        .catch(error => {
            // information about the error if server goes down or could request(valid mailbox)
            console.log(error)
        });


    }else{
        console.log("action error")
    }

    
    

}

const follow = (event) => {
    const element = event.target;
    const follow_id = element.dataset.posterid
    
    if (event.target.classList.value === 'btn btn-primary' && event.target.innerHTML === 'Follow'){
        
        fetch(`/action/${follow_id}`, {
            method: 'PUT',
            body: JSON.stringify({
                action: "follow"
            })
        })
        .then(response => response.json())
        .then(result => {

            // console.log(result);
            
            const btns = document.querySelectorAll(`button[data-posterid='${follow_id.toString()}']`);

            // console.log(btns)
                
            btns.forEach(btn => {
                btn.remove();
            })

    
        })
        .catch(error => {
            console.log(error)
        })
    }
    
}

const likeUnlikePost = (event) => {
    

    // to unlike
    if(event.target.parentElement.classList.contains("like")){     
        
        event.target.parentElement.classList.remove("like");
        event.target.parentElement.classList.add("unlike");

        const post = event.target.parentElement.parentElement.dataset.post;

        // to decrease the number of like using javascript
        let count = document.querySelector(`[data-post='${post}'] div`);
        let decrease =  parseInt(count.innerHTML.charAt(0));
        decrease--;
        count.innerHTML = `${decrease} likes`;
        

        fetch(`/action2/${post}`, {
            method: 'PUT',
            body: JSON.stringify({
                action: "unlike"
            })
        })
        .then(response => response.json())
        .then(result => {

            console.log(result);
            

    
        })
        .catch(error => {
            console.log(error)
        })
        
    }// To like a post
    else if(event.target.classList.contains("unlike")){
        // console.log("like: " + event.target.parentElement.dataset.post)
        
        event.target.classList.remove("unlike");
        event.target.classList.add("like");

        const post = event.target.parentElement.dataset.post

        // to add the number of likes by javascript
        let count = document.querySelector(`[data-post='${post}'] div`);
        let increase =  parseInt(count.innerHTML.charAt(0));
        increase++;
        count.innerHTML = `${increase} likes`;

    
        fetch(`/action2/${post}`, {
            method: 'PUT',
            body: JSON.stringify({
                action: "like"
            })
        })
        .then(response => response.json())
        .then(result => {

            console.log(result);
            

    
        })
        .catch(error => {
            console.log(error)
        })

    }
    
}


