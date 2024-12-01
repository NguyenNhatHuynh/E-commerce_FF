import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js';

//client send messages
const formsendmess = document.querySelector("[formsendmessclient]")
if(formsendmess){
    const upload = new FileUploadWithPreview.FileUploadWithPreview('upload-images', {
        multiple: true,
        maxFileCount: 6
      });
    formsendmess.addEventListener("submit",(e) => {
        e.preventDefault()
       
        const data = formsendmess.querySelector("input")
        const content = data.value
        console.log(upload.cachedFileArray)
        const images = upload.cachedFileArray || []
        if(content || images.length > 0){
            socket.emit("client_send_messages",{
                content : content,
                images : images
            })
            data.value = ""
            upload.resetPreviewPanel();
        }
        socket.emit("client_send_typing","hidden")
        console.log(content) 
    })
}
//server render messages

socket.on("Sever_render_mess_client",(data) => {
    console.log(data)
    const chatbody = document.querySelector(".chat-body")
    const room = document.querySelector(".messages")
    const userid = room.getAttribute("myid")
    console.log(userid)
    const div = document.createElement("div")
    div.classList.add("message-item")
    let rdimages = ""
    let content = ""
   
  
    if(userid == data.userid){
        if(data.content){
            content += `<div class="message-content">${data.content}</div>`
        }
        if(data.images){
            rdimages += "<div class=inner-images>"
             data.images.forEach((item) => {
               rdimages += `<img src="${item}"/>`
   
             });
             rdimages += "</div>"
             console.log(rdimages)
       }
        div.classList.add("outgoing-message")
        div.innerHTML = `
        ${content}
        ${rdimages}
        `
      
    }
    else{
        if(data.content){
            content += ` <div class="message-avatar">
            <figure class="avatar">
                <img class="rounded-circle" src="images/women_avatar5.jpg" alt="image">
            </figure>
            <div>
                <h5>${data.infor.fullName}</h5>
                <div class="time">01:20 PM <i class="ti-double-check text-info"></i></div>
            </div>
        </div>
        <div class="message-content">${data.content}</div>`
        }
        if(data.images){
            rdimages += "<div class=inner-imagesright>"
             data.images.forEach((item) => {
               rdimages += `<img src="${item}"/>`
   
             });
             rdimages += "</div>"
             console.log(rdimages)
       }
        div.innerHTML = `
         ${content}
         ${rdimages}
        `
    };
   const typing = document.querySelector(".inner-list-typing")
   room.insertBefore(div,typing)
   chatbody.scrollTop = chatbody.scrollHeight
   const gallery = new Viewer(div);

 })


 const chatbody = document.querySelector(".chat-body")
 if(chatbody){
    chatbody.scrollTop = chatbody.scrollHeight
 }

//icon
 const buttonemoji = document.querySelector("[buttonemoji]")
if(buttonemoji){
    const tooltip = document.querySelector('.tooltip');
    Popper.createPopper(buttonemoji, tooltip);
     buttonemoji.addEventListener("click",() => {
        tooltip.classList.toggle("shown")
    })
    const emojiPicker = document.querySelector("emoji-picker");
    const inputChat = document.querySelector("[inputchatclient]");

  emojiPicker.addEventListener('emoji-click', event => {
    const icon = event.detail.unicode;
    inputChat.value = inputChat.value + icon;
     
  });
}


// typing

const inputsendmess = document.querySelector("[inputchatclient]")
let setimetyping;

if(inputsendmess)
{
    inputsendmess.addEventListener("keyup" , () => {
          socket.emit("client_send_typing","show")
          clearTimeout(setimetyping)
          setimetyping = setTimeout(() => {
            console.log("đã chạy vào remove")
            socket.emit("client_send_typing","hidden")
        },3000)
    })
        

}

socket.on("Sever_render_typing",(data) => {
    const id = data.infor._id
    console.log(data.infor._id)
    const typing = document.querySelector(".inner-list-typing")
    if(data.type == "show"){
        const div = document.createElement("div")
        div.classList.add("box-typing")
        div.setAttribute("userid",id)

        const check = typing.querySelector(`.box-typing[userid="${id}"]`)
        if(!check){
        div.innerHTML = `
            <div class="inner-name">${data.infor.fullName}</div>
            <div class="inner-dots">
                <span></span>
                <span></span>
                <span></span>`
        typing.appendChild(div)
    }
    }
    else{
        const childbox = typing.querySelector(`.box-typing[userid="${id}"]`)
        console.log(childbox)
        if(childbox){
            console.log(childbox)
        typing.removeChild(childbox)
        }
    
    }
   
})

const message = document.querySelector(".messages")
console.log(message)
if(message){
    const gallery = new Viewer(message);

}


const iduserbongchat = document.querySelectorAll("[iduserbongchat]")
iduserbongchat.forEach((item) => {
    item.addEventListener("click",() => {
       let url = new URL(window.location.href)
       const iduser = item.getAttribute("iduserbongchat")
       if(iduser){
        url.searchParams.set("id",iduser)
       }
       window.location.href = url.href
    })
})