const express = require('express');
const router = express.Router();
// Require the path model
const Path = require('../models/path');
const http = require('./http')
const {verifyJWT} = require('../utils/auth')

/* GET paths */
router.get('/', async (req, res, next) => {
  // sort from the latest to the earliest
  const paths = await Path.find().sort({ createdAt: 'desc' });
  return res.status(200).json({
    statusCode: 200,
    message: 'Fetched all paths',
    data: { paths },
  });
});

//show a single path
router.get('/:id', async (req, res, next) => {
// req.params contains the route parameters and the id is one of them
  const path = await Path.findById(req.params.id);
  return res.status(200).json({
    statusCode: 200,
    message: 'Fetched path',
    data: {
      path: path || {},
    },
  });
});



//post req for creating new path
router.post('/', verifyJWT, (req, res) => {
  const user = req.user;
  console.log("user is", user)
  const {ips, notes} = req.body;

  http.post(`http://ip-api.com/batch`,
    {data: ips}
  )
  .then(rez => { //got results back
    const responses = rez.data
    let any = false
    let ipadds = []
    for (item in responses) {
      if (responses[item].status == 'success') {
        let ipa = {
          ip: responses[item].query,
          lat: responses[item].lat,
          lon: responses[item].lon
        }
        ipadds.push(ipa)
        console.log(ipa);
        any = true
      } else {
        ipadds.push(
          {
            ip: responses[item].query
          }
        ) //represents nonexistent value
      }
    }
    let path;
    if (any) {
      path = new Path({
        author: user.name,
        userID: user.userID,
        ips: ipadds,
        notes: notes,
      });
    } else {
      path = new Path({
        ips: ips,
        notes: notes
      })
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
      notes,
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
  const {ips, notes} = req.body;
  http.post(`http://ip-api.com/batch`,
  {data: ips}
  )
  .then(async (rez) => { //got results back
    const responses = rez.data
    let any = false
    ipadds = []
    for (item in responses) {
      if (responses[item].status == 'success') {
        let ipa = {
          ip: responses[item].query,
          lat: responses[item].lat,
          lon: responses[item].lon
        }
        ipadds.push(ipa)
        console.log(ipa)
        any = true
      } else {
        ipadds.push(
          {
            ip: responses[item].query
          }
        ) //represents nonexistent value
      }
    }
      // Save the data
    const path = await Path.findByIdAndUpdate(
      req.params.id,
      {
        ips: ipadds,
        notes: notes
      }
    )
    return res.status(201).json({
      statusCode: 201,
      message: 'Success',
      data: { path },
    })
  })
  .catch(async (err) => {
    console.log(err)
    const path = await Path.findByIdAndUpdate(
      req.params.id,
      {ips, notes}
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
    const result = await Path.deleteOne({ _id: req.params.id });
    return res.status(200).json({
      statusCode: 200,
      message: `Deleted ${result.deletedCount} path(s)`,
      data: {},
    });
});

module.exports = router;