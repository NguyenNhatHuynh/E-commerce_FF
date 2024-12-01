


console.log("ok đã chạy vào đây đước")
const addcart = document.querySelectorAll("[addcart]")
console.log(addcart)
//thêm vào giỏ hàng ở trang chủ
addcart.forEach((item) => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const id = item.getAttribute("addCart")
        const shop = item.getAttribute("idshop")
        const form = document.querySelector("[formaddcart]")
        console.log(form)
        form.action = `/cart/featured/${shop}/${id}`
        form.submit()
    })
})
const form = document.querySelector("[formaddcart]");
if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
    });

}


//nut seach
const buttonsubmitseachproductindex = document.querySelector("[buttonsubmitseachproductindex]")
if (buttonsubmitseachproductindex) {
    buttonsubmitseachproductindex.addEventListener('click', () => {
        const seach = document.querySelector("[seachproductindex]")
        let url = new URL(window.location.href)
        console.log(seach.value)
        if (seach.value) {
            url.searchParams.set("key", seach.value)
        }
        else {
            url.searchParams.delete("key")
        }
        window.location.href = url.href

    })

}




//ho tro tim kiem socket
const seachproductsindex = document.querySelector("[seachproductindex]")
if (seachproductsindex) {
    seachproductsindex.addEventListener("keyup", () => {
        console.log(seachproductsindex.value)
        const suggestionssearch = document.querySelector("[suggestionssearch]")
        suggestionssearch.innerHTML = ""
        socket.emit("client_send_keyword_seachindex", {
            data: seachproductsindex.value,
        })
    })
}

socket.on("sever_render_keyword_seachindex", (data) => {
    const suggestionssearch = document.querySelector("[suggestionssearch]")
    console.log(data)
    let newli = ``
    let newdata = data.data.slice(0, 8);

    newdata.forEach((item) => {
        console.log(item)
        newli += `<li lihelpseach="${item[0]}">${item[0]}</li>`
    })
    if (suggestionssearch) {
        suggestionssearch.innerHTML = `${newli}`
    }
    const allliseach = document.querySelectorAll("[lihelpseach]")
    allliseach.forEach((item) => {
        item.addEventListener("click", () => {
            const datali = item.getAttribute("lihelpseach")
            seachproductsindex.value = datali
            const buttonsubmitseachproductindex = document.querySelector("[buttonsubmitseachproductindex]");
            buttonsubmitseachproductindex.click();
        })

    })
})


//tim kiem theo danh muc con 
const childrencategory = document.querySelectorAll("[idcategory]")
console.log(childrencategory)
if (childrencategory) {
    childrencategory.forEach((item) => {
        item.addEventListener("click", () => {
            let url = new URL(window.location.href)
            const data = item.getAttribute("idcategory")
            console.log(data)
            if (data) {
                url.searchParams.set("categorychildren", data)
            }
            else {
                url.searchParams.delete("categorychildren")
            }
            window.location.href = url.href
        })
    })
}




//tang số lượng trang chi tiết
const qualitycart = document.querySelector("[qualitycart]")
console.log(qualitycart)
if (qualitycart) {
    const btntang = qualitycart.querySelector(".btn-up")
    const btngiam = qualitycart.querySelector(".btn-down")
    btntang.addEventListener("click", () => {
        const input = qualitycart.querySelector("[input]")
        console.log(input.value)
        input.value = +input.value + 1
    })
    btngiam.addEventListener("click", () => {
        const input = qualitycart.querySelector("[input]")
        console.log(parseInt(input.value))
        if(parseInt(input.value) > 1){
            input.value = parseInt(input.value) - 1
        }
    })
}


//thêm vào giỏ hàng
const buttoncart = document.querySelector("[addcartdetail]")
if (buttoncart) {
    buttoncart.addEventListener('click', () => {
        console.log('daxdd chạy vào đây')
        const form = document.querySelector("[formdetail]")
        const id = buttoncart.getAttribute("addcartdetail")
        const shopid = buttoncart.getAttribute("shopid")
        const quality = qualitycart.querySelector("[input]")
        form.action = `/cart/detail/${shopid}/${id}/${quality.value}`
        form.submit()
    })
}



//danh gia detail

const ratingdetail = document.querySelectorAll("[aria-hidden]")
if (ratingdetail) {
    ratingdetail.forEach((item) => {
        item.addEventListener("click", () => {
            const check = item.hasAttribute("havechoice")
            console.log(check)
            if (check) {
                item.removeAttribute("havechoice")
                const index = item.getAttribute("aria-hidden")
                for (let i = parseInt(index); i <= 5; i++) {
                    let newrate = document.querySelector(`[aria-hidden = "${i}"]`)
                    newrate.removeAttribute("havechoice")
                }
            }
            else {
                item.setAttribute("havechoice", '')
                const index = item.getAttribute("aria-hidden")
                for (let i = parseInt(index); i > 0; i--) {
                    let newrate = document.querySelector(`[aria-hidden = "${i}"]`)
                    newrate.setAttribute("havechoice", "")
                }
            }
        })
    })
}



//up load nhiều ảnh
const formsbreviewdetail = document.querySelector("[formsbreviewdetail]")
console.log(formsbreviewdetail)
if (formsbreviewdetail) {

    const upload = new FileUploadWithPreview.FileUploadWithPreview('upload-images', {
        multiple: true,
        maxFileCount: 6
    });

    formsbreviewdetail.addEventListener('submit', (e) => {
        e.preventDefault()
        const inputimage = formsbreviewdetail.querySelector("[images]")
        const rating = formsbreviewdetail.querySelector("[rating]")
        const countrating = document.querySelectorAll("[havechoice]")
        rating.value = countrating.length
        const fileList = new DataTransfer();
        for (const file of upload.cachedFileArray) {
            fileList.items.add(file);
        }
        inputimage.files = fileList.files;

        console.log(inputimage.files)
        formsbreviewdetail.submit()

    })
}





//nut tang so luong trong trang gio hang
const qualityincart = document.querySelector("[qualityincart]")
if (qualityincart) {
    const datacart = qualityincart.querySelectorAll("[datacart]")
    datacart.forEach((item) => {
        const input = item.querySelector("[inputcart]")
        const idproducts = input.getAttribute("idsanpham")
        const inputprice = item.querySelector("[priceoneproducts]")
        const price = inputprice.getAttribute("priceoneproducts")
        const btntang = item.querySelector(".btn-up")
        const btngiam = item.querySelector(".btn-down")
        btntang.addEventListener('click', () => {
            input.value = parseInt(input.value) + 1
            socket.emit("cliend_send_quality_cart",{
              quality : input.value,
              idproduct : idproducts,
              price : price,
              action : "tang"
             })
        })
        btngiam.addEventListener('click', () => {
          if(parseInt(input.value) > 1){
            input.value = parseInt(input.value) - 1
            socket.emit("cliend_send_quality_cart",{
                quality : input.value,
                idproduct : idproducts,
                price : price,
                action : "giam"
               })
          }
        })

    })
}


socket.on("sever_render_dataquality_cart",(data)=>{
   if(data.action == "giam"){
    const total = document.querySelector("[totalcartuser]")
    const price = total.innerHTML
    
    const newprice = parseFloat(price.replace(/[^0-9]/g, '')) - parseFloat(data.price.replace(/[^0-9]/g, ''))
    total.innerHTML = newprice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' VNĐ'
   }
   else{
    const total = document.querySelector("[totalcartuser]")
    const price = total.innerHTML
    
    const newprice = parseFloat(price.replace(/[^0-9]/g, '')) + parseFloat(data.price.replace(/[^0-9]/g, ''))
    total.innerHTML = newprice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' VNĐ'
   }
})

//input tang so luong
// const input = document.querySelectorAll("[inputcart]")
// input.forEach((item) => {
//     item.addEventListener('change', () => {
//         console.log("Đã chạy vào đây")
//         const id = item.getAttribute("idsanpham")
//         const form = document.querySelector("[formchangeinput]")
//         form.action = `/cart/cartuser/${id}/${item.value}`
//         form.submit()
//     })
// })


//xóa sản phẩm trong giỏ hàng
if (qualityincart) {
    const buttondelete = qualityincart.querySelectorAll("[buttondeletecart]")
    buttondelete.forEach((item) => {
        item.addEventListener("click", () => {
            console.log("đã chạy vào đây")
            Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!"
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        title: "Deleted!",
                        text: "Your file has been deleted.",
                        icon: "success"
                    });
                    const id = item.getAttribute("buttondeletecart")
                    socket.emit("client_render_wanttodelete_cart",{
                        id : id
                    })
                }
            })
        })
    })
}



socket.on("sever_render_respond_cartdeleted",(data) => {
    const parent = document.querySelector("[qualityincart]")
    const cart = document.querySelector(`[idcartuserclient="${data.id}"]`)
    const input = cart.querySelector("[inputcart]")
    const price = input.getAttribute("priceoneproducts")
    const quality = input.value
   
    const deleteprice = parseFloat(price.replace(/[^0-9]/g, '')) * parseFloat(quality)


    const total = document.querySelector("[totalcartuser]")
    const pricetotal = total.innerHTML

    const newtotal = parseFloat(pricetotal.replace(/[^0-9]/g, '')) - deleteprice

    total.innerHTML = newtotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' VNĐ'
    parent.removeChild(cart)
 
})



// muốn thanh toán những sản phẩm nào
const checkchoosecart = document.querySelectorAll("[datacart]")
if(checkchoosecart){
    checkchoosecart.forEach((item) => {
        const checkcart = item.querySelector("[checkchoosecart]")
        checkcart.addEventListener("click",() => {
            const idcart = checkcart.getAttribute("idcartuser")
            const boon = checkcart.checked 
            socket.emit("client_render_check_cartuserclient",{
                type : boon,
                id : idcart
            })
        })
    })
}

socket.on("sever_render_check_cartuserrespond",(data) => {
    const cartrespond = document.querySelector(`[idcartuserclient="${data.id}"]`)
    const input = cartrespond.querySelector("[inputcart]")
    const price = input.getAttribute("priceoneproducts")
    const quality = input.value

    const totalprice = parseFloat(price.replace(/[^0-9]/g, '')) * parseFloat(quality)


    const total = document.querySelector("[totalcartuser]")
    const pricetotal = total.innerHTML

    let newtotal = 0
    if(data.type == true){
         newtotal = parseFloat(pricetotal.replace(/[^0-9]/g, '')) + totalprice
    }
    else{
         newtotal = parseFloat(pricetotal.replace(/[^0-9]/g, '')) - totalprice
    }
    total.innerHTML = newtotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' VNĐ'
})



// gui id chat
const iduserchat = document.querySelector("[datauserid]")
console.log(iduserchat)
if (iduserchat) {
    const id = iduserchat.getAttribute("datauserid")
    iduserchat.addEventListener("click", () => {
        const form = document.querySelector("[submitchat]")
        form.action = `/chat/${id}`
        form.submit()
    })
}


//show alert
const showalert = document.querySelector("[show-alert]")
if (showalert) {
    setTimeout(() => {
        showalert.classList.add("alert-hidden")
    }, 5000)
    const buttonclose = document.querySelector("[close-alert]")
    buttonclose.addEventListener('click', () => {
        showalert.classList.add("alert-hidden")
    })
}


// xem profile
const profile = document.querySelector("[formsubmitprofile]")
console.log(profile)
if(profile){
    profile.addEventListener("submit",(e) => {
        e.preventDefault()
        const file = document.querySelector("[fileavataprofile]")
        const place = document.querySelector("[placeputfile]")
        place.appendChild(file)
        profile.submit()
    })
}


//xem chi tiết hóa đơn

const viewdetailinvoiceclient = document.querySelectorAll("[viewdetailinvoiceclient]")
if(viewdetailinvoiceclient){
   console.log(viewdetailinvoiceclient)
   viewdetailinvoiceclient.forEach((item) => {
    item.addEventListener("click",() => {
        const id = item.getAttribute("viewdetailinvoiceclient")
        const detail = document.querySelectorAll(`[handledetailinvoiceclient="${id}"]`)
        detail.forEach((item) => {
            item.classList.toggle("show")
        })
    })
   })
}

// xem trang thái hóa đơn

const handleinvoicedetailclient = document.querySelector("[handleinvoicedetailclient]")
if(handleinvoicedetailclient){
    const li = handleinvoicedetailclient.querySelectorAll("[position]")
    li.forEach((item) => {
        item.addEventListener("click" , () => {
            let url = new URL(window.location.href)
  


            const id = item.getAttribute("position")
            console.log(id)
            url.searchParams.set("id",id)
            window.location.href = url.href
        })
    })
}


// hủy hoặc hoàn đơn
const handlecancelinvoiceprofileclient = document.querySelectorAll("[handlecancelinvoiceprofileclient]")
console.log(handlecancelinvoiceprofileclient)
if(handlecancelinvoiceprofileclient){
    handlecancelinvoiceprofileclient.forEach((item) => {
        item.addEventListener("click",() => {
            Swal.fire({
                title: "Bạn Chắc Chứ",
                text: "Bạn muốn hủy hoặc hoàn đơn",
                icon: "info",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Đồng Ý"
              }).then((result) => {
                if (result.isConfirmed) {
                  Swal.fire({
                    title: "Đã Xác Nhận!",
                    text: "Yêu cầu thành công",
                    icon: "success"
                  });
                
                  const action = item.getAttribute("handlecancelinvoiceprofileclient")
                  const form = document.querySelector("[formhandlecancelinvoiceclient]")
                  form.action = action
                  form.submit()
                }
              });
         
        })
    })
}



//sử dụng voucher

const voucherclientpay = document.querySelectorAll("[voucherclientpay]")
if(voucherclientpay){
    voucherclientpay.forEach((item) => {
        const button = item.querySelector("[buttonusevoucher]")
        console.log(button)
        if(button){
            button.addEventListener("click",() => {
                Swal.fire({
                    title: "Bạn Chắc Chứ",
                    text: "Bạn muốn sử dụng voucher này",
                    icon: "info",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Đồng Ý"
                  }).then((result) => {
                    if (result.isConfirmed) {
                      Swal.fire({
                        title: "Đã Xác Nhận!",
                        text: "Yêu cầu thành công",
                        icon: "success"
                      });
                    
                      const id = button.getAttribute("id")
                      let url = new URL(window.location.href)
                      if(id){
                       url.searchParams.set("id",id)
                      }
                      window.location.href = url.href
                    }
                  });
              
            })
        }
    })
}



// hiển thị model
const buttonmodelvoucherclient = document.querySelectorAll("[buttonmodelvoucherclient]")
if(buttonmodelvoucherclient){
   buttonmodelvoucherclient.forEach((item) => {
    item.addEventListener("click", () => {
        console.log("đã chạy vào đay")
        const modelvoucherclient = document.querySelector("[modelvoucherclient]")
         modelvoucherclient.classList.toggle("hidden")
    })
   })
}



const formsubmitseachclienttongquang = document.querySelector("[formsubmitseachclienttongquang]")
console.log(formsubmitseachclienttongquang)
if(formsubmitseachclienttongquang){
    formsubmitseachclienttongquang.addEventListener("submit",(e) => {
       console.log("đã chạy vào đây")
       e.preventDefault()
       formsubmitseachclienttongquang.action="/products/middle"
       formsubmitseachclienttongquang.method="post"
       formsubmitseachclienttongquang.submit()
    })
}
