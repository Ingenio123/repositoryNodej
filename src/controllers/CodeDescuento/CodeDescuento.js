const Code = require("../../models/CodesDescuento/CodeModal");

const CodeDescuento = async (req, res) => {
  const { CodeDesc } = req.body;
  console.log(req.body);
  if (!CodeDesc) return res.status(400).json({ success: false });

  const resultado = await Code.findOne({ Codeval: CodeDesc });
  if (!resultado) {
    return res.status(400).json({
      success: false,
      error: true,
      message: "Invalid coupon code.",
    });
  }
  //   console.log(new Date().getTime());
  if (new Date().getTime() >= resultado.expiresCode) {
    await Code.findByIdAndUpdate(
      { _id: resultado._id },
      {
        caducado: true,
      },
      {
        useFindAndModify: false,
      }
    );
    return res.status(400).json({
      success: false,
      error: true,
      message: "Expired coupon code",
    });
  }
  if (resultado.numberUses <= 0) {
    await Code.findByIdAndUpdate(
      { _id: resultado._id },
      {
        caducado: true,
      },
      {
        useFindAndModify: false,
      }
    );
    return res.status(400).json({
      success: false,
      error: true,
      message: "This coupon code has already been used.",
    });
  }
  calculo = resultado.numberUses - 1;
  const resultadoCalculo = await Code.findByIdAndUpdate(
    { _id: resultado._id },
    {
      numberUses: calculo,
    },
    {
      useFindAndModify: false,
    }
  );
  console.log(resultadoCalculo);
  return res.status(200).json({
    error: false,
    success: true,
    message: "Code verify success",
    valor: resultado.Valor,
  });
};

const CreateCodeDescuento = async (req, res) => {
  const { codigo, descuento, numero_usos, expiresCode } = req.body;
  if (!codigo || !descuento || !numero_usos || !expiresCode)
    return res.status(400).json({
      success: false,
      error: true,
      message: "Data incomplet",
    });

  const NewCode = new Code({
    Codeval: codigo,
    Valor: descuento,
    numberUses: numero_usos,
    expiresCode,
  });

  try {
    const resultado = await NewCode.save();
    return res.status(200).json({
      error: false,
      success: true,
      message: "Creted code susccessfully",
      resultado,
    });
  } catch (error) {
    if (error.code == 11000) {
      return res.status(500).json({
        error: true,
        success: false,
        message: "code Existe",
      });
    }
  }
};
const DeleteCode = (req, res) => {
  return res.status(200).json({
    sucess: true,
    message: "Deleted Code susccessfully",
  });
};

module.exports = {
  CodeDescuento,
  CreateCodeDescuento,
  DeleteCode,
};
