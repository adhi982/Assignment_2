# Data Aggregation & Filtering Project

A full-stack MERN (MongoDB, Express.js, React, Node.js) application for data aggregation and filtering. This project allows users to filter and analyze business data from an Excel file through an interactive web interface.

## Features

- **Data Import**: Import data from Excel files (`.xlsx`) into MongoDB
- **Advanced Filtering**: Filter data by Category, Branch, and Supplier
- **Real-time Search**: Dynamic filtering with dropdown selectors
- **Data Visualization**: Tabular display with sorting and styling
- **Summary Analytics**: Display aggregated statistics
- **Responsive Design**: Mobile-friendly interface

## Project Structure

```
Aggregate_project/
├── backend/                 # Node.js/Express API server
│   ├── config/
│   │   └── database.js      # MongoDB connection configuration
│   ├── models/
│   │   └── DataItem.js      # MongoDB schema/model
│   ├── routes/
│   │   └── data.js          # API routes for data operations
│   ├── importData.js        # Excel data import script
│   ├── server.js            # Express server setup
│   └── package.json         # Backend dependencies
├── frontend/                # React.js client application
│   ├── src/
│   │   ├── components/
│   │   │   ├── DataDisplay.js    # Main data filtering component
│   │   │   └── DataDisplay.css   # Component styling
│   │   ├── App.js           # Main React component
│   │   └── App.css          # Global styling
│   └── package.json         # Frontend dependencies
├── data-mb.xlsx             # Source Excel data file
└── .env                     # Environment variables
```

## Technology Stack

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **XLSX**: Excel file processing
- **CORS**: Cross-origin resource sharing
- **dotenv**: Environment variable management

### Frontend
- **React.js**: UI library
- **Axios**: HTTP client for API calls
- **CSS3**: Modern styling with flexbox/grid
- **Responsive Design**: Mobile-first approach

## Data Schema

The application handles retail/sales data with the following fields:

- Date Information: `xnMemoDate`, `purDate`
- Organization: `departmentShortName`, `branchAlias`, `branchFilter`
- Product Info: `articleNo`, `itemId`, `fabric`, `concept`
- Supplier Info: `supplierAlias`, `supplierFilter`, `supplierName`
- Category Info: `categoryShortName`, `categoryFilter`
- Financial Data: `netAmount`, `itemMRP`, `netSlsQty`

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

### 1. Clone the repository
```bash
git clone <repository-url>
cd Aggregate_project
```

### 2. Setup Backend
```bash
cd backend
npm install
```

### 3. Setup Frontend
```bash
cd frontend
npm install
```

### 4. Configure Environment Variables
Create a `.env` file in the root directory:
```
MONGO_URI=mongodb://localhost:27017/aggregate_project
PORT=5000
```

### 5. Start MongoDB
```bash
# Windows
mongod --dbpath="e:\data\db"

# macOS/Linux
mongod --dbpath="/path/to/your/data/db"
```

### 6. Import Data
```bash
cd backend
npm run import
```

This will import all **49,386 records** from the Excel file into MongoDB.

### 7. Verify Data Import (Optional)
```bash
cd backend
npm run verify
```

This will show you:
- Total records imported: **49,386**
- Available filter options: **34 categories, 90 branches, 191 suppliers**
- Financial summary with total amounts and statistics

### 7. Start the Application

Terminal 1 - Backend:
```bash
cd backend
node server.js
```

Terminal 2 - Frontend:
```bash
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## API Endpoints

### GET /api/data
Get filtered data with optional query parameters:
- `categoryFilter`: Filter by category
- `branchFilter`: Filter by branch
- `supplierFilter`: Filter by supplier
- `limit`: Limit number of results (default: 100)

### GET /api/data/filters
Get all available filter options (categories, branches, suppliers)

### GET /api/data/summary
Get aggregated summary statistics for filtered data

## Usage

1. **Access the Application**: Open http://localhost:3000 in your browser

2. **Apply Filters**: 
   - Use the dropdown menus to select Category, Branch, and Supplier filters
   - Click "Apply Filters" to update the data display

3. **View Results**:
   - View summary statistics at the top
   - Browse filtered data in the table below
   - Positive/negative amounts are color-coded

4. **Clear Filters**: Click "Clear Filters" to reset all selections

## Key Features Explained

### Filtering System
- **Dynamic Dropdowns**: Filter options are populated from actual data
- **Multiple Filters**: Apply combinations of category, branch, and supplier filters
- **Real-time Updates**: Data updates immediately when filters are applied

### Data Display
- **Responsive Table**: Scrollable table with fixed headers
- **Financial Formatting**: Currency amounts formatted in INR
- **Date Formatting**: Excel date numbers converted to readable dates
- **Visual Indicators**: Color-coded positive/negative amounts

### Performance Optimizations
- **Batch Processing**: Large datasets processed in batches during import
- **Pagination**: Configurable result limits to manage performance
- **Indexed Queries**: MongoDB indexes on filter fields
- **Optimized React Rendering**: Efficient state management and re-rendering

## Customization

### Adding New Filters
1. Update the MongoDB schema in `models/DataItem.js`
2. Add new filter logic in `routes/data.js`
3. Update the frontend form in `components/DataDisplay.js`

### Styling Changes
- Modify `DataDisplay.css` for component-specific styles
- Update `App.css` for global styling changes
- Colors, fonts, and layout can be customized via CSS variables

### Data Import Modifications
- Update field mappings in `importData.js`
- Modify the schema in `DataItem.js` to match your Excel structure

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check the connection string in `.env`
   - Verify database permissions

2. **Excel Import Failures**
   - Check file path in `importData.js`
   - Ensure Excel file format is `.xlsx`
   - Verify column structure matches expected schema

3. **Frontend Not Loading**
   - Check if backend server is running on port 5000
   - Verify CORS settings in backend
   - Check browser console for errors

4. **Filter Not Working**
   - Check API responses in browser developer tools
   - Verify data is properly imported
   - Check filter field names match database schema

## Development

### Adding New Features
1. Backend: Add routes in `routes/data.js`
2. Frontend: Update components in `src/components/`
3. Database: Modify schema in `models/DataItem.js`

### Testing
- Backend: Test API endpoints using tools like Postman
- Frontend: Use React Developer Tools for component debugging
- Database: Use MongoDB Compass to verify data

## License

This project is open source and available under the [MIT License](LICENSE).

## Contributors

- [Your Name] - Initial development

## Support

For support or questions, please open an issue in the project repository.
