const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const port = 3019;

const app = express();
app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/PaymentDetails');
const db = mongoose.connection;
db.once('open', () => {
    console.log('Connected to MongoDB');
});

const userSchema = new mongoose.Schema({
    cardname: String,
    cardnumber: String,
    expmonth: String,
    expyear: String,
    cvv: String
});

const Users = mongoose.model('data', userSchema);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'ticket-booking.html'));
});

app.post('/post', async (req, res) => {
    const { cardname, cardnumber, expmonth, expyear, cvv} = req.body;
    const user = new Users({
        cardname,
        cardnumber,
        expmonth,
        expyear,
        cvv
    });
    try {
        await user.save();
        console.log(user);
        res.send("Booking Successful");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error saving order");
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});