var conekta = require('./conekta.js');

conekta.publishableKey = 'DazE4p9yq3ZqFJS5ZLER';

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
		console.log(response);
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
*	params: {},
*   error: fn(error) {},
*   success: fn(response) {}
* }
*
*
*/
var token = conekta.Token.create(data);
