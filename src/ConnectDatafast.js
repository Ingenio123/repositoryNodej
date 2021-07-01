const axios  = require("axios")

const  sendCheckOut = async () =>{

    const params = new URLSearchParams({
        entityId: '8a829418533cf31d01533d06f2ee06fa',
        amount: 92.00,
        currency: 'USD',
        paymentType: 'DB',

    })
    const url =  'https://test.oppwa.com/v1/checkouts?' + params;
    const data = {};
 
    const res = await axios.post(url,data,{headers:{
        'Authorization':'Bearer OGE4Mjk0MTg1MzNjZjMxZDAxNTMzZDA2ZmQwNDA3NDh8WHQ3RjIyUUVOWA=='
    }})
    
    console.log(res.data);
}




// "https://test.oppwa.com/v1/checkouts?entityId=8ac7a4c87a1e95a8017a1fd6acae073c&amount=3&currency=USD&paymentType=DB&customer.givenName=carlos&customer.middleName=alexander&customer.surname=Arteaga&customer.ip=181.39.246.76&customer.merchantCustomerId=60b800c52963f559f9db99eb&merchantTransactionId=transaction_112233&customer.email=usuario@gmial.com&customer.identificationDocType=IDCARD&customer.identificationDocId=1234567890&customer.phone=0993909800&billing.street1=Guayaquil&billing.country=EC&billing.postcode=230112&shipping.street1=Guayaquil&shipping.country=EC&risk.parameters[USER_DATA2]=DATAFAST&customParameters[SHOPPER_MID]=1000000505&customParameters[SHOPPER_TID]=PD100406&customParameters[SHOPPER_ECI]=0103910&customParameters[SHOPPER_PSERV]=17913101&customParameters[SHOPPER_VAL_BASE0]=2.00&customParameters[SHOPPER_VAL_BASEIMP]=1.00&customParameters[SHOPPER_VAL_IVA]=0.12&cart.items[0].name=cursoIngles&cart.items[0].description=Descripcion:cursoIngles&cart.items[0].price=10&cart.items[0].quantity=1&customParameters[SHOPPER_VERSIONDF]=2&testMode=EXTERNAL "


// "https://test.oppwa.com/v1/checkouts
// ?entityId=8ac7a4c87a1e95a8017a1fd6acae073c
// &amount=5
// &currency=USD
// &paymentType=DB

// &customer.givenName=carlos
// &customer.middleName=alexander
// &customer.surname=Arteaga
// &customer.ip=181.39.246.76
// &customer.merchantCustomerId=2N56455314NGFFGHFG  ---> ID del cliente que esta haciendo la compra 
// &merchantTransactionId=transaction_112233        ---> de transacción comercial 
// &customer.email=usuario@gmial.com                ---> correo  del usaurio
// &customer.identificationDocType=IDCARD           ---> de documento de identificación
// &customer.identificationDocId=1234567890         ---> C ID de documento de identificación numero de cedula 
// &customer.phone=0993909800                       ---> numero de celular


// &billing.street1=Guayaquil 
// &billing.country=EC
// &billing.postcode=230112
// &shipping.street1=Guayaquil
// &shipping.country=EC

// &risk.parameters[USER_DATA2]=DATAFAST

// &customParameters[SHOPPER_MID]=1000000505
// &customParameters[SHOPPER_TID]=PD100406
// &customParameters[SHOPPER_ECI]=0103910
// &customParameters[SHOPPER_PSERV]=17913101
// &customParameters[SHOPPER_VAL_BASE0]=2.00
// &customParameters[SHOPPER_VAL_BASEIMP]=1.00
// &customParameters[SHOPPER_VAL_IVA]=0.12

// &cart.items[0].name=cursoIngles
// &cart.items[0].description=Descripcion:cursoIngles
// &cart.items[0].price=10
// &cart.items[0].quantity=1

// &customParameters[SHOPPER_VERSIONDF]=2
// &testMode=EXTERNAL "

















const dataApi = (entityId,items,total,valorIva,base12,base0,email,primer_nombre,segundo_nombre,apellido,cedula,trx,ip_address,telefon,direcion_cliente,pasico_cliente,direcion_entrega,pais_entrega,postCode)=>{
    
}

const SendShop = async (req,res,next)=>{
    const {} = req.body;
    await axios.post()
}  

module.exports = {
    sendCheckOut
}





