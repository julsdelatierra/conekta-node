var conekta = require('./conekta.js');

conekta.public_key = '';
conekta.private_key = '';

var data = {
    params: {
        card: {
            name: 'Christian',
            number: 4111111111111111,
            cvc: 987,
            exp_month: 11,
            exp_year: 18
        }
    },
    error: function(err) {
        console.log('error: ', err);
    },
    success: function(response) {
        conekta.Charge.create({
            params: {
                'description':'Stogies',
                'amount':20000,
                'currency':'MXN',
                'reference_id':'9839-wolf_pack',
                'card':response.id
            },
            success: function(resp) {
                console.log(resp);
            },
            error: function(resp) {
                console.log(resp);
            }
        });
    }
}

/*
* Las funciones de error y success se pueden pasar en la funcion
* como parámetros respectivamente:
* 
* var token = conekta.Token.create(data, errorFn(error) {}, successFn(response) {});
* 
* o bien, en el objeto data:
* data{
*   params: {},
*   error: fn(error) {},
*   success: fn(response) {}
* }
*
*
*/
var token = conekta.Token.create(data);
