const path = require('path');
const mongoose = require('mongoose');
const dbMap = require('../plugin/mongoose');

module.exports = class {
  constructor(tableName, dbName) {
    let category = (new Error()).stack.split('\n')[2];
    category = category.substring(category.indexOf('(') + 1, category.indexOf(':'));

    this.logger = getLogger(category);

    // 没指定数据库名称默认第一个
    const db = dbName ? dbMap.get(dbName) : dbMap.values()[0];
    if (!db) {
      throw new Error(`can not fing db: ${dbName}`);
    }

    this.modelName = path.basename(category, '.js');
    this.tableName = tableName || this.modelName;
    this.model = {};

    let schema = this.schema;
    if (!mongoose.modelSchemas[this.modelName]) {
      schema = new mongoose.Schema(schema);
      schema.set('collection', this.tableName);
      schema.set('timestamps', false);
      schema.set('autoIndex', true);
      schema.set('strict', true);
      schema.set('id', true);
      schema.set('_id', false);
      schema.set('versionKey', false);
      schema.set('minimize', true);
      schema.set('toObject', {getters: true, virtuals: true, minimize: true, id: true});
      schema.set('toJson', {getters: true, virtuals: true, minimize: true, id: true});

      const index = this.index;
      if (Array.isArray(index) && index.length > 0) {
        index.forEach(v => schema.index(v.index, v.option || {}));
      }

      const that = this;
      schema.pre('save', async (next) => {
        await that.beforeSave();
        next();
      });

      schema.post('save', async () => {
        await that.afterSave();
      });

      schema.pre('update', async (next) => {
        await that.beforeUpdate();
        next();
      });

      schema.post('update', async () => {
        await that.afterUpdate();
      });

      this.model = db.model(this.modelName, schema, this.tableName);
    } else {
      this.model = db.model(this.modelName);
    }
    this.model.ObjectId = mongoose.Types.ObjectId;

    return this.model;
  }

  beforeSave() {
    // waiting for subclass rewrite
  }

  afterSave() {
    // waiting for subclass rewrite
  }

  beforeUpdate() {
    // waiting for subclass rewrite
  }

  afterUpdate() {
    // waiting for subclass rewrite
  }
};
