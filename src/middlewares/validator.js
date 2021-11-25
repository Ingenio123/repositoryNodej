const { check, validationResult } = require('express-validator')

exports.validateUserSignUp  = [
    check('FirstName').trim().not().isEmpty().withMessage('is empety First Name').isLength({min:3, max:20 }).withMessage('Name must be with 3 to 20 character '),
    check('LastName').trim().not().isEmpty().withMessage('is empety Last Name').isLength({min:3, max:20 }).withMessage('Name must be with 3 to 20 character '),
    check('age').trim().not().isEmpty().withMessage('is empty Age ').isLength({min:1, max:2 }).withMessage('Age must be with 3 to 20 character '),
    check('Gender').trim().not().isEmpty().withMessage('is empty Gender ').isLength({min:1, max:8 }).withMessage('Gender must be with 3 to 8 character '),
    check('country').trim().not().isEmpty().withMessage('is empety Country').isLength({min:1, max:3 }).withMessage('Country must be with 1 to 3 character '),
    check('phone').trim().not().isEmpty().withMessage('is empty Cell Phone').isLength({min:1,max:20}).withMessage('Numer max  is 15'),
    check('email').normalizeEmail().isEmail().withMessage('Invalid email!'),
    check('password').trim().not().isEmpty().isLength({min:8,max:20 }).withMessage('Password must be 3 to 20 characters long'),
    check('confirmPassword').trim().not().isEmpty().custom((value, {req}) =>{
        if(value !== req.body.password ){ 
            throw  new Error('Both  password must be same! ')
        }
        return true;
    })
]

exports.userValidation = (req,res,next)=>{
    const result  = validationResult(req).array()
    console.log(result)
    if(!result.length) return next();
    const error  = result[0].msg;
    res.status(400).json({ succes: false,message: error });
}

exports.validateUserSignIn   =  [
    check('email').trim().isEmail().withMessage('email / password  is required ! '),
    check('password').trim().not().isEmpty().withMessage('email / password is required! ')
]