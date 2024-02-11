document.addEventListener("DOMContentLoaded", () =>{

            // eventListener to all the like btn
            const hearts = document.querySelectorAll("#heart");

            hearts.forEach(heart => {
                
                heart.addEventListener("click", likeUnlikePost);
            });
    
            // eventListener to all the follow btn
            const btns_follow = document.querySelectorAll("button");
            
            btns_follow.forEach(btn => {
                btn.addEventListener("click", follow);
            })

            // eventListener to delete btn
            const btns_delete = document.querySelectorAll("#delete")

            btns_delete.forEach(btn => {
                btn.addEventListener("click", suppr);
            })

            

});


const suppr = (event) => {

    const delete_post = event.target.dataset.post
    

    fetch(`/delete/${delete_post}`, {
        method: 'DELETE',
        body: JSON.stringify({
            action: "delete"
        })
    })
    .then(response => response.json())
    .then(result => {

        console.log(result);
        
        const g_parent = document.querySelector(`#post${delete_post}`);
        g_parent.style.animationPlayState = 'running';
        g_parent.addEventListener('animationend', () =>  {
            g_parent.remove();
        });
    })
    .catch(error => console.log(error))
}

const follow = (event) => {
    // const test = event.target.parentElement
    // console.log(event.target.classList.value)
    // const element = event.target;
    const follow_id = event.target.dataset.posterid
    
    // from profile btn
    if (event.target.parentElement.id === "follow_btn" && event.target.innerHTML === 'Follow'){
        
        event.target.innerHTML = 'Unfollow';
        event.target.classList.remove('btn-outline-primary')
        event.target.classList.add('btn-outline-secondary');


        fetch(`/action/${follow_id}`, {
            method: 'PUT',
            body: JSON.stringify({
                action: "follow"
            })
        })
        .then(response => response.json())
        .then(result => {

            console.log(result);

            const btns = document.querySelectorAll("button[class='btn btn-primary']");
                
            btns.forEach(btn => {
                btn.remove();
            })
        })
        .catch(error => console.log(error))

    }
    else if (event.target.parentElement.id === "follow_btn" && event.target.innerHTML === 'Unfollow'){
    // from the profile btn

        event.target.innerHTML = 'Follow';     
        event.target.classList.remove('btn-outline-secondary');
        event.target.classList.add('btn-outline-primary');

        fetch(`/action/${follow_id}`, {
            method: 'DELETE',
            body: JSON.stringify({
                action: "unfollow"
            })
        })
        .then(response => response.json())
        .then(result => {

            console.log(result);
        })
        .catch(error => {
        // information about the error if server goes down or could request(valid mailbox)
        console.log(error)  
        })
    }
    else if(event.target.classList.value === 'btn btn-primary' && event.target.innerHTML === 'Follow'){
    // from a post btn

        fetch(`/action/${follow_id}`, {
            method: 'PUT',
            body: JSON.stringify({
                action: "follow"
            })
        })
        .then(response => response.json())
        .then(result => {

            console.log(result);
            
            const btns = document.querySelectorAll("button[class='btn btn-primary']");
                
            btns.forEach(btn => {
                btn.remove();
            })

            const prof_btn = document.querySelector("button[class='btn btn-outline-primary']");

            prof_btn.innerHTML = 'Unfollow';
            prof_btn.classList.remove('btn-outline-primary');
            prof_btn.classList.add('btn-outline-secondary');
    
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