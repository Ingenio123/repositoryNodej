const Code = require('../../models/CodesDescuento/CodeModal')

const CodeDescuento = async (req,res)=>{

    const {CodeDesc} = req.body;
    console.log(req.body)
    if(!CodeDesc) return res.status(400).json({success:false})
    
    const resultado = await Code.findOne({Codeval:CodeDesc});
    
    return res.status(200).json({
        success: true,
        message: "Code Verify Sucess",
        valor: resultado.Valor
    })
}

const CreateCodeDescuento = async (req,res)=>{

    const {Codeval,ValorDescuento} = req.body;

    const NewCode = new Code({
        Codeval,
        Valor : ValorDescuento
    })
    
    try {

        const resultado = await NewCode.save();
        return res.status(200).json({
            success: true,
            message: "Creted code susccessfully",
            resultado
        })

    } catch (error) {

        if(error.code == 11000){
            return res.status(400).json({
                success:false,
                message:"code Existe"
            })
        }
    }

    

    

}
const DeleteCode = (req,res)=>{
    return res.status(200).json({
        sucess: true,
        message: 'Deleted Code susccessfully'
    })
}

module.exports = {
    CodeDescuento,
    CreateCodeDescuento,
    DeleteCode
}