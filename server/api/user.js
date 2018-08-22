const router = require('express').Router();
const { User } = require('../../database');


router.get('/', async (req, res, next) => {
  try{
    const users = await User.findAll()
    res.status(200).send(users)
  } catch (err) {
      next(err)
  }
})

router.get('/:email', async (req, res, next) => {
  try{
    const userExists = await User.findAll({where: {
      email: req.params.email
    }})
    res.status(200).send(userExists)
  } catch(err){
      next(err)
  }
})

router.post('/signup', async (req, res, next) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json(newUser);
  } catch (err) {
    console.log(err)
    next(err);
  }
});

router.put('/login', async (req, res, next) => {
  try {
    const currentUser = await User.findOne({
      where: { email: req.body.email },
    });
    if (currentUser === null) {
      res.status(401).send("Wrong username");
    } else if (!currentUser.correctPassword(req.body.password)) {
      res.status(401).send("Wrong username and/or password");
    } else {
    res.json(currentUser);
    }
  } catch (err) {
    next(err);
  }
});

router.put('/update', async (req,res,next) => {
  try {
    const findUser = await User.findById(req.body.id)
    const updatedUser = await findUser.update(req.body)
    res.status(200).json(updatedUser)
  } catch (error) { next (error) }
});

module.exports = router;
