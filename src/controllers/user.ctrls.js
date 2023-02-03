const db = require('../models');
// const bcrypt = require('bcrypt');


//  Log user session out
const test = (req, res) => {
    console.log("test route hit");
    return res.status(200).json({ message: 'logged out' });
}


module.exports = {

    test,

};
