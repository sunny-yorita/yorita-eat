const knex = require('../db/knex');
const passport = require('passport');
const requireLogin = require('../middlewares/requireLogin');
const router = require('express').Router();

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const db_res = await knex('eateries')
      .select()
      .where({ _id: id });
    if (db_res.length) {
      const imageKey = db_res[0].icon_image_url;
      if (!imageKey) {
        db_res[0].icon_image_url =
          'https://cdn3.iconfinder.com/data/icons/restaurant-flat-line/70/chicken-512.png';
      } else {
        db_res[0].icon_image_url = `https://s3-us-west-1.amazonaws.com/yorita-eat-bucket-dev/${imageKey}`;
      }

      return res.send(db_res[0]);
    }
  } catch (err) {
    console.log(err);
    res.status(err.status || 422).send(err);
  }
  res.status(404).send('This restaurant does not exist.');
});

router.put('/add', requireLogin, async (req, res) => {
  const { name, streetAddr, city, state, zipcode, areaCode, phone } = req.body;
  const owner_id = req.user._id;

  try {
    const db_res = await knex('eateries')
      .insert({
        owner_id,
        name,
        streetAddr,
        city,
        state,
        zipcode,
        areaCode,
        phone
      })
      .returning([
        'owner_id',
        '_id',
        'name',
        'streetAddr',
        'city',
        'state',
        'zipcode',
        'areaCode',
        'phone'
      ]);
    res.status(201).send(db_res[0]);
  } catch (err) {
    console.log(err);
    res.status(err.status || 422).send(err);
  }
});

router.put('/update', requireLogin, async (req, res) => {
  const {
    _id,
    name,
    streetAddr,
    city,
    state,
    zipcode,
    areaCode,
    phone,
    icon_image_url
  } = req.body;
  const userId = req.user._id;

  try {
    const db_res = await knex('eateries')
      .where({
        _id,
        owner_id: userId
      })
      .update({
        name,
        streetAddr,
        city,
        state,
        zipcode,
        areaCode,
        phone,
        icon_image_url
      })
      .returning([
        'owner_id',
        '_id',
        'name',
        'streetAddr',
        'city',
        'state',
        'zipcode',
        'areaCode',
        'phone',
        'icon_image_url'
      ]);
    const imageKey = db_res[0].icon_image_url;
    if (!imageKey) {
      db_res[0].icon_image_url =
        'https://cdn3.iconfinder.com/data/icons/restaurant-flat-line/70/chicken-512.png';
    } else {
      db_res[0].icon_image_url = `https://s3-us-west-1.amazonaws.com/yorita-eat-bucket-dev/${imageKey}`;
    }
    db_res[0].user_id = userId;
    res.status(200).send(db_res[0]);
  } catch (err) {
    console.log(err);
    res.status(err.status || 422).send(err);
  }
});

module.exports = router;
