import express from 'express';

import multer from 'multer';

import mongoose from 'mongoose';

import {
  loginValidation,
  registerValidation,
  postCreateValidation,
} from './validations.js';

import checkAuth from './utils/checkAuth.js';

import * as UserController from './controllers/UserController.js';
import * as PostController from './controllers/PostController.js';

mongoose
  .connect(
    'mongodb+srv://mongouser:mongopassword@cluster0.6gsww4w.mongodb.net/blog?retryWrites=true&w=majority'
  )
  .then(() => console.log('db OK'))
  .catch((err) => console.log('DB error', err));

const app = express();
app.use('/uploads', express.static('uploads'));

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json());

app.get('/', (req, res) => {
  res.send('hello!');
});

app.post('/auth/login', loginValidation, UserController.login);
app.post('/auth/register', registerValidation, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidation, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', postCreateValidation, checkAuth, PostController.update);

app.listen(4444, (err) => {
  if (err) {
    return console.error(err);
  }

  console.log('server OK');
});
