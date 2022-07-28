const mongoose = require('mongoose');

const { Schema } = mongoose;

mongoose
  .connect('mongodb://localhost:27017/test')
  .then(console.log('Connected to MongoDB...'))
  .catch((err) => console.log(err));

/** Questions */

const QuestionSchema = new Schema({
  asker_email: String,
  asker_name: String,
  body: String,
  date_written: Number,
  helpful: Number,
  id: Number,
  product_id: Number,
  reported: Number,
});

const Question = mongoose.model('Question', QuestionSchema);

const findQuestion = (options) => Question.find(options).exec();

const createQuestion = (data) => Question.create(data);

// findQuestion({ product_id: 1 }).then((data) =>
//   console.log('Question is ', data)
// );

/** Answers */
const AnswerSchema = new Schema({
  answer_id: Number,
  id: Number,
  url: String,
});

const Answer = mongoose.model('Answer', AnswerSchema);

const findAnswer = (options) => Answer.find(options).exec();

const createAnswer = (data) => Answer.create(data);

// findAnswer({ id: 1 }).then((data) => console.log('Answer is ', data));

/** Answers */
const AnswerPhotoSchema = new Schema({
  answer_id: Number,
  id: Number,
  url: String,
});

const AnswersPhoto = mongoose.model('Answers_Photo', AnswerPhotoSchema);

const findAnswerPhoto = (options) => AnswersPhoto.find(options).exec();

const createAnswerPhoto = (data) => AnswersPhoto.create(data);

findAnswerPhoto({ id: 4 }).then((data) => console.log('AnswerPhoto is ', data));

module.exports = {
  findQuestion,
  createQuestion,
  findAnswer,
  createAnswer,
  findAnswerPhoto,
  createAnswerPhoto,
};
