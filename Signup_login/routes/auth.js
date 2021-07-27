const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const crypto = require('crypto');
const User = mongoose.model('User');
const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../keys');
const requireLogin = require('../middleware/requireLogin');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        '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',
    },
  })
);

//signup routes and logic
router.post('/signup', (req, res) => {
  const { name, email, password, pic } = req.body;
  if (!email || !password || !name) {
    return res.status(422).json({ error: 'please add all the fields' });
  } else {
    User.findOne({ email })
      .then((savedUser) => {
        if (savedUser) {
          return res
            .status(422)
            .json({ error: 'user with same mail already exists' });
        }
        bcrypt.hash(password, 12).then((hashedPassword) => {
          const user = new User({
            email,
            password: hashedPassword,
            name,
            pic,
          });
          user
            .save()
            .then((user) => {
              //sendging mail code......
              transporter.sendMail({
                to: user.email,
                from: 'atgenx@gmail.com',
                subject: 'Signup Success',
                html: "<h2>Welcome to anshal's instagram</h2>",
              });
              console.log('Email sent successfully....');
              res.json({ message: 'Signup Successfull' });
            })
            .catch((err) => {
              console.log(err);
            });
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

//signin routes and logic......
router.post('/signin', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ error: 'please add email or password' });
  }
  User.findOne({ email: email }).then((savedUser) => {
    if (!savedUser) {
      return res.status(422).json({ error: 'Invalid email or password' });
    }
    bcrypt
      .compare(password, savedUser.password)
      .then((doMatch) => {
        if (doMatch) {
          //res.json({ message: 'successfully signed in' });
          const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
          const { _id, name, email } = savedUser;
          res.json({
            token,
            user: { _id, name, email },
          });
        } else {
          return res.status(422).json({ error: 'Invalid email or password' });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

//routes and logic of  reset pssword....
router.post('/reset-password', (req, res) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
    }
    const token = buffer.toString('hex');
    User.findOne({ email: req.body.email }).then((user) => {
      if (!user) {
        return res
          .status(422)
          .json({ error: 'user dont exist with that mail' });
      }
      //mail token sending code....
      user.resetToken = token;
      user.expireToken = Date.now() + 900000;
      user.save().then((result) => {
        transporter.sendMail({
          to: user.email,
          from: 'atgenx@gmail.com',
          subject: 'Password reset',
          html: `
           <p>you requested for password reset</p>
           <h5>click in this link <a href = "http://localhost:5000/reset/${token}">link</a>to reset password
           `,
        });
        res.json({ message: 'check your email' });
      });
    });
  });
});
//new password creation logic....
router.post('/new-password', (req, res) => {
  const newPassword = req.body.password;
  const sentToken = req.body.token;
  User.findOne({ resetToken: sentToken, expireToken: { $gt: Date.now() } })
    .then((user) => {
      if (!user) {
        return res.status(422).json({ error: 'Try again session expired' });
      }
      bcrypt.hash(newPassword, 12).then((hashedPassword) => {
        user.password = hashedPassword;
        user.resetToken = undefined;
        user.expireToken = undefined;
        user.save().then((savedUser) => {
          res.json({ message: 'password updated successfully' });
        });
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
