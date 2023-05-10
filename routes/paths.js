const express = require('express');
const router = express.Router();
// Require the post model
const Path = require('../models/path');
const http = require('./http')
const {verifyJWT} = require('../utils/auth')

/* GET posts */
router.get('/', async (req, res, next) => {
  // sort from the latest to the earliest
  const paths = await Path.find().sort({ createdAt: 'desc' });
  return res.status(200).json({
    statusCode: 200,
    message: 'Fetched all paths',
    data: { paths },
  });
});

//show a single post
router.get('/:id', async (req, res, next) => {
// req.params contains the route parameters and the id is one of them
  const path = await Path.findById(req.params.id);
  return res.status(200).json({
    statusCode: 200,
    message: 'Fetched path',
    data: {
      post: path || {},
    },
  });
});



//post req for creating new post
router.post('/', (req, res) => {
  const {ips, author} = req.body;

  http.post(`http://ip-api.com/batch?fields=status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as`,
    {data: ips}
  )
  .then(rez => { //got results back
    const responses = rez.data
    let any = false
    let lats = []
    let longs = []
    for (item in responses) {
      console.log(responses[item]);
      if (responses[item].status == 'success') {
       lats.push(responses[item].lat)
       longs.push(responses[item].lon)
       any = true
      } else {
        lats.push(181) //represents nonexistent value
        longs.push(181)
      }
    }
    let path;
    let coords = {lats, longs}
    if (any) {
      path = new Path({
        ips,
        author,
        coords,
      });
    } else {
      path = new Path({
        ips,
        author,
      });
    }
      // Save the data
    path.save().then(() => {
      return res.status(201).json({
        statusCode: 201,
        message: "Success",
        data: { path },
      });
    });
  })
  .catch(async () => {
    const path = new Path({
      ips,
      author,
    });
    // Save the data
    await path.save();
    return res.status(201).json({
      statusCode: 201,
      message: "SearchFail",
      data: { path },
    });
  })
});

//put request for updating a path
router.put('/:id', async (req, res) => {
  const {ips, author} = req.body;
  http.post(`http://ip-api.com/batch?fields=status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as`,
  {data: ips}
  )
  .then(async rez => {
    let lats = []
    let lons = []
    let responses = rez.data
    for (item in responses) {
      if (item.status == "success") {
       lats.push(item.lat)
       lons.push(item.lon)
       any = true
      } else {
        lats.push(181) //represents nonexistent value
        lons.push(181)
      }
    }
    let path;
    let coords = {}
    if (any) {
      coords = {lats, lons}
      path = new Path({
        ips,
        author,
        coords,
      });
    } else {
      path = new Path({
        ips,
        author,
      });
    }
    return res.status(200).json({
      statusCode: 200,
      message: 'Updated path',
      data: { path },
    })
  })
  .catch(async (err) => {
    console.log(err)
    const post = await Path.findByIdAndUpdate(
      req.params.id,
      {ips, author}
    )
    return res.status(200).json({
      statusCode: 200,
      message: 'CoordFail',
      data: { path },
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