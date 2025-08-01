const express = require('express');
const router = express.Router();
const DataItem = require('../models/DataItem');

// @route   GET api/data
// @desc    Get all data items with optional filtering
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { 
            categoryFilter, 
            branchFilter, 
            supplierFilter, 
            limit = 1000,  // Increased default limit
            page = 1,
            sortBy = 'xnMemoDate',
            sortOrder = 'desc'
        } = req.query;
        
        // Build query object
        let query = {};
        
        if (categoryFilter && categoryFilter !== '') {
            query.categoryFilter = { $regex: categoryFilter, $options: 'i' };
        }
        
        if (branchFilter && branchFilter !== '') {
            query.branchFilter = { $regex: branchFilter, $options: 'i' };
        }
        
        if (supplierFilter && supplierFilter !== '') {
            query.supplierFilter = { $regex: supplierFilter, $options: 'i' };
        }

        // Calculate pagination
        const limitNum = parseInt(limit);
        const pageNum = parseInt(page);
        const skip = (pageNum - 1) * limitNum;

        // Build sort object
        const sort = {};
        sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

        // Get total count for pagination info
        const totalCount = await DataItem.countDocuments(query);

        const dataItems = await DataItem.find(query)
            .sort(sort)
            .skip(skip)
            .limit(limitNum);
            
        res.json({
            data: dataItems,
            pagination: {
                currentPage: pageNum,
                totalPages: Math.ceil(totalCount / limitNum),
                totalRecords: totalCount,
                recordsPerPage: limitNum,
                hasNextPage: skip + limitNum < totalCount,
                hasPrevPage: pageNum > 1
            },
            filters: { categoryFilter, branchFilter, supplierFilter }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/data/filters
// @desc    Get unique filter values
// @access  Public
router.get('/filters', async (req, res) => {
    try {
        const [categories, branches, suppliers] = await Promise.all([
            DataItem.distinct('categoryFilter'),
            DataItem.distinct('branchFilter'),
            DataItem.distinct('supplierFilter')
        ]);

        res.json({
            categories: categories.filter(c => c && c.trim() !== ''),
            branches: branches.filter(b => b && b.trim() !== ''),
            suppliers: suppliers.filter(s => s && s.trim() !== '')
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/data/summary
// @desc    Get data summary and aggregation
// @access  Public
router.get('/summary', async (req, res) => {
    try {
        const { categoryFilter, branchFilter, supplierFilter } = req.query;
        
        // Build match stage for aggregation
        let matchStage = {};
        if (categoryFilter && categoryFilter !== '') {
            matchStage.categoryFilter = { $regex: categoryFilter, $options: 'i' };
        }
        if (branchFilter && branchFilter !== '') {
            matchStage.branchFilter = { $regex: branchFilter, $options: 'i' };
        }
        if (supplierFilter && supplierFilter !== '') {
            matchStage.supplierFilter = { $regex: supplierFilter, $options: 'i' };
        }

        const summary = await DataItem.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: null,
                    totalRecords: { $sum: 1 },
                    totalNetAmount: { $sum: '$netAmount' },
                    totalNetSlsQty: { $sum: '$netSlsQty' },
                    avgNetAmount: { $avg: '$netAmount' },
                    avgItemMRP: { $avg: '$itemMRP' }
                }
            }
        ]);

        res.json(summary[0] || {
            totalRecords: 0,
            totalNetAmount: 0,
            totalNetSlsQty: 0,
            avgNetAmount: 0,
            avgItemMRP: 0
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
