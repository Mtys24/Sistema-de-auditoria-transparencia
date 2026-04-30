const mongoose = require('mongoose');
const { Schema } = mongoose;

async function connectMongo() {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/Sw_auditoria';
  await mongoose.connect(uri);
  console.log('MongoDB conectado');
}

const Area = mongoose.model('Area', new Schema({
  name: { type: String, unique: true, required: true }
}));

const Category = mongoose.model('Category', new Schema({
  name: { type: String, required: true },
  code: { type: String },
  order: { type: Number, default: 0 },
  areas: [{ type: Schema.Types.ObjectId, ref: 'Area' }],
  responsible_emails: { type: String, default: '' }
}));

const Subcategory = mongoose.model('Subcategory', new Schema({
  name: { type: String, required: true },
  code: { type: String, default: '' },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  status: { type: String, enum: ['Completo', 'Incompleto', 'Faltante', 'No disponible'], default: 'Incompleto' },
  order: { type: Number, default: 0 },
  areas: [{ type: Schema.Types.ObjectId, ref: 'Area' }],
  responsible_emails: { type: String, default: '' }
}));

const Item = mongoose.model('Item', new Schema({
  name: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  subcategory: { type: Schema.Types.ObjectId, ref: 'Subcategory', default: null },
  status: { type: String, enum: ['Completo', 'Incompleto', 'Faltante', 'No disponible'], default: 'Incompleto' },
  tag: { type: String, default: '' },
  detail: { type: String, default: '' },
  prev_observation: { type: String, default: '' },
  deadline: { type: String, default: '' },
  areas: [{ type: Schema.Types.ObjectId, ref: 'Area' }],
  responsible_emails: { type: String, default: '' }
}, { timestamps: true }));
const Config = mongoose.model('Config', new Schema({
  key: { type: String, unique: true, required: true },
  value: { type: Schema.Types.Mixed }
}, { timestamps: true }));

module.exports = { connectMongo, Area, Category, Subcategory, Item, Config };
