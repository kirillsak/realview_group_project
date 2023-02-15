/*****************************************
* INDEX.JS: Main Entry Point for Backend *
******************************************/
const dotenv = require("dotenv").config();
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const uploads = require('./routes/api/uploads');
const morgan = require('morgan');
const helmet = require('helmet');

const app = express();

/**************
* MIDDLEWARE *
***************/
//Enable Cross Origin Resource Sharing (CORS) Requests
app.use(cors());
app.use(morgan('tiny'));
app.use(helmet())
mongoose
        .connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true,

        })
        .then(() => console.log("DB connection successful!"))
        .catch(() => console.log("Error connecting DB!"));

/*********
* ROUTES *
**********/
//Backend Index
app.get('/', (req, res) => {
    res.send('Welcome to the RealView API');
});

//Uploaded Files
app.use('/api/uploads', uploads);

/**************
* PORT CONFIG *
***************/
const port = process.env.PORT || 5001;
app.listen(port, () => console.log(`Server started on port ${port}`));