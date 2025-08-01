const mongoose = require('mongoose');

const DataItemSchema = new mongoose.Schema({
    xnMemoDate: { type: Number },
    departmentShortName: { type: String },
    categoryShortName: { type: String },
    categoryFilter: { type: String },
    branchAlias: { type: String },
    branchFilter: { type: String },
    supplierAlias: { type: String },
    supplierFilter: { type: String },
    supplierName: { type: String },
    supplierCity: { type: String },
    articleNo: { type: String },
    para1Name: { type: String },
    para2Name: { type: String },
    para2Index: { type: Number },
    fabric: { type: String },
    subFabric: { type: String },
    concept: { type: String },
    itemId: { type: String },
    itemMRP: { type: Number },
    property: { type: String },
    para3Name: { type: String },
    para4Name: { type: String },
    purDate: { type: Number },
    netSlsQty: { type: Number },
    netAmount: { type: Number },
    netSlsCostValue: { type: Number },
    slsExtCostValue: { type: Number }
}, {
    timestamps: true
});

module.exports = mongoose.model('DataItem', DataItemSchema);
