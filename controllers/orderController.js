const usermodel = require("../models/usermodel");
const nodemailer = require('nodemailer');
let placeorder = async (req, res) => {
    try {
        let user = await usermodel.findOne({ email: req.user.email });
        let cart = user.cart;
        const { total, address, payment, mobile } = req.body;
        user.orders.push(cart);
        user.cart=[];
        await user.save();
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            },
        });


        const mailOptions = {
            from: process.env.EMAIL,
            to: user.email,
            subject: 'Order Confirmation',
            text: `Your order has been placed successfully!\n\nOrder Details:\nFinal Total: ₹${total}\n\nYour Order will be dilevered to you at ${address}\n\n Thank you for shopping with us!`
        };

        await transporter.sendMail(mailOptions);

        req.flash("success","Ordered placed successfully ! Confirmation email sent");
        res.redirect("/shop");
    }
    catch (err) {
        console.log("Error: "+err);
        req.flash('error', "Failed to Place order");
        res.redirect("/placeorder");
    }



}

module.exports = {placeorder};