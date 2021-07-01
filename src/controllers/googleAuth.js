const jwt  = require('jsonwebtoken')
const {OAuth2Client} = require('google-auth-library')
const client = new OAuth2Client('669011089415-8gtepgk9pivth0itvut5tom96kn9r7i1.apps.googleusercontent.com')
const User =  require('../models/user')


const GoogleAuth  =  async (req,res)=>{
    const {idToken} = req.body;
   
    try {
        
        const result = await client.verifyIdToken({idToken,audience:'669011089415-8gtepgk9pivth0itvut5tom96kn9r7i1.apps.googleusercontent.com'})
        const  {email_verified,email,name,picture} = result.payload;
            
            if(email_verified){
                const user = await User.findOne({email}).select('-password');
                if(user){
                    console.log('te estas logeando con google  ---> ')
                    const token = jwt.sign({id:user._id}, 'secret',{
                        expiresIn:'1d'
                    });

                    const {_id,email,username,picture} = user;

                    return res.status(200).json({
                        success:true,
                        token,
                        user:{_id,email,username,picture}
                    })
                }else{
                    let password = email + 'secret';
                    const newuser = new User({
                        username:name,
                        email,
                        password,
                        picture,
                        googleAuth:true
                    })
                    newuser.save((err, data) => { 
                        if(err){
                            console.log('Error de google', err);
                            return res.status(400).json({
                                success:false,
                                error: 'Error sign In whith google'
                            })
                        }
                        const token = jwt.sign(
                            { id: data._id },
                            'secret',
                            { expiresIn: '1d' }
                          );
                        const { _id, email, name,picture } = data;
                        return res.json({
                            success:true,
                            token,
                            user: { _id, email, name,picture}
                        });
                       
                    });
                    }
            }else {
                return res.status(400).json({
                    success:false,
                    error:'google login failed'
                })
            }
        } catch (error) {
            return res.status(400).json({
                success:false,
                error
            })

    }
}

module.exports = {
    GoogleAuth,
}

