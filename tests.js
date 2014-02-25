var conekta = require('./conekta.js');

conekta.Token.create({
    data: {
        card: {
            name: 'Christian',
            number: 4242424242424242,
            cvc: 987,
            exp_month: 11,
            exp_year: 18
        }
    }
});
