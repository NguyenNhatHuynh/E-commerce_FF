const chat = require("../../models/chat")
const user = require("../../models/accountuser")
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const usershop = require("../../models/account")
const room = require("../../models/room");
// cloudinary
cloudinary.config({
   cloud_name: 'dkbvldq5r', 
   api_key: '884442743842924', 
   api_secret: 'koq9-2nqq9GekImg5SNMuw9DbLo' 
});
// End cloudinary

let streamUpload = (buffer) => {
  return new Promise((resolve, reject) => {
    let stream = cloudinary.uploader.upload_stream((error, result) => {
      if (result) {
        resolve(result);
      } else {
        reject(error);
      }
    });

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

const uploadToCloudinary = async (buffer) => {
  let result = await streamUpload(buffer);
  return result.url;
}
module.exports.index = async (req,res) => {
   const id = req.params.id
   const userid = res.locals.userclient.id
    
   const arrayuser = []
   arrayuser.push(id)
   arrayuser.push(userid)
   const dataroom = await room.findOne({
      users: { $all: arrayuser, $size: arrayuser.length }
   })
   if(!dataroom && id.length > 20){
      const newroom = new room({ users: arrayuser });
      await newroom.save();
   }
    _io.once("connection", async (socket) => {
       
         const roomchat = await room.findOne({
            users: { $all: arrayuser, $size: arrayuser.length }
         })
       
         if(roomchat){
            socket.join(roomchat.id);
         }
         const positionroom = await room.findOne({}).sort({ position: -1 });

        socket.on("client_send_messages", async (data) => {
            const images = [];
            console.log(data.images)
            for (const image of data.images) {
               const url = await uploadToCloudinary(image);
               images.push(url);
            }
            
           if(data){
               const info = {
                  user_id : userid,
                  content: data.content,
                  images: images,
                  room_chat_id : roomchat.id
               }
               await room.updateOne(
                  {users: { $all: arrayuser, $size: arrayuser.length }},
                  { $set: { position: parseInt( positionroom.position) + 1 } }
               )
               
               const mess = new chat(info)
               await mess.save()
               _io.to(roomchat.id).emit("Sever_render_mess_client", {
                  content : mess.content,
                  userid : mess.user_id,
                  infor : res.locals.userclient,
                  images: images  
               })
              
           }
           

          }
      
   )
        socket.on("client_send_typing", (data) => {
           socket.broadcast.to(roomchat.id).emit("Sever_render_typing" , {
                infor : res.locals.userclient,
                type : data
           } )
        })
      })
      // const datausershop = await usershop.findOne({
      //    _id : id
      // })
      
      const bongchat = await room.find({ users: userid }).sort({ position: -1 });

    let handlebongchat = bongchat.map((item) => {
     
        let newdata = item.users.filter((iduser) => {
         return iduser !== userid 
        })
        return newdata.toString()
      
    })
    
   let userbongchat = await Promise.all(handlebongchat.map( async (item) => {
      const data = await usershop.findOne({ _id: item});
      console.log(item)
      console.log(data)
      return data
    }))
   console.log(userbongchat)
 
  
    



      const roomchat = await room.findOne({
         users: { $all: arrayuser, $size: arrayuser.length }
      })
      let newdata = null
      if(roomchat){
           newdata = await chat.find({
            room_chat_id : roomchat.id
         })
         
         if(newdata){
            for(const item of newdata){
               const datauser = await usershop.findOne({
                  _id : item.user_id
               })
               if(datauser)
               {item.infor = datauser}
            }
         }
      }
      let datashop = null
      if(id.length > 20){
           datashop = await usershop.findOne({
            _id : id
         })
      }
 res.render("client/page/chat/index",
    {
        data : newdata,
        userid : userid,
        bongchat : userbongchat,
        datauser : datashop
    }
 )
}