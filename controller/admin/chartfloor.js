const Statistics = require("../../models/staticsenma")
module.exports.index = async (req,res) => {
  const datatotalrevenu = []
  for(let i = 0 ; i < 12 ; i++){
    datatotalrevenu.push({
         month : i + 1,
         total : 0,
         totalrevenue : 0,
         revenu : 0,
         register : 0
    })
  }
   const  statistic = await Statistics.find({

   })
   for(const item of statistic){
      const month = item.date.split("-")
      console.log(month)
      const getelement = datatotalrevenu.findIndex((item) => item.month == month[1])
      datatotalrevenu[getelement].total = datatotalrevenu[getelement].total + item.totaltransaction + item.totalregister  
      datatotalrevenu[getelement].totalrevenue = datatotalrevenu[getelement].totalrevenue + item.revenue + item.totalregister
      datatotalrevenu[getelement].revenu += item.revenue
      datatotalrevenu[getelement].register += item.totalregister
   }
   console.log(datatotalrevenu)
  res.render("admin/page/chartfloor/index.pug",
   {datatotalrevenuadmin : datatotalrevenu}
)
}