const { generateTag } = require('../utils/TagGenerator');
const db = require('../models');
const Room = db.activity;
function tryParseJSONObject(jsonString) {
  try {
    let o = JSON.parse(jsonString);

    if (o && typeof o === 'object') {
      return o;
    }
  } catch (e) {}

  return false;
}

exports.findRoom = async (req, res) => {
  // console.log(req.query);
  if (!req.query.roomKey) {
    try {
      const isRoomAvail = await Room.find({}).select('title options roomKey');
      console.log(isRoomAvail);
      res.status(200).send(isRoomAvail);
      res.end();
    } catch (error) {}
  } else {
    try {
      const isRoomAvail = await Room.findOne({
        roomKey: req.query.roomKey,
      }).select('title options roomKey');
      console.log(isRoomAvail);
      res.status(200).send(isRoomAvail);
      res.end();
    } catch (error) {}
  }
};

exports.createRoom = async (req, res) => {
  const { title, options } = req.body;
  // console.log(options);
  // res.status(200).send({ roomKey: 'Null' });
  const newRoom = new Room({
    title: title,
    options: tryParseJSONObject(options),
  });

  let roomKey = generateTag(5);
  newRoom.roomKey = roomKey;

  await Room.create(newRoom).then((data) => {
    res.send({ roomKey: newRoom.roomKey });
  });
};

exports.voting = async (req, res) => {
  // No need     !req.body.options ||!req.body.tag ||
  // console.log(req.body);
  // res.status(200).send({ message: 'ok' });

  if (!req.body.name || !req.body.roomKey || !req.body.idSelected) {
    res.status(401).send({ message: "Body can't be empty" });
    res.end();
  }
  const filter = { roomKey: req.body.roomKey };
  const room = await Room.findOne(filter);
  if (room) {
    const checkVoted = room.votedBy.findIndex((e) => {
      return e.name == req.body.name;
    });
    console.log('check Voted', checkVoted);
    if (checkVoted >= 0) {
      res.status(200).send({ message: 'user has been voted' });
      res.end();
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
          $push: {
            votedBy: { name: req.body.name, idSelected: req.body.idSelected },
          },
          options: array,
        }
      );
      const isRoomAvail = await Room.findOne({
        roomKey: req.body.roomKey,
      }).select('title options roomKey');
      res.status(200).send({ message: 'vote success' });
      res.end();
    }
  }
};
