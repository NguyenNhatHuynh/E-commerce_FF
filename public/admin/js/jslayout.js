
const Button = document.querySelectorAll("[button-status]")
if (Button.length > 0) {
    let url = new URL(window.location.href)
    Button.forEach((item) => {
        item.addEventListener("click", () => {
            const status = item.getAttribute("button-status")
            if (status) {
                url.searchParams.set("status", status)
            }
            else {
                url.searchParams.delete("status")
            }
            window.location.href = url.href
        })
    })
}
console.log("đã chạy vào đây")

//tìm kiếm
const form = document.querySelector("#form-seach")
if (form) {
    let url = new URL(window.location.href)
    form.addEventListener("submit", (e) => {
        e.preventDefault()
        const data = e.target.elements.keyword.value
        if (data) {
            url.searchParams.set("key", data)
        }
        else {
            url.searchParams.delete("key")
        }
        window.location.href = url.href
    })
}




// tính năng phân trang
const buttonpaginet = document.querySelectorAll("[buttonpaginet]")
if (buttonpaginet.length > 0) {
    let url = new URL(window.location.href)
    buttonpaginet.forEach((item) => {
        item.addEventListener("click", () => {
            const page = item.getAttribute("buttonpaginet")
            if (page) {
                url.searchParams.set("page", page)
            }
            else {
                url.searchParams.delete("page")
            }
            window.location.href = url.href
        })
    })
}


//tính năng thay đổi trạng thái sản phẩm
const buttonchangestatus = document.querySelectorAll("[buttonchangestatus]")
if (buttonchangestatus.length > 0) {
    const form = document.querySelector("[form-change-status]")
    const path = form.getAttribute("data-path")
    buttonchangestatus.forEach((item) => {
        item.addEventListener('click', () => {
            console.log("đã chạy vào đây")
            const status = item.getAttribute("status")
            const id = item.getAttribute("id")
            const statusuppdate = status == "active" ? "inactive" : "active"
            const action = `${path}/${statusuppdate}/${id}?_method=PATCH`
            form.action = action
            form.submit();
        })
    })
}


//tính năng checkall
const checkboxfather = document.querySelector("[checkboxfather]")
if (checkboxfather) {
    const checkall = checkboxfather.querySelector("input[name='checkall']")
    const input = checkboxfather.querySelectorAll("input[name='id']")
    checkall.addEventListener('click', () => {
        if (checkall.checked == true) {
            input.forEach((item) => {
                item.checked = true
            })
        }
        else {
            input.forEach((item) => {
                item.checked = false
            })
        }

    })
    input.forEach((item) => {
        item.addEventListener('click', () => {
            const inputcheck = checkboxfather.querySelectorAll("input[name='id']:checked")
            if (input.length == inputcheck.length) {
                checkall.checked = true
            }
            else {
                checkall.checked = false
            }
        })
    })
}



// tính năng thay đổi all
const formchangemulti = document.querySelector("[form-change-multi]")
if (formchangemulti) {
    formchangemulti.addEventListener('submit', async (e) => {
        e.preventDefault()
        const type = e.target.elements.type.value
        const input = checkboxfather.querySelectorAll("input[name='id']:checked")
        if (input.length > 0) {
            if (type == "deleteall") {
                const result = await Swal.fire({
                    title: "Are you sure?",
                    text: "You won't be able to revert this!",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Yes, delete it!"
                })
                if (!result.isConfirmed) {
                  return
                }
                }
                const inputall = formchangemulti.querySelector("input[name='ids']")
                let inputchange = ""
                input.forEach((item) => {
                    inputchange += item.value + ','
                })
                inputall.value = inputchange.slice(0, inputchange.length - 1)
                formchangemulti.submit()
            }
            else {
                Swal.fire("Vui Lòng Chọn Một Bảng Ghi");
            }

        })

}



// tính năng xóa            
const buttondelete = document.querySelectorAll("[button-delete]")
if (buttondelete) {
    const formdelete = document.querySelector("[form-delete]")
    buttondelete.forEach((item) => {
        item.addEventListener('click', () => {
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
                    const path = formdelete.getAttribute("data-path")                    
                    const dataid = item.getAttribute("data")
                    const action = `${path}/${dataid}?_method=DELETE`
                    console.log(action)
                    formdelete.action = action
                    formdelete.submit()
                }
            })

        })
    })
}



// tính năng showalert
const showalert = document.querySelector("[show-alert]")
if(showalert)
{
 setTimeout(()=> {
    showalert.classList.add("alert-hidden")
 },5000)
 const buttonclose = document.querySelector("[close-alert]")
 buttonclose.addEventListener('click',() => {
    showalert.classList.add("alert-hidden")
 })
}


// tính năng sắp xếp

const selectsort = document.querySelector('[sort-select]')
if(selectsort){
    let url = new URL(window.location.href)
    selectsort.addEventListener('change',(e) => {
        const [key,value] = selectsort.value.split("-")
        console.log(key,value)
        url.searchParams.set("sortkey",key)
        url.searchParams.set("sortvalue",value)
        window.location.href = url.href
    })
}


const button = document.querySelector("[sort-clear]")
console.log(button)
if(button){
    let url = new URL(window.location.href)
    button.addEventListener('click',() => {
        url.searchParams.delete("sortkey")
        url.searchParams.delete("sortvalue")
        window.location.href = url.href;
    })
}



let url = new URL(window.location.href)
const sortkey = url.searchParams.get("sortkey")
const sortvalue = url.searchParams.get("sortvalue")

if(sortkey && sortvalue){
    const string = `${sortkey}-${sortvalue}`
    const selectsort = document.querySelector('[sort-select]')
    const opption = selectsort.querySelector(`option[value="${string}"]`)
    console.log(string)
    opption.selected = true
}





// tính năng phân quyền
const premisson = document.querySelector("[table-permissions]")
console.log(premisson)
if(premisson)
{
    const buttonupdate = document.querySelector("[button-submit]")
    buttonupdate.addEventListener("click",() => {
        const role = []
        const row = premisson.querySelectorAll("[data-name]")
        row.forEach((row) => {
            const name = row.getAttribute("data-name")
            const input = row.querySelectorAll("input")
            if(name == "id"){
               input.forEach((input) => {
                role.push({
                    id : input.value,
                    premisson : []
     
                  })
               })
            }
            else{
                input.forEach((item,index) => {
                    if(item.checked){
                     role[index].premisson.push(name)
                    }
                })

            }
        })
        const form = document.querySelector("[form-change-permissions]")
        const input = form.querySelector("input")
        input.value = JSON.stringify(role)
        form.submit()
    })
}

const datarecord = document.querySelector("[data-records]")
console.log(datarecord)
if(datarecord){
   const data = JSON.parse(datarecord.getAttribute("data-records"))
   data.forEach((item,index) => {
    item.permissions.forEach((itemchildren) => {
        console.log(itemchildren)
        const tr = premisson.querySelector(`[data-name="${itemchildren}"]`)
        const ip = tr.querySelectorAll("input")
        // console.log(ip)
        // console.log(ip[index])
        ip[index].checked = true
    })
   })
}



// duyệt hồ sơ
const buttonaccept = document.querySelector("[buttonacceptprofileadmin]")
if(buttonaccept){
    const formsubmitprofileadmin = document.querySelector("[data-formsubmitprofileadmin]")
    const email = document.querySelector("[getemailprofileadmin]")


    buttonaccept.addEventListener("click",() => {
        Swal.fire({
            title: "Bạn Chắc Chứ",
            text: "Bạn Muốn CHấp Nhận Hồ Sơ Này",
            icon: "success",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire({
                title: "Đã Xác Nhận!",
                text: "Xác Nhận Thành Công",
                icon: "success"
              });
            
              formsubmitprofileadmin.action = `/admin/accountreview/checkpost/accept/${email.value}`
              formsubmitprofileadmin.submit()
            }
          });
    })
}

// cập nhật trạng thái
const actionstatusotheradmin = document.querySelector("[actionstatusotheradmin]")
if(actionstatusotheradmin){
    const actionstatus = actionstatusotheradmin.querySelectorAll("[actionstatus]")
    actionstatus.forEach((item) => {
        item.addEventListener("click",() => {
            Swal.fire({
                title: "Bạn Chắc Chứ",
                text: "Bạn Muốn Cập Nhật Tiến Độ Tráng Thái Đơn Hàng Này",
                icon: "info",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Đồng Ý"
              }).then((result) => {
                if (result.isConfirmed) {
                  Swal.fire({
                    title: "Đã Xác Nhận!",
                    text: "Xác Nhận Thành Công",
                    icon: "success"
                  });
                  const action = item.getAttribute("actionstatus")
                  const form = actionstatusotheradmin.querySelector("form")
                  form.action = action,
                  form.submit()
                }
              });
            
        })
    })
}


// xet duyet đơn hàng
const formsubmitcheckinvoiceadmin = document.querySelector("[formsubmitcheckinvoiceadmin]")
if(formsubmitcheckinvoiceadmin){
    const buttonsubmitcheckinvoiceadmin = document.querySelectorAll("[buttonsubmitcheckinvoiceadmin]")
    buttonsubmitcheckinvoiceadmin.forEach((item) => {
       item.addEventListener("click",() => {
        Swal.fire({
            title: "Bạn Chắc Chứ",
            text: "Bạn muốn xét duyệt đơn hàng này",
            icon: "info",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Đồng Ý"
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire({
                title: "Đã Xác Nhận!",
                text: "Xét duyệt Thành Công",
                icon: "success"
              });
              const id = item.getAttribute("buttonsubmitcheckinvoiceadmin")
              formsubmitcheckinvoiceadmin.action = `/admin/checkinvoice/handleinvoice/${id}`
              formsubmitcheckinvoiceadmin.submit()
            }
          });
       
       })
    })

}


// xác nhận hoàn thành đơn hàng
if(actionstatusotheradmin){
    const allbutoon = document.querySelectorAll("[actioncheckinvoice]")
    allbutoon.forEach((item) => {
        item.addEventListener("click",() => {
            Swal.fire({
                title: "Bạn Chắc Chứ",
                text: "Bạn muốn xét duyệt đơn hàng này",
                icon: "info",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Đồng Ý"
              }).then((result) => {
                if (result.isConfirmed) {
                  Swal.fire({
                    title: "Đã Xác Nhận!",
                    text: "Xét duyệt Thành Công",
                    icon: "success"
                  });
                  const form = actionstatusotheradmin.querySelector("form")
                  const id = item.getAttribute("actioncheckinvoice")
                  form.action=`/admin/invoice/checkinvoice/${id}`
                  form.submit()
                }
              });
           
        })
    })
}



// đồng ý hủy đơn
const actioncancelinvoiceadmin = document.querySelectorAll("[actioncancelinvoiceadmin]")
if(actioncancelinvoiceadmin){
    actioncancelinvoiceadmin.forEach((item) => {
        item.addEventListener("click",() => {
            Swal.fire({
                title: "Bạn Chắc Chứ",
                text: "Bạn xác nhận đồng ý yêu câu này",
                icon: "info",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Đồng Ý"
              }).then((result) => {
                if (result.isConfirmed) {
                  Swal.fire({
                    title: "Đã Xác Nhận!",
                    text: "Hành Động Thành Công",
                    icon: "success"
                  });
                
                  const action = item.getAttribute("actioncancelinvoiceadmin")
                  const form = document.querySelector("[formactioninvoicecanceladmin]")
                  form.action = action
                  form.submit()
                }
              });
         
        })
    })
}


// đăng ký gia hạn

const btnbuynowdurationadmin = document.querySelectorAll("[btnbuynowdurationadmin]")
console.log(btnbuynowdurationadmin)
if(btnbuynowdurationadmin){
    btnbuynowdurationadmin.forEach((item) => {
        item.addEventListener("click",() => {
            Swal.fire({
                title: "Bạn Muốn Đăng Ký",
                text: "Bạn xác nhận muốn đăng ký gói này",
                icon: "question",
                showCancelButton: true,
                confirmButtonColor: "#2FEBBC",
                cancelButtonColor: "#2FEBBC",
                confirmButtonText: "Đồng Ý"
              }).then((result) => {
                if (result.isConfirmed) {
                  Swal.fire({
                    title: "Đã Xác Nhận!",
                    text: "Hành Động Thành Công",
                    icon: "success"
                  });
                  const data = item.getAttribute("btnbuynowdurationadmin")
                  const form = document.querySelector("[formsubmitbtnbuynowdurationadmin]")
                  form.action =`/admin/maintain/handle/${data}`
                  form.submit()
                }
              });
           
        })
    })
}



// show bieu đồ
const buttonshowbieudotop5sanpham = document.querySelector("[buttonshowbieudotop5sanpham]")
console.log(buttonshowbieudotop5sanpham)
if(buttonshowbieudotop5sanpham){
    buttonshowbieudotop5sanpham.addEventListener("click",() => {
        const cartdetailtop5sanphambanchaynhat = document.querySelector(".cartdetailtop5sanphambanchaynhat")
        cartdetailtop5sanphambanchaynhat.classList.remove("hidden")
        const charttop5sanphambanchaynhat = document.querySelector("[charttop5sanphambanchaynhat]")
        charttop5sanphambanchaynhat.classList.add("hidden")
    })
}

const buttonshowdetailproducts = document.querySelector("[buttonshowdetailproducts]")
if(buttonshowdetailproducts){
    buttonshowdetailproducts.addEventListener("click",() => {
        const cartdetailtop5sanphambanchaynhat = document.querySelector(".cartdetailtop5sanphambanchaynhat")
        cartdetailtop5sanphambanchaynhat.classList.add("hidden")
        const charttop5sanphambanchaynhat = document.querySelector("[charttop5sanphambanchaynhat]")
        charttop5sanphambanchaynhat.classList.remove("hidden")

    })
}


// seo từ khóa shop
const updatedescriptionshopseo = document.querySelector("[updatedescriptionshopseo]")
if(updatedescriptionshopseo){
         updatedescriptionshopseo.addEventListener("click", () => {
             const data = document.querySelector("[contentofdescriptionshopseo]")
             const form = document.createElement("form")
             const input = document.createElement("input")
             input.setAttribute('type', 'text');
             input.setAttribute('name', 'descriptionseo');
             input.value = data.value
             form.appendChild(input)
             document.body.appendChild(form)
             form.action = "/admin/SEO/descriptionshop"
             form.method = "post"
             form.submit()
             
        })
}




// seo từ khóa sản phẩm

const buttonsubmitproductsseoadmin = document.querySelectorAll("[buttonsubmitproductsseoadmin]")
console.log(buttonsubmitproductsseoadmin)
if(buttonsubmitproductsseoadmin){
    buttonsubmitproductsseoadmin.forEach((item) => {
        item.addEventListener("click",() => {
            const id = item.getAttribute("buttonsubmitproductsseoadmin")
            const input = document.querySelector(`[inputproductsseoadmin="${id}"]`)
            console.log(input.value)
            const form = document.createElement("form")
            document.body.appendChild(form)
            form.method="GET"
            form.action = `/admin/SEO/updateword/${id}/${input.value}`
            form.submit()
        })
    })
}




// lock account

const lockaccountadmin = document.querySelector("[lockaccountadmin]")
if(lockaccountadmin){
    lockaccountadmin.addEventListener("click",() => {
        Swal.fire({
            title: "Bạn Muốn Khóa Tài Khoản?",
            text: "Bạn có thể kích hoạt trở lại bằng mã code trong email",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Xác Nhận"
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire({
                title: "Khóa Tài Khoản Thành Công",
                text: "Khóa tài khoản thành công bạn sẽ quay về trang đăng nhập",
                icon: "success"
              });
              const form = document.createElement("form")
              document.body.appendChild(form)
              form.method="post"
              form.action="/admin/myaccount/lock"
              form.submit()
            }
           
          });
    })
}


// tự khóa tk cuẢ mình
const btnlockaccountfrommadmin = document.querySelectorAll("[btnlockaccountfrommadmin]")
if(btnlockaccountfrommadmin){
    btnlockaccountfrommadmin.forEach((item) => {
        if(item){
            item.addEventListener("click", () => {
                Swal.fire({
                    title: "Bạn Muốn Khóa Tài Khoản?",
                    text: "Bạn có thể kích hoạt trở lại bằng mã code trong email",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Xác Nhận"
                  }).then((result) => {
                    if (result.isConfirmed) {
                      Swal.fire({
                        title: "Khóa Tài Khoản Thành Công",
                        text: "Khóa tài khoản thành công bạn sẽ quay về trang đăng nhập",
                        icon: "success"
                      });
                      const id = item.getAttribute("btnlockaccountfrommadmin")
                      const form = document.createElement("form")
                      document.body.appendChild(form)
                        form.method="post"
                        form.action=`/admin/user/lockaccount/${id}`
                        form.submit()

                    }
                   
                  });
            } )
        }
    })
}