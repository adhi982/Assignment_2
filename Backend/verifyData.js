const mongoose = require('mongoose');
const connectDB = require('./config/database');
const DataItem = require('./models/DataItem');
require('dotenv').config();

const verifyData = async () => {
    await connectDB();

    try {
        // Get total count
        const totalCount = await DataItem.countDocuments();
        console.log(`📊 Total records in database: ${totalCount.toLocaleString()}`);

        // Get distinct values for filters
        const [categories, branches, suppliers] = await Promise.all([
            DataItem.distinct('categoryFilter'),
            DataItem.distinct('branchFilter'),
            DataItem.distinct('supplierFilter')
        ]);

        console.log(`\n📂 Filter Options Available:`);
        console.log(`   Categories: ${categories.length} unique values`);
        console.log(`   Branches: ${branches.length} unique values`);
        console.log(`   Suppliers: ${suppliers.length} unique values`);

        // Get sample data
        const sampleData = await DataItem.find().limit(3);
        console.log(`\n📋 Sample Data (first 3 records):`);
        sampleData.forEach((item, index) => {
            console.log(`   ${index + 1}. Article: ${item.articleNo}, Category: ${item.categoryFilter}, Branch: ${item.branchFilter}, Amount: ₹${item.netAmount}`);
        });

        // Get summary statistics
        const summary = await DataItem.aggregate([
            {
                $group: {
                    _id: null,
                    totalNetAmount: { $sum: '$netAmount' },
                    avgNetAmount: { $avg: '$netAmount' },
                    maxNetAmount: { $max: '$netAmount' },
                    minNetAmount: { $min: '$netAmount' },
                    totalQuantity: { $sum: '$netSlsQty' }
                }
            }
        ]);

        if (summary.length > 0) {
            const stats = summary[0];
            console.log(`\n💰 Financial Summary:`);
            console.log(`   Total Net Amount: ₹${stats.totalNetAmount?.toLocaleString() || 0}`);
            console.log(`   Average Net Amount: ₹${Math.round(stats.avgNetAmount || 0).toLocaleString()}`);
            console.log(`   Max Net Amount: ₹${stats.maxNetAmount?.toLocaleString() || 0}`);
            console.log(`   Min Net Amount: ₹${stats.minNetAmount?.toLocaleString() || 0}`);
            console.log(`   Total Quantity: ${stats.totalQuantity?.toLocaleString() || 0}`);
        }

        console.log(`\n✅ Data verification completed successfully!`);

    } catch (err) {
        console.error('❌ Error verifying data:', err);
    } finally {
        mongoose.connection.close();
    }
};

verifyData();
