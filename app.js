const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = express();

app.use(express.json())
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xqfov.mongodb.net/travelbd?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, useUnifiedTopology: true });

app.get('/', (req, res) => {
    res.send('<h1>Travel BD server running successfully</h1>');
});

client.connect(err => {
    const packages = client.db("travelbd").collection("packages");
    const admins = client.db("travelbd").collection("admins");
    const testimonials = client.db("travelbd").collection("testimonials");
    const bookings = client.db("travelbd").collection("bookings");

    // Create new package
    app.post('/addPackage', (req, res) => {
        const tourPackage = req.body;
        packages.insertOne(tourPackage)
            .then(result => {
                res.status(201).send(result.insertedCount > 0);
            });
    });

    // Get all package
    app.get('/packages', (req, res) => {
        packages.find()
            .toArray((err, docs) => {
                res.status(200).json(docs)
            });
    });

    // Get first six package
    app.get('/firstSixPackage', (req, res) => {
        packages.find().limit(6)
            .toArray((err, docs) => {
                res.status(200).json(docs)
            });
    });

    // Get single package by id
    app.get('/getPackage/:id', (req, res) => {
        packages.find({ _id: ObjectId(req.params.id) })
            .toArray((err, docs) => {
                res.status(200).json(docs[0])
            });
    });

    // Delete package by id
    app.delete('/deletePackage/:id', (req, res) => {
        packages.deleteOne({ _id: ObjectId(req.params.id) })
            .then(result => {
                res.status(200).send(result.deletedCount > 0);
            });
    });

    // Create new admin
    app.post('/addAdmin', (req, res) => {
        const admin = req.body;
        admins.insertOne(admin)
            .then(result => {
                res.status(201).send(result.insertedCount > 0);
            });
    });

    // Get all admin
    app.get('/admins', (req, res) => {
        admins.find()
            .toArray((err, docs) => {
                res.status(200).json(docs)
            });
    });

    // Get Single Admin By Email
    app.get('/getAdmin', (req, res) => {
        admins.find(req.query).collation({ locale: 'en', strength: 2 })
            .toArray((err, docs) => {
                res.status(200).json(docs);
            });
    });

    // Remove admin by id
    app.delete('/removeAdmin/:id', (req, res) => {
        admins.deleteOne({ _id: ObjectId(req.params.id) })
            .then(result => {
                res.status(200).send(result.deletedCount > 0);
            });
    });

    // Create new testimonial
    app.post('/addTestimonial', (req, res) => {
        const testimonial = req.body;
        testimonials.insertOne(testimonial)
            .then(result => {
                res.status(201).send(result.insertedCount > 0);
            });
    });

    // Get testimonials
    app.get('/testimonials', (req, res) => {
        testimonials.find(req.query)
            .toArray((err, docs) => {
                res.status(200).json(docs)
            });
    });

    // Delete testimonial by id
    app.delete('/deleteTestimonial/:id', (req, res) => {
        testimonials.deleteOne({ _id: ObjectId(req.params.id) })
            .then(result => {
                res.status(200).send(result.deletedCount > 0);
            });
    });

    // Create new booking
    app.post('/addBooking', (req, res) => {
        const booking = req.body;
        bookings.insertOne(booking)
            .then(result => {
                res.status(201).send(result.insertedCount > 0);
            });
    });

    // Get all bookings
    app.get('/bookings', (req, res) => {
        bookings.find(req.query)
            .toArray((err, docs) => {
                res.status(200).json(docs)
            });
    });

    // Delete booking by id
    app.delete('/deleteBooking/:id', (req, res) => {
        bookings.deleteOne({ _id: ObjectId(req.params.id) })
            .then(result => {
                res.status(200).send(result.deletedCount > 0);
            });
    });

    // Find and update booking status
    app.patch('/updateBooking/:id', (req, res) => {
        bookings.findOneAndUpdate({ _id: ObjectId(req.params.id) }, { $set: req.body })
            .then(result => {
                res.status(200).send(result.ok === 1);
            });
    });

    console.log('Database Connection Successful!');
});


const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});