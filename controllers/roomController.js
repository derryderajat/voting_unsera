const { generateTag } = require('../utils/TagGenerator');
const db = require('../models');
const Room = db.activity;

exports.findRoom = async (req, res) => {
  if (!req.query.roomKey) {
    try {
      const isRoomAvail = await Room.find({}).select('title options roomKey');
      res.status(200).send(isRoomAvail);
    } catch (error) {}
  } else {
    try {
      const isRoomAvail = await Room.findOne({
        roomKey: req.query.roomKey,
      }).select('title options roomKey');
      res.status(200).send(isRoomAvail);
    } catch (error) {}
  }
};

exports.createRoom = async (req, res) => {
  if (!req.body.title || !req.body.options) {
    res.status(401).send({ message: "Body can't be empty" });
  }
  let roomKeyCreated;
  //   options:req.body.options
  const newRoom = new Room({
    title: req.body.title,
    options: req.body.options,
  });
  let roomKey = generateTag(5);
  newRoom.roomKey = roomKey;

  await Room.create(newRoom).then((data) => {
    res.status(201).send({ roomKey: newRoom.roomKey });
  });
};

exports.voting = async (req, res) => {
  if (
    !req.body.name ||
    !req.body.tag ||
    !req.body.roomKey ||
    !req.body.options ||
    !req.body.idSelected
  ) {
    res.status(401).send({ message: "Body can't be empty" });
  }
  const filter = { roomKey: req.body.roomKey };
  const room = await Room.findOne(filter);
  if (room) {
    const checkVoted = room.votedBy.findIndex((e) => {
      return e.name == req.body.name && e.tag == req.body.tag;
    });
    console.log('check Voted', checkVoted);
    if (checkVoted >= 0) {
      res.status(503).send({ message: 'user has been voted' });
    } else {
      let array = room.options;

      const idSelected = req.body.idSelected;
      console.log('id options: ', idSelected);
      const upd_obj = array.findIndex((e) => {
        return e._id == idSelected;
      });
      array[upd_obj].count = ++array[upd_obj].count;

      console.log('==========================: ');
      console.log('update options: ', array[upd_obj]);
      //   console.log('filtered options: ', filteredArray);

      await Room.updateOne(
        { roomKey: req.body.roomKey },
        {
          //push array votedBy
          $push: { votedBy: { name: req.body.name, tag: req.body.tag } },
          options: array,
        }
      );
      const isRoomAvail = await Room.findOne({
        roomKey: req.body.roomKey,
      }).select('title options roomKey');
      res.status(200).send(isRoomAvail);
    }
  }
};
