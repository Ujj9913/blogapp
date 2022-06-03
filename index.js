var express = require('express');
const { render } = require('express/lib/response');
var fs = require('fs')
var app = express();
var mongoose = require('mongoose');
const port = process.env.PORT || 8000
const Blog = require('./models/blog');
const dbURI = "mongodb+srv://ujjval:123@cluster0.necyw.mongodb.net/node-tuts?retryWrites=true&w=majority";
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(result => app.listen(port))
    .catch(err => console.log(err));
app.set('view engine', 'ejs');

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }));
app.post('/', (req, res) => {
    const blog = new Blog(req.body);
    blog.save()
        .then((result) => {
            res.redirect('/');
        })
        .catch((err) => {
            console.log(err);
        })
})
app.get('/blogs/:id', (req, res) => {
    const id = req.params.id;
    Blog.findById(id)
        .then((result) => {
            res.render('details', { blog: result, title: 'Blog Details' });
        })
        .catch((err) => {
            res.status(404).render('404', { title: 'error' })
        })
})
app.delete('/blogs/:id', (req, res) => {
    const id = req.params.id;
    Blog.findByIdAndDelete(id)
        .then(result => {
            res.json({ redirect: '/blogs' })
        })
        .catch((err) => {
            console.log(err);
        })
})
/* app.get('/add-blog', (req, res) => {
    const blog = new Blog({
        title: 'new blog 2',
        snippet: 'about new blog',
        body: 'more about my new blog'
    });
    blog.save()
        .then((result) => {
            res.send(result)
        })
        .catch((err) => {
            console.log(err);
        })
})
app.get('/all-blogs', (req, res) => {
    Blog.find()
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
        });
});
app.get('/single-blog', (req, res) => {
    Blog.findById('61e5a714cf3e1a9e0c826752')
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
        });
}); */
app.get('/', (req, res) => {

    res.redirect('/blogs');
});
app.get('/blogs', (req, res) => {
    Blog.find().sort({ createAt: -1 })
        .then((result) => {
            res.render('index', { title: 'home', blogs: result })
        })
        .catch((err) => {
            console.log(err);
        })
})


app.get('/about', (req, res) => {
    res.render('about', { title: 'about' });

});
app.get('/about-us', (req, res) => {
    res.redirect('about');
});
app.get('/create', (req, res) => {
    res.render('create', { title: 'craete new blog' });
})
app.use((req, res) => {
    res.status(404).render('404', { title: 'error' })
});