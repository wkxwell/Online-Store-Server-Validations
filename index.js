const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const {
    check,
    validationResult
} = require('express-validator');
const onlineStore = express();

onlineStore.use(bodyParser.urlencoded({
    extended: false
}));
onlineStore.use(bodyParser.json())

onlineStore.set('views', path.join(__dirname, 'views'));
onlineStore.set('view engine', 'ejs');
onlineStore.use(express.static(__dirname + '/public'));

//At the start of the website, onlineStore will render index.ejs
onlineStore.get('/', function (req, res) {
    res.render('index'); //---> initial rendering
})

onlineStore.post('/',
    [
        check('firstName', 'Please Enter a Valid First Name').not().isEmpty(),
        check('lastName', 'Please Enter a Valid Last Name').not().isEmpty(),
        check('email', 'Please Enter a Correct Format Email').isEmail(),
        check('phone', 'Please Enter a Correct Phone Number').isMobilePhone(),
        check('address', 'Please Enter a Correct Address Format').isString().not().isEmpty(),
        check('city').custom(value => {
            var cityRegex = /^[a-zA-Z]{2,}$/;
            if (!cityRegex.test(value)) {
                throw new Error('Please Enter in a Valiad City');
            }
            return true;
        }),
        check('postalCode').custom(value => {
            var postalRegex = /^[a-zA-Z][0-9][a-zA-z]\s[0-9][a-zA-Z][0-9]$/;
            if (!postalRegex.test(value)) {
                throw new Error('Please Enter a Valid Postal Code');
            }
            return true;
        }),
        check('tech', 'Please Select a Correct Technical Quantity').isInt({
            min: 0,
            max: 10
        }),
        check('prem', 'Please Select a Correct Premium Quantity').isInt({
            min: 0,
            max: 10
        }),
        check('stan', 'Please Select a Correct Standard Quantity').isInt({
            min: 0,
            max: 10
        }),
    ],
    function (req, res) {
        var errors = validationResult(req);
        if (!errors.isEmpty() || ((req.body.tech + req.body.prem + req.body.stan) <= 0)) {  
            var errorsData = {
                errors: errors.array()
            }
            if ((req.body.tech + req.body.prem + req.body.stan) <= 0) {
                qtyErrorMsg={
                    value: '',
                    msg: 'Please Purchase At Least One Item',
                    param: 'tech',
                    location: 'body'
                  }         
                  errorsData.errors.push(qtyErrorMsg)
            }
            res.render('index', errorsData);
//trying to focus htmlobject
// for (i=0; i<errors['errors'].length;i++){
//     loc = errors['errors'][i].location;
//     par = errors['errors'][i].param;
//     console.log(req.loc.par);
// }
        } else {
            var firstName = req.body.firstName;
            var lastName = req.body.lastName;
            var email = req.body.email;
            var phone = req.body.phone;
            var address = req.body.address;
            var city = req.body.city;
            var province = req.body.province;
            var postalCode = req.body.postalCode;
            var deliveryCost = req.body.deliveryCost;
            var tech = req.body.tech;
            var prem = req.body.prem;
            var stan = req.body.stan;

            tech = parseInt(tech);
            prem = parseInt(prem);
            stan = parseInt(stan);
            deliveryCost = parseInt(deliveryCost);

            var pageData = {
                firstName: firstName,
                lastName: lastName,
                email: email,
                phone: phone,
                address: address,
                city: city,
                province: province,
                postalCode: postalCode,
                deliveryCost: deliveryCost,
                tech: tech,
                prem: prem,
                stan: stan,
            }
            res.render('formSubmit', pageData);
        }
    });

onlineStore.listen(8080);
console.log('Site is on Port 8080....')