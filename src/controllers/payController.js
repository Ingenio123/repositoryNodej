const axios = require('axios');
const https = require('https');
const Student = require('../models/student');
const User  = require('../models/user')
const Course = require('../models/courses')
const  ClientPay =  async (req,res,next)=>{
    const {
        City,
        Country,
        PostCode,
        firstName,
        lastName,
        numberCedula,
        numberCellPhone,
        secondName,
        ipClient, 
        Cobrar,
        SumaPrices,
        items,
        id,
        email
    } = req.body;

    
    console.log(City,
        Country,
        PostCode,
        firstName,
        lastName,
        numberCedula,
        numberCellPhone,
        secondName,
        ipClient, 
        Cobrar,
        SumaPrices,
        items,
        id,
        email)
    let cobrar = String(Cobrar)
    if(EncontrarNumero(cobrar, '.')){
        cobrar = cobrar + 0
    }


    const resultados = await SendDatafast(City,Country,PostCode,firstName,secondName,lastName,numberCedula,numberCellPhone,ipClient,cobrar,SumaPrices,items,id,email)


    return res.status(200).json({
        message:'todo  salio bien tranquilo hombre',
        resultados
    })

}

const SendDatafast  = async (City,Country,PostCode,firstNameParams,secondName,lastName,numberCedula,numberCellPhone,ipClientParams,Cobrar,SumaPrices,items,idClient,email) =>{

    const number_Cedula = parseInt(numberCedula);
    const city = String(City);
    const country = String(Country);
    const CodePostal = parseInt(PostCode);
    const firstName = String(firstNameParams)
    const SecondName = String(secondName)
    const surname = String(lastName)
    const numberPhone = String(numberCellPhone)
    const ipClient = String(ipClientParams)
    const amount =  Cobrar;
    const VALOR_PRODUCTO =  parseInt(SumaPrices);
    const VALOR_IVA = addIva(VALOR_PRODUCTO,12)

    
    // const entityId='8ac7a4c87a1e95a8017a1fd6acae073c'
    
    const entityId='8ac9a4cb7aa3ea13017ab0abd88775d3'

    // #######################################
    var valores = DestructArray(items)
    const valorestotales = valores.join("&")
    // ######################################

        const data={};
        const agent = new https.Agent({  
            rejectUnauthorized: false
        });
        
        // const url = `https://test.oppwa.com/v1/checkouts?entityId=${entityId}&amount=${amount}&currency=USD&paymentType=DB&customer.givenName=${firstName}&customer.middleName=${SecondName}&customer.surname=${surname}&customer.ip=${ipClient}&customer.merchantCustomerId=${idClient}&merchantTransactionId=transaction_112233&customer.email=${email}&customer.identificationDocType=IDCARD&customer.identificationDocId=${number_Cedula}&customer.phone=${numberPhone}&billing.street1=${city}&billing.country=${country}&billing.postcode=${CodePostal}&shipping.street1=${city}&shipping.country=${country}&risk.parameters%5BUSER_DATA2%5D=INGENIO&customParameters%5BSHOPPER_MID%5D=1000000505&customParameters%5BSHOPPER_TID%5D=PD100406&customParameters%5BSHOPPER_ECI%5D=0103910&customParameters%5BSHOPPER_PSERV%5D=17913101&customParameters%5BSHOPPER_VAL_BASE0%5D=0&customParameters%5BSHOPPER_VAL_BASEIMP%5D=${VALOR_PRODUCTO}&customParameters%5BSHOPPER_VAL_IVA%5D=${VALOR_IVA}&${valorestotales}&customParameters%5BSHOPPER_VERSIONDF%5D=2&testMode=EXTERNAL`

        const url = `https://oppwa.com/v1/checkouts?entityId=${entityId}&amount=${amount}&currency=USD&paymentType=DB&customer.givenName=${firstName}&customer.middleName=${SecondName}&customer.surname=${surname}&customer.ip=${ipClient}&customer.merchantCustomerId=${idClient}&merchantTransactionId=transaction_112233&customer.email=${email}&customer.identificationDocType=IDCARD&customer.identificationDocId=${number_Cedula}&customer.phone=${numberPhone}&billing.street1=${city}&billing.country=${country}&billing.postcode=${CodePostal}&shipping.street1=${city}&shipping.country=${country}&risk.parameters%5BUSER_DATA2%5D=INGENIO&customParameters%5BSHOPPER_MID%5D=4200003938&customParameters%5BSHOPPER_TID%5D=BP374772&customParameters%5BSHOPPER_ECI%5D=0103910&customParameters%5BSHOPPER_PSERV%5D=17913101&customParameters%5BSHOPPER_VAL_BASE0%5D=0&customParameters%5BSHOPPER_VAL_BASEIMP%5D=${VALOR_PRODUCTO}&customParameters%5BSHOPPER_VAL_IVA%5D=${VALOR_IVA}&${valorestotales}&customParameters%5BSHOPPER_VERSIONDF%5D=2`

        try {
            let resultados = await axios.post(url,data,{
                httpsAgent : agent,
                headers:{
                    'Authorization':'Bearer OGFjOWE0Y2I3YWEzZWExMzAxN2FiMGE5Y2ViZjc1YTh8aHN5RzlrSmtBbQ=='
                }
            })
            return resultados.data;
            
        } catch (error) {
            console.log(error)
        }   


}


const EncontrarNumero = (numero,numEncontrar)=>{
    return numero.indexOf(numEncontrar) != -1;
}

const addIva = (SumPrices,valIva)=>{
       // resultado = (120 * 12) / 100 
    let cobrarIva = (SumPrices * valIva)/100;
    return cobrarIva;

}

const DestructArray = (arrayData)=>{
    let datos = [];
    arrayData.map((item,i)=>{
        datos.push(`cart.items%5B${i}%5D.name=${item.idiom}&cart.items%5B${i}%5D.description=Descripcion%3A${item.lesson}&cart.items%5B${i}%5D.price=${item.price}&cart.items%5B${i}%5D.quantity=1`)
    })
    return datos;
}

const datafastResultEnd = async (req,res,next)=>{

    const {id} = req.body;
    const entityId = '8ac7a4c87a1e95a8017a1fd6acae073c';
    data={};
    
    // const url = `https://test.oppwa.com/v1/checkouts/${id}/payment?entityId=${entityId}`
    const url = `https://oppwa.com/v1/checkouts/${id}/payment?entityId=${entityId}`
    console.log(url)
    
    try {

        axios.get(url,{
            headers:{
                "content-type":"application/json",   
                "Authorization": 'Bearer OGE4Mjk0MTg1YTY1YmY1ZTAxNWE2YzhjNzI4YzBkOTV8YmZxR3F3UTMyWA=='
            }
        })
        .then((resultado) =>{
            AddStudent(resultado.data.result.code,   resultado.data.customer.email)
            addCourse(resultado.data.customer.email,  resultado.data.cart.items.map((item,index)=> item.name))
            return res.status(200).json({
            success:true,
            message: 'todo salio bien',
            resultado: resultado.data
        })} )
        .catch((err)=>{
            return res.status(400).json({
                success:false,
                message: "no todo salio bien"
            })
        })

    } catch (error) {
        return res.status(400).json({
            success:false,
            message: "ya realizo la peticion no se puede realizar 2 veces"
        })
    }
}

const AddStudent = async(codeResultado,emailCustomer)=>{
    if(codeResultado === '000.100.112'){
        //ESTO SI ESTA CORRECTO 
        VerificarSiExisteStudent(emailCustomer);
        const DataUser =  await User.findOneAndUpdate({email: emailCustomer}, {$set:{student:true}},{
            useFindAndModify:false
        })
        const StudentResult  =  await  User.findById({_id:DataUser._id})
        if(StudentResult.student === false ){
            const NuevoStudent =  new Student({
                username: StudentResult.username,
                age: StudentResult.age,
                email: StudentResult.email,
            })
            await NuevoStudent.save();
        }
    }
}

const  addCourse =  async (email,nameCourses)=>{
    
    const fetching = async () => {
        const idStudent = await Student.findOne({email})

        for (const url of nameCourses) {
            var result = await Course.findOne({nameCourse:url})
            console.log(result)

            await Student.findByIdAndUpdate({_id:idStudent._id},{
                $push:{courses:result._id}
            },{
                useFindAndModify: false 
            }).populate('Courses');  
        }
    }
    fetching()
}

const VerificarSiExisteStudent = async(email)=>{
    /* 
         ->  verificar  --> si ya es estudiante 
            ->  
    */

    const userQuery  = await User.findOne({email: email});
    if(userQuery.student) return true;
    next();
}


module.exports = {
    ClientPay,
    datafastResultEnd
}