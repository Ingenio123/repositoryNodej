const axios  = require("axios")
const https = require('https')

const  sendCheckOut = async () =>{

    const firstName = 'Carlos',
        secondName = 'Alexander',
        surname = 'Arteaga',
        ipClient = '181.39.246.76',
        idClient = '60b800c52963f559f9db99eb',
        email = 'usuario@email.com',
        Nid = '1234567890',
        numberPhone = 0993909800,
        city = 'Guayaquil',
        country = 'EC',
        CodePostal = 1245,
        entityId='8a829418533cf31d01533d06f2ee06fa',
        amount = 3,
        VALOR_PRODUCTO = 5,
        VALOR_IVA = 0.60,
        NAME_PRODUCT = 'curso de ingles',
        DESCRIPTION_PRODUCT = 'curso de ingenio languages gracias por tu compra',
        PRICE_PRODUCT = 5,
        QUANTY_PRODUCT = 1;

    try {
        

        // https://test.oppwa.com/v1/checkouts?entityId=8ac7a4c87a1e95a8017a1fd6acae073c&amount=3&currency=USD&paymentType=DB&customer.givenName=carlos&customer.middleName=alexander&customer.surname=Arteaga&customer.ip=181.39.246.76&customer.merchantCustomerId=60b800c52963f559f9db99eb&merchantTransactionId=transaction_112233&customer.email=usuario@gmial.com&customer.identificationDocType=IDCARD&customer.identificationDocId=1234567890&customer.phone=0993909800&billing.street1=Guayaquil&billing.country=EC&billing.postcode=230112&shipping.street1=Guayaquil&shipping.country=EC&risk.parameters[USER_DATA2]=DATAFAST&customParameters[SHOPPER_MID]=1000000505&customParameters[SHOPPER_TID]=PD100406&customParameters[SHOPPER_ECI]=0103910&customParameters[SHOPPER_PSERV]=17913101&customParameters[SHOPPER_VAL_BASE0]=2.00&customParameters[SHOPPER_VAL_BASEIMP]=1.00&customParameters[SHOPPER_VAL_IVA]=0.12&cart.items[0].name=cursoIngles&cart.items[0].description=Descripcion:cursoIngles&cart.items[0].price=10&cart.items[0].quantity=1&customParameters[SHOPPER_VERSIONDF]=2&testMode=EXTERNAL
        
        const data={};
        const agent = new https.Agent({  
            rejectUnauthorized: false
          });
        axios.post(`https://test.oppwa.com/v1/checkouts?entityId=${entityId}&amount=${amount}&currency=USD&paymentType=DB&customer.givenName=${firstName}&customer.middleName=${secondName}&customer.surname=${surname}&customer.ip=${ipClient}&customer.merchantCustomerId=${idClient}&merchantTransactionId=transaction_112233&customer.email=${email}&customer.identificationDocType=IDCARD&customer.identificationDocId=${Nid}&customer.phone=${numberPhone}&billing.street1=${city}&billing.country=${country}&billing.postcode=${CodePostal}&shipping.street1=${city}&shipping.country=${country}&risk.parameters%5BUSER_DATA2%5D=DATAFAST&customParameters%5BSHOPPER_MID%5D=1000000505&customParameters%5BSHOPPER_TID%5D=PD100406&customParameters%5BSHOPPER_ECI%5D=0103910&customParameters%5BSHOPPER_PSERV%5D=17913101&customParameters%5BSHOPPER_VAL_BASE0%5D=0&customParameters%5BSHOPPER_VAL_BASEIMP%5D=${VALOR_PRODUCTO}&customParameters%5BSHOPPER_VAL_IVA%5D=${VALOR_IVA}&cart.items%5B0%5D.name=${NAME_PRODUCT}&cart.items%5B0%5D.description=${DESCRIPTION_PRODUCT}&cart.items%5B0%5D.price=${PRICE_PRODUCT}&cart.items%5B0%5D.quantity=${QUANTY_PRODUCT}&customParameters%5BSHOPPER_VERSIONDF%5D=2&testMode=EXTERNAL`,data,{
            httpsAgent : agent,
            headers:{
                'Authorization':'Bearer OGE4Mjk0MTg1MzNjZjMxZDAxNTMzZDA2ZmQwNDA3NDh8WHQ3RjIyUUVOWA=='
            }
        })
        .then(res => console.log(res.data))
        .catch(err =>  console.log('hub.error'))
    
        
    } catch (error) {
        console.log("err", error)
    }

}



// const  url = 'https://test.oppwa.com/v1/checkouts?entityId=8ac7a4c87a1e95a8017a1fd6acae073c&amount=3&currency=USD&paymentType=DB&customer.givenName=carlos&customer.middleName=alexander&customer.surname=Arteaga&customer.ip=181.39.246.76&customer.merchantCustomerId=60b800c52963f559f9db99eb&merchantTransactionId=transaction_112233&customer.email=usuario@gmial.com&customer.identificationDocType=IDCARD&customer.identificationDocId=1234567890&customer.phone=0993909800&billing.street1=Guayaquil&billing.country=EC&billing.postcode=230112&shipping.street1=Guayaquil&shipping.country=EC&risk.parameters[USER_DATA2]=DATAFAST&customParameters[SHOPPER_MID]=1000000505&customParameters[SHOPPER_TID]=PD100406&customParameters[SHOPPER_ECI]=0103910&customParameters[SHOPPER_PSERV]=17913101&customParameters[SHOPPER_VAL_BASE0]=2.00&customParameters[SHOPPER_VAL_BASEIMP]=1.00&customParameters[SHOPPER_VAL_IVA]=0.12&cart.items[0].name=cursoIngles&cart.items[0].description=Descripcion:cursoIngles&cart.items[0].price=10&cart.items[0].quantity=1&customParameters[SHOPPER_VERSIONDF]=2&testMode=EXTERNAL'


    // const url = 'https://test.oppwa.com/v1/checkouts?' + params;
    // console.log(url)



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



module.exports = {
    sendCheckOut
}





