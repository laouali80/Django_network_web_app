document.addEventListener("DOMContentLoaded", () =>{

    
            // eventListener to all the follow btn
            const btns = document.querySelectorAll("button");
            
            btns.forEach(btn => {
                btn.addEventListener("click", follow);
            })

});

const follow = (event) => {
    // const test = event.target.parentElement
    // console.log(event.target)
    // const element = event.target;
    const follow_id = event.target.dataset.posterid
    
    if (event.target.parentElement.id === "follow_btn" && event.target.innerHTML === 'Follow'){
        
        event.target.innerHTML = 'Unfollow';
        event.target.classList.remove('btn-outline-primary')
        event.target.classList.add('btn-outline-secondary');


        fetch(`/follow/${follow_id}`)
        .then(response => response.json())
        .then(result => {

            console.log(result);
            const btns = document.querySelectorAll("button[class='btn btn-primary']");
                
            btns.forEach(btn => {
                btn.remove();
            })
        })
        .catch(error => {
        // information about the error if server goes down or could request(valid mailbox)
        console.log(error)  
        })

    }else if (event.target.parentElement.id === "follow_btn" && event.target.innerHTML === 'Unfollow'){
        
        event.target.innerHTML = 'Follow';     
        event.target.classList.remove('btn-outline-secondary');
        event.target.classList.add('btn-outline-primary');
    }
    
}