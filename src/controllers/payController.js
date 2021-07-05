const axios = require('axios');
const https = require('https');


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
        NameOnCard,
        Cvv,
        ExpiresCard,
        cardNumber,
        ipClient
    } = req.body;
    
    const resultados = await SendDatafast(City,Country,PostCode,firstName,secondName,lastName,numberCedula,numberCellPhone,NameOnCard,Cvv,ExpiresCard,cardNumber,ipClient);
    return res.status(200).json({
        message:'todo  salio bien tranquilo hombre',
        resultados
    })

}

const SendDatafast  = async (City,Country,PostCode,firstNameParams,secondName,lastName,numberCedula,numberCellPhone,NameOnCard,Cvv,ExpiresCard,cardNumber,ipClientParams) =>{

    const number_Cedula = parseInt(numberCedula);
    const card_cvv = parseInt(Cvv);
    const card_expires =  parseInt(ExpiresCard);
    const city = String(City);
    const country = String(Country);
    const CodePostal = parseInt(PostCode);
    const firstName = String(firstNameParams)
    const SecondName = String(secondName)
    const surname = String(lastName)
    const numberPhone = String(numberCellPhone),
    ipClient = parseInt(ipClientParams)

    const idClient = '60b800c52963f559f9db99eb',
        email = 'usuario@email.com',
        entityId='8a829418533cf31d01533d06f2ee06fa',
        amount = 3,
        VALOR_PRODUCTO = 5,
        VALOR_IVA = 0.60,
        NAME_PRODUCT = 'curso de ingles',
        DESCRIPTION_PRODUCT = 'curso de ingenio languages gracias por tu compra',
        PRICE_PRODUCT = 5,
        QUANTY_PRODUCT = 1;


        // https://test.oppwa.com/v1/checkouts?entityId=8ac7a4c87a1e95a8017a1fd6acae073c&amount=3&currency=USD&paymentType=DB&customer.givenName=carlos&customer.middleName=alexander&customer.surname=Arteaga&customer.ip=181.39.246.76&customer.merchantCustomerId=60b800c52963f559f9db99eb&merchantTransactionId=transaction_112233&customer.email=usuario@gmial.com&customer.identificationDocType=IDCARD&customer.identificationDocId=1234567890&customer.phone=0993909800&billing.street1=Guayaquil&billing.country=EC&billing.postcode=230112&shipping.street1=Guayaquil&shipping.country=EC&risk.parameters[USER_DATA2]=DATAFAST&customParameters[SHOPPER_MID]=1000000505&customParameters[SHOPPER_TID]=PD100406&customParameters[SHOPPER_ECI]=0103910&customParameters[SHOPPER_PSERV]=17913101&customParameters[SHOPPER_VAL_BASE0]=2.00&customParameters[SHOPPER_VAL_BASEIMP]=1.00&customParameters[SHOPPER_VAL_IVA]=0.12&cart.items[0].name=cursoIngles&cart.items[0].description=Descripcion:cursoIngles&cart.items[0].price=10&cart.items[0].quantity=1&customParameters[SHOPPER_VERSIONDF]=2&testMode=EXTERNAL
        
        const data={};
        const agent = new https.Agent({  
            rejectUnauthorized: false
          });

        let resultados = await axios.post(`https://test.oppwa.com/v1/checkouts?entityId=${entityId}&amount=${amount}&currency=USD&paymentType=DB&customer.givenName=${firstName}&customer.middleName=${SecondName}&customer.surname=${surname}&customer.ip=${ipClient}&customer.merchantCustomerId=${idClient}&merchantTransactionId=transaction_112233&customer.email=${email}&customer.identificationDocType=IDCARD&customer.identificationDocId=${number_Cedula}&customer.phone=${numberPhone}&billing.street1=${city}&billing.country=${country}&billing.postcode=${CodePostal}&shipping.street1=${city}&shipping.country=${country}&risk.parameters%5BUSER_DATA2%5D=DATAFAST&customParameters%5BSHOPPER_MID%5D=1000000505&customParameters%5BSHOPPER_TID%5D=PD100406&customParameters%5BSHOPPER_ECI%5D=0103910&customParameters%5BSHOPPER_PSERV%5D=17913101&customParameters%5BSHOPPER_VAL_BASE0%5D=0&customParameters%5BSHOPPER_VAL_BASEIMP%5D=${VALOR_PRODUCTO}&customParameters%5BSHOPPER_VAL_IVA%5D=${VALOR_IVA}&cart.items%5B0%5D.name=${NAME_PRODUCT}&cart.items%5B0%5D.description=${DESCRIPTION_PRODUCT}&cart.items%5B0%5D.price=${PRICE_PRODUCT}&cart.items%5B0%5D.quantity=${QUANTY_PRODUCT}&customParameters%5BSHOPPER_VERSIONDF%5D=2&testMode=EXTERNAL`,data,{
            httpsAgent : agent,
            headers:{
                'Authorization':'Bearer OGE4Mjk0MTg1MzNjZjMxZDAxNTMzZDA2ZmQwNDA3NDh8WHQ3RjIyUUVOWA=='
            }
        })
        return resultados.data;


}

module.exports = {
    ClientPay
}