const mongoose = require('mongoose');
const xlsx = require('xlsx');
const connectDB = require('./config/database');
const DataItem = require('./models/DataItem');
require('dotenv').config();

const importData = async () => {
    await connectDB();

    try {
        // Clear existing data
        await DataItem.deleteMany({});
        console.log('Existing data cleared');

        // Read the Excel file
        const workbook = xlsx.readFile('../data-mb.xlsx');
        
        // Use Sheet1 which contains the main data (49,387 rows)
        const sheetName = 'Sheet1'; // Changed from workbook.SheetNames[0] to specifically use Sheet1
        const sheet = workbook.Sheets[sheetName];
        const jsonData = xlsx.utils.sheet_to_json(sheet, { header: 1 });

        console.log(`Found ${jsonData.length} rows in sheet "${sheetName}"`);

        // For Sheet1, headers are in the first row (row 1, index 0)
        const headers = jsonData[0];
        console.log('Headers:', headers);

        // Prepare data for insertion (start from row 2, index 1)
        const dataToInsert = jsonData.slice(1).map(row => {
            if (!row || row.length === 0 || !row[0]) return null;
            
            return {
                xnMemoDate: row[0],
                departmentShortName: row[1],
                categoryShortName: row[2],
                categoryFilter: row[3],
                branchAlias: row[4],
                branchFilter: row[5],
                supplierAlias: row[6],
                supplierFilter: row[7],
                supplierName: row[8],
                supplierCity: row[9],
                articleNo: row[10],
                para1Name: row[11],
                para2Name: row[12],
                para2Index: row[13],
                fabric: row[14],
                subFabric: row[15],
                concept: row[16],
                itemId: row[17],
                itemMRP: row[18],
                property: row[19],
                para3Name: row[20],
                para4Name: row[21],
                purDate: row[22],
                netSlsQty: row[23],
                netAmount: row[24],
                netSlsCostValue: row[25],
                slsExtCostValue: row[26]
            };
        }).filter(item => item && item.articleNo); // Filter out empty rows

        // Insert new data in batches
        if (dataToInsert.length > 0) {
            const batchSize = 2000; // Increased batch size for better performance with large dataset
            const totalBatches = Math.ceil(dataToInsert.length / batchSize);
            
            console.log(`Starting import of ${dataToInsert.length} records in ${totalBatches} batches...`);
            
            for (let i = 0; i < dataToInsert.length; i += batchSize) {
                const batch = dataToInsert.slice(i, i + batchSize);
                const batchNumber = Math.floor(i/batchSize) + 1;
                
                console.log(`Processing batch ${batchNumber}/${totalBatches} (records ${i + 1} to ${Math.min(i + batchSize, dataToInsert.length)})...`);
                
                try {
                    await DataItem.insertMany(batch, { ordered: false }); // Continue on duplicate key errors
                    console.log(`✓ Batch ${batchNumber} completed successfully`);
                } catch (error) {
                    console.log(`⚠ Batch ${batchNumber} completed with some errors (this is normal for duplicates):`, error.message);
                }
            }
            console.log(`\n🎉 Data import completed! Total records processed: ${dataToInsert.length}`);
        } else {
            console.log('No valid data found to import');
        }

    } catch (err) {
        console.error('Error importing data:', err);
    } finally {
        mongoose.connection.close();
    }
};

importData();
