const stripe = require('stripe')(process.env.STRIPE_SECRET);

exports.createPaymentIntent = async (req, res) => {
    const { amount, currency, paymentMethodTypes = ['card'] } = req.body;

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount, 
            currency,
            payment_method_types: paymentMethodTypes, 
        });
console.log(paymentIntent)
        res.status(200).send({ paymentIntent });
    } catch (error) {
        console.error('Error creating Payment Intent:', error);
        res.status(500).send({ message: error.message });
    }
};
