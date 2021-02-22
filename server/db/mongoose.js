const mongoose = require('mongoose');

//connecting to the database
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://ShakedShav:47674674684902@cluster0.cx2o0.mongodb.net/courses-app?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
});