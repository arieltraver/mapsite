const express = require('express');
const router = express.Router();
// Require the post model
const Post = require('../models/post');
const http = require('./http')
const {verifyJWT} = require('../utils/auth')

/* GET posts */
router.get('/', async (req, res, next) => {
  // sort from the latest to the earliest
  const posts = await Post.find().sort({ createdAt: 'desc' });
  return res.status(200).json({
    statusCode: 200,
    message: 'Fetched all posts',
    data: { posts },
  });
});

//show a single post
router.get('/:id', async (req, res, next) => {
// req.params contains the route parameters and the id is one of them
    const post = await Post.findById(req.params.id);
    return res.status(200).json({
        statusCode: 200,
        message: 'Fetched post',
        data: {
            post: post || {},
        },
    });
});



//post req for creating new post
router.post('/', (req, res) => {
  const {ip, notes} = req.body;

  http.get(`http://ip-api.com/json/${ip}`)

  .then(rez => { //got results back
    if (rez.data.status == "success") {
      const lat = rez.data.lat
      const lon = rez.data.lon
      const post = new Post({
        ip,
        notes,
        lat,
        lon,
      });
      // Save the data
      post.save().then(() => {
        return res.status(201).json({
          statusCode: 201,
          message: "Success",
          data: { post },
        });
      });
    }

    else { //no results for that IP

      console.log("no x and y for that IP", rez)
      const post = new Post({
        ip,
        notes,
      });
      // Save the data
      post.save().then(() => {
        return res.status(201).json({
          statusCode: 201,
          message: "NoCoords",
          data: { post },
        });
      });
    }
  })
  
  .catch(async () => {
    const post = new Post({
      ip,
      notes,
    });
    // Save the data
    await post.save();
    return res.status(201).json({
      statusCode: 201,
      message: "SearchFail",
      data: { post },
    });
  })
});

//put request for updating a post
router.put('/:id', verifyJWT, async (req, res) => {
  const { ip, notes} = req.body;
  http.get(`http://ip-api.com/json/${ip}`)
  .then(async rez => {
    if (rez.data.status == "success"){
      console.log("edit ip success", rez.data.lat, rez.data.lon)
      const r = rez.data.lat;
      const l = rez.data.lon;
      // findByIdAndUpdate accepts the post id as the first parameter and the new values as the second parameter
      const post = await Post.findByIdAndUpdate(
      req.params.id,
      {ip, notes, r, l,})
      return res.status(200).json({
        statusCode: 200,
        message: 'Updated post',
        data: { post },
      })
    }
    else {
      console.log("editing but no x or y found")
      const post = await Post.findByIdAndUpdate(
        req.params.id,
        {ip, notes}
      )
      return res.status(200).json({
        statusCode: 200,
        message: 'Updated post',
        data: { post },
      });
    }
  })
  .catch(async (err) => {
    console.log(err)
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      {ip, notes}
    )
    return res.status(200).json({
      statusCode: 200,
      message: 'CoordFail',
      data: { post },
    })
  })
});



router.delete('/:id', verifyJWT, async (req, res, next) => {
    // Mongo stores the id as `_id` by default
    const result = await Post.deleteOne({ _id: req.params.id });
    return res.status(200).json({
      statusCode: 200,
      message: `Deleted ${result.deletedCount} post(s)`,
      data: {},
    });
});

module.exports = router;