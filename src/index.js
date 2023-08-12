let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  //AddButton
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  //AddToy
  let form = document.querySelector("form")
  form.addEventListener("submit", (e)=>{
    e.preventDefault();
    let cardObj = {
      name: e.target.name.value,
      image: e.target.image.value,
      likes: 0
    }
//    addNewCard(cardObj);
    addDb(cardObj);
  })

  getData();

  function addNewCard(obj){
    const newCard = document.createElement("div");
      newCard.className = "card";
      newCard.innerHTML = `
        <h2>${obj.name}</h2>
        <img src="${obj.image}" class="toy-avatar" />
        <p class="likes" id="${obj.id}">0 likes</p>
        <button class="like-btn" id=${obj.id}>Like ❤️</button>
        `
    document.querySelector("#toy-collection").appendChild(newCard);
  }

  function addDb(obj){
    fetch('http://localhost:3000/toys',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(obj)
    })
    .then(res => res.json())
  }



  //GetData
  function getData(){
    fetch('http://localhost:3000/toys')
    .then(res => res.json())
    //addDataToDom
    .then(data => {
      //getDataAndAddCard
      for (const id in data){
        addNewCard(data[id]);
      }
      //GetLikesData
      let likeCounts = {};
      for (const id in data){
        let toyId=parseInt(id)+1;
        likeCounts[toyId] = data[id].likes;
      }
    
      //DisplayLikes
      let displayedLikes = document.querySelectorAll('.likes')
      displayedLikes.forEach((displayedLike)=>{
          displayedLike.textContent = `${likeCounts[displayedLike.id]} likes`
      })
      //AddLikes
      const likeBtns = document.querySelectorAll('.like-btn');

      likeBtns.forEach((likeBtn)=> {
        likeBtn.addEventListener("click", ()=>{
          likeCounts[likeBtn.id]++;
          let id = likeBtn.id;
          let newLikes = likeCounts[id];
          displayedLikes[id-1].textContent = `${newLikes} likes`
        
          //IncreaseLikesOnServer
          fetch(`http://localhost:3000/toys/${id}`, {
            method: 'PATCH',
            headers:{
              'Content-Type': 'application/json',
              Accept: "application/json"
              },
            body: JSON.stringify({
              'likes' : newLikes
            })
          })
            .then(res => res.json())
          })  
        })
      })
    }
  })






