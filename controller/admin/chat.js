const chat = require("../../models/chat")
const userclient = require("../../models/accountuser")
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
   const id = req.query.id
   const user = await usershop.findOne({
      token : req.cookies.token
   })

   const userid = user.id
   const arrayuser = []
   arrayuser.push(id)
   arrayuser.push(userid)
   const dataroom = await room.findOne({
      users: { $all: arrayuser, $size: arrayuser.length }
   })
   if(!dataroom && id){
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
      

        socket.on("client_send_messages", async (data) => {
            const images = [];
            for (const image of data.images) {
               const url = await uploadToCloudinary(image);
               images.push(url);
            }
           
            console.log(data)
           if(data){
               const info = {
                  user_id : userid,
                  content: data.content,
                  images: images,
                  room_chat_id : roomchat.id
               }
               
               const mess = new chat(info)
               await mess.save()
               
               _io.to(roomchat.id).emit("Sever_render_mess_client", {
                  content : mess.content,
                  userid : mess.user_id,
                  infor : user,
                  images: images  
               })
              
           }
           

          }
      
   )
        socket.on("client_send_typing", (data) => {
           socket.broadcast.to(roomchat.id).emit("Sever_render_typing" , {
                infor : user,
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
    let userbongchat = null
    try {
       userbongchat = await userclient.find({ _id: { $in: handlebongchat } });
    } catch (error) {
      
    }

    
    let newdata
    let infor = null

      if(id){
         const roomchat = await room.findOne({
            users: { $all: arrayuser, $size: arrayuser.length }
         })
         console.log(roomchat.id)
          newdata = await chat.find({
            room_chat_id : roomchat.id
         })
         if(newdata){
            for(const item of newdata){
               const datauser = await userclient.findOne({
                  _id : item.user_id
               })
               if(datauser){
                 if(infor == null)
                  {
                     infor = datauser
                  }
               item.nameuser = datauser.fullName
               item.avatar = datauser.avatar
               }
            }
         }   
      }
      else{
         newdata = null
      }
      console.log(infor)
 res.render("admin/page/chat/index",
    {
        data : newdata,
        userid : userid,
        bongchat : userbongchat,
        infor : infor
    }
 )
}