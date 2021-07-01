const Role = require('../models/roles')
module.exports = {
    createRoles: async ()=>{
        try {
            const count = await Role.estimatedDocumentCount()
        
            if(count > 0) return ;

            const values = await Promise.all([
                new Role({name:"user"}).save(),
                new Role({name:"admin"}).save(),
                new Role({name:"student"}).save(),
                new Role({name:"teacher"}).save()
            ])
           
        } catch (error) {
            console.log(error)
        }
    }
}