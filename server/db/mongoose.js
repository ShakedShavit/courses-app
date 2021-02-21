const mongoose = require('mongoose');
//process.env.MONGODB_URL || 
//connecting to the database
mongoose.connect('mongodb+srv://ShakedShav:47674674684902@cluster0.cx2o0.mongodb.net/courses-app?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
});