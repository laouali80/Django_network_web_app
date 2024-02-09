document.addEventListener("DOMContentLoaded", () =>{

    
            // eventListener to all the follow btn
            const btns = document.querySelectorAll("button");
            
            btns.forEach(btn => {
                btn.addEventListener("click", follow);
            })

});

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