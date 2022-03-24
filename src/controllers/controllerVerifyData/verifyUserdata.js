const User = require("../../models/user");
const { transporter } = require("../../patterns/NodemailerAdapter");

const VerfyUserData = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ msg: "Id  not found" });
  const user = await User.findById(id);
  //   console.log(user);
  if (user.democlass.requireDemo) {
    return res.status(200).json({ status: true });
  }
  return res.status(200).json({
    status: false,
  });
};

const VerifyDemoClass = async (req, res) => {
  const idToken = req.id; // req.id -->   este es el id que da accesso el json web token ( JWT )
  if (!idToken)
    return res
      .status(400)
      .json({ success: false, message: "Token not found !" });
  // console.log("req id", idToken);
  const result = await User.findById(idToken);
  console.log(result);
  const { democlass } = result;
  return res.status(200).json({
    success: true,
    message: "Message",
    democlass: democlass.requireDemo,
  });
};

const GetDataUser = async (req, res, next) => {
  const id = req.id;
  const result = await User.findById(id).select("-password");
  const { email, FirstName, democlass, Gender, Country, numberCell } = result;
  console.log(result);
  if (democlass.requireDemo) {
    return res.status(201).json({
      status: true,
      message: "You have already taken one free class",
      data: {
        demoClass: democlass.requireDemo, // return true
        addData: 0,
      },
    });
  }
  if (result.googleAuth) {
    console.log("Google Auth");
    return res.status(200).json({
      status: true,
      message: "all ok",
      data: {
        addData: 3,
        democlass: democlass.requireDemo, // return false
        email,
      },
    });
  }

  return res.status(200).json({
    status: true,
    message: "all ok",
    data: {
      democlass: democlass.requireDemo, // return false
      addData: 1,
      email,
      FirstName,
    },
  });
};

const AddDataUserDemoclass = async (req, res, next) => {
  // const { Gender, Phone, Country, } = req.body;

  // console.log(req.body);
  // if (!Gender || !Phone || !Country | )
  //   return res.status(400).json({
  //     error: true,
  //     status: false,
  //     message: "Data not found",
  //   });
  try {
    await transporter.sendMail({
      from: "Ingenio Languages <ingeniolanguages.team@gmail.com>",
      to: "ingeniolanguages.team@gmail.com",
      subject: "Free demo class requested",
      // text: "esto es una prueba desde ingenio languages",
      html: `<!--Copia desde aquí--> 
<table style="max-width: 600px; padding: 10px; margin:0 auto; border-collapse: collapse;">

	<tr>
		<td style="background-color: #ecf0f1">
			<div style="color: #34495e; margin: 4% 10% 2%; text-align: justify;font-family: sans-serif">
				<h2 style="color: #2563EB; margin: 0 0 7px">Hi!</h2>
        	<br/>
				<p style="margin: 2px; font-size: 15px">A student has requested a free demo class. See all their information below to contact the student promptly.</p>

				<br/>
				<br/>
        <span style="margin-left:40px; font-size: 20px; " >Information</span>
				<ul style="font-size: 15px;  margin: 10px 0">
        <li><b>First Name:</b> ${req.body.FirstName}</li>
        <li><b>Last Name:</b> ${req.body.LastName}</li>
        <li><b>Age</b> ${req.body.age}</li>
        <li><b>E-mail:</b> ${req.body.email}</li>
        <li><b>AboutUs:</b> ${req.body.AboutUs}</li>
        <li><b>Language: </b> ${req.body.Language}</li>
        <li><b>Level:</b> ${req.body.Level}</li>
        <li><b>Country of nationality:</b> ${req.body.contryNationality}</li>
        <li><b>Country of residence:</b> ${req.body.contryLive}</li>
        <li><b>Phone number:</b> +${req.body.phoneNumber}</li>
      <li><b>Gender:</b> ${req.body.Gender}</li>
      <li><b>Goals:</b> ${req.body.Goals}</li>
        
				</ul>
				
				<br/>
				<br/>
			
				<p style="color: #b3b3b3; font-size: 12px; text-align: center;margin: 30px 0 0">www.ingeniolanguages.com</p>
			</div>
		</td>
	</tr>
</table>
<!--hasta aquí-->`, // html body
    });

    // <div style="width: 100%; text-align: center">
    //   <a
    //     style="text-decoration: none; border-radius: 5px; padding: 11px 23px; color: white; background-color: #3498db"
    //     href="http://localhost:3000/siginforgotpassword"
    //   >
    //     Sign in at Ingenio Languages website
    //   </a>
    // </div>;

    return res.status(200).json({
      error: false,
      status: true,
      message: "We will get in touch to arrange a meeting",
    });
  } catch (_error) {
    console.error(_error);
    return res.status(500).json({
      error: true,
      message: "Erro in server",
    });
  }
};

const AddDataUserOneData = async (req, res, next) => {
  const { SecondEmail } = req.body;
  if (!SecondEmail)
    return res.status(400).json({
      status: false,
      error: true,
      message: "Not found Data",
    });
  const id = req.id;
  const user = await User.findById(id);
  console.log(user);
  if (user.democlass.requireDemo)
    return res.status(400).json({
      status: false,
      error: true,
      message: "You have already taken one free class",
    });
  const data = await User.findByIdAndUpdate(
    { _id: id },
    {
      SecondEmail,
      democlass: {
        requireDemo: true,
      },
    },
    {
      useFindAndModify: false,
    }
  );
  if (!data)
    return res.status(400).json({
      status: false,
      error: true,
      message: "User not found",
    });

  return res.status(200).json({
    error: false,
    status: true,
    message: "We will get in touch to arrange a meeting",
  });
};
module.exports = {
  VerfyUserData,
  VerifyDemoClass,
  GetDataUser,
  AddDataUserDemoclass,
  AddDataUserOneData,
};
