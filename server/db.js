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

/** Answers Photos */
const AnswerPhotoSchema = new Schema({
  answer_id: Number,
  id: Number,
  url: String,
});

const AnswersPhoto = mongoose.model('Answers_Photo', AnswerPhotoSchema);

const findAnswerPhoto = (options) => AnswersPhoto.find(options).limit(5).exec();

const createAnswerPhoto = (data) => AnswersPhoto.create(data);

/** Answers */
const AnswerSchema = new Schema({
  answer_email: String,
  answer_name: String,
  body: String,
  data_written: Number,
  helpful: Number,
  id: Number,
  question_id: Number,
  reported: String,
});

const Answer = mongoose.model('Answer', AnswerSchema);

const findAnswer = (options) => Answer.findOne(options).exec();

const createAnswer = (data) => Answer.create(data);

/** CombinedAnswers */
const CombinedAnswerSchema = new Schema({
  answer_email: String,
  answer_name: String,
  body: String,
  data_written: Number,
  helpful: Number,
  question_id: Number,
  reported: String,
  photos: [AnswerPhotoSchema],
});

const CombinedAnswer = mongoose.model('CombinedAnswer', CombinedAnswerSchema);

const findCombinedAnswer = (options) => CombinedAnswer.findOne(options).exec();

const createCombinedAnswer = (data) => CombinedAnswer.create(data);

// const aggregate = Answer.aggregate([{ $match: { question_id: 3518963 } }]);

function cca(id) {
  Promise.all([
    findAnswer({ question_id: id }),
    findAnswerPhoto({ answer_id: id }),
  ])
    .then(([data, photos]) => {
      console.log({
        // eslint-disable-next-line no-underscore-dangle
        ...data._doc,
        photos,
      });
    })
    .catch((err) => console.error(err));
}
cca(3518963);

module.exports = {
  findQuestion,
  createQuestion,
  findAnswer,
  createAnswer,
  findAnswerPhoto,
  createAnswerPhoto,
  findCombinedAnswer,
  createCombinedAnswer,
};
