const express = require('express');
const router = express.Router();
const Post = require('../models/Post');




router.get('', async (req, res) => {
    try {
        const locals = {
            title: "UTSG Blog",
            description: "A small blog for UTSG students."
        }

        let perPage = 5;
        let page = req.query.page || 1;


        const data = await Post.aggregate([ { $sort: { createdAt: -1 }}])
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec();


        const count = await Post.count();
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage);;



        res.render('index', { locals, data, current: page, nextPage: hasNextPage ? nextPage: null});
    } catch (error) {
        console.log(error);

    }


 
});

function insertPostData() {
    Post.insertMany([
        {
            title: "Sheesh",
            body: "This is the body text"
        },
    ])
}

const deleteAll = async () => {
    await Post.deleteMany({});
}
 




/** 
 * Posts
 */

router.get('/post/:id', async (req, res) => {
    try {

        const locals = {
            title: 'NodeJS Blog',
            description: "Blah Blah Blah"
            
        }

        let slug = req.params.id;
        const data = await Post.findById({_id: slug});

        res.render('post', {locals, data}); // we're giving our post ejs file the data object.



    } catch (error) {
        console.log(error);
    }


});

/** 
 * 
 * Search
 */

router.post('/search', async (req, res) => {
    try {
        const locals = {
          title: "Seach",
          description: "Simple Blog created with NodeJs, Express & MongoDb."
        }
    
        let searchTerm = req.body.searchTerm;
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "")
    
        const data = await Post.find({
          $or: [
            { title: { $regex: new RegExp(searchNoSpecialChar, 'i') }},
            { body: { $regex: new RegExp(searchNoSpecialChar, 'i') }}
          ]
        });
    
        res.render("search", {
          data,
          locals,
          currentRoute: '/'
        });
    
      } catch (error) {
        console.log(error);
      }


});



// This is out main routing file. We have all our routers here.

router.get('/about', (req, res) => {
    res.render('about');
});
 

router.get('/newpost', (req, res) => {
    try{ 
        res.render('upload')

    } catch (error) {
        console.log(error)
    }

});



module.exports = router;










