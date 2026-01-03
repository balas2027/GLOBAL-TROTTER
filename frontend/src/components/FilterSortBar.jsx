import { useState } from 'react';
import { SlidersHorizontal, ArrowUpDown, Calendar } from 'lucide-react';
import { Menu, MenuItem, Slider, TextField, Button, Popover } from '@mui/material';

const FilterSortBar = ({ onFilter, onSort }) => {
    const [anchorElFilter, setAnchorElFilter] = useState(null);
    const [anchorElSort, setAnchorElSort] = useState(null);
    const [anchorElDate, setAnchorElDate] = useState(null);
    
    // Filter States
    const [budgetRange, setBudgetRange] = useState([0, 10000]);
    const [distanceRange, setDistanceRange] = useState([0, 5000]); // km
    const [searchDate, setSearchDate] = useState('');

    const applyFilters = () => {
        onFilter({
            minBudget: budgetRange[0],
            maxBudget: budgetRange[1],
            minDistance: distanceRange[0],
            maxDistance: distanceRange[1],
            date: searchDate
        });
        setAnchorElFilter(null);
    };

    const applyDateFilter = (dateStr) => {
         onFilter({
            minBudget: budgetRange[0],
            maxBudget: budgetRange[1],
            minDistance: distanceRange[0],
            maxDistance: distanceRange[1],
            date: dateStr
        });
        setAnchorElDate(null);
    };

    const handleSort = (type) => {
        onSort(type);
        setAnchorElSort(null);
    };

    return (
        <div className="flex gap-3">
             {/* DATE FILTER BUTTON */}
             <Button 
                variant="outlined" 
                startIcon={<Calendar size={16}/>} 
                onClick={(e) => setAnchorElDate(e.currentTarget)}
                sx={{ borderRadius: '20px', textTransform: 'none', borderColor: '#e2e8f0', color: '#64748b' }}
            >
                Date
            </Button>

            {/* FILTER BUTTON */}
            <Button 
                variant="outlined" 
                startIcon={<SlidersHorizontal size={16}/>} 
                onClick={(e) => setAnchorElFilter(e.currentTarget)}
                sx={{ borderRadius: '20px', textTransform: 'none', borderColor: '#e2e8f0', color: '#64748b' }}
            >
                Filters
            </Button>
            
            {/* SORT BUTTON */}
            <Button 
                variant="outlined" 
                startIcon={<ArrowUpDown size={16}/>} 
                onClick={(e) => setAnchorElSort(e.currentTarget)}
                sx={{ borderRadius: '20px', textTransform: 'none', borderColor: '#e2e8f0', color: '#64748b' }}
            >
                Sort By
            </Button>

            {/* FILTER POPOVER */}
            <Popover
                open={Boolean(anchorElFilter)}
                anchorEl={anchorElFilter}
                onClose={() => setAnchorElFilter(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <div className="p-6 w-80">
                    <h3 className="font-bold text-gray-800 mb-4">Filter Trips</h3>
                    
                    {/* Budget */}
                    <div className="mb-6">
                        <label className="text-sm font-medium text-gray-600 mb-2 block">Budget Limit ($)</label>
                        <Slider
                            value={budgetRange}
                            onChange={(e, v) => setBudgetRange(v)}
                            valueLabelDisplay="auto"
                            min={0}
                            max={20000}
                            step={100}
                        />
                         <div className="flex justify-between text-xs text-gray-400 mt-1">
                            <span>${budgetRange[0]}</span>
                            <span>${budgetRange[1]}</span>
                        </div>
                    </div>

                    {/* Distance */}
                    <div className="mb-6">
                        <label className="text-sm font-medium text-gray-600 mb-2 block">Distance (km)</label>
                        <Slider
                            value={distanceRange}
                            onChange={(e, v) => setDistanceRange(v)}
                            valueLabelDisplay="auto"
                            min={0}
                            max={20000}
                        />
                         <div className="flex justify-between text-xs text-gray-400 mt-1">
                            <span>{distanceRange[0]} km</span>
                            <span>{distanceRange[1]} km</span>
                        </div>
                    </div>

                    <Button variant="contained" fullWidth onClick={applyFilters}>Apply Filters</Button>
                </div>
            </Popover>
            
             {/* DATE POPOVER */}
             <Popover
                open={Boolean(anchorElDate)}
                anchorEl={anchorElDate}
                onClose={() => setAnchorElDate(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            >
                <div className="p-4">
                     <label className="text-sm font-bold text-gray-700 mb-2 block">Select Travel Date</label>
                    <input 
                        type="date" 
                        value={searchDate}
                        onChange={(e) => setSearchDate(e.target.value)}
                        className="border border-gray-300 rounded-lg p-2 w-full mb-3 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                     <div className="flex gap-2">
                        <Button 
                            variant="outlined" 
                            size="small" 
                            fullWidth 
                            onClick={() => { setSearchDate(''); applyDateFilter(''); }}
                        >
                            Clear
                        </Button>
                        <Button 
                            variant="contained" 
                            size="small" 
                            fullWidth 
                            onClick={() => applyDateFilter(searchDate)}
                        >
                            Apply
                        </Button>
                    </div>
                </div>
            </Popover>

            {/* SORT MENU */}
            <Menu
                anchorEl={anchorElSort}
                open={Boolean(anchorElSort)}
                onClose={() => setAnchorElSort(null)}
            >
                <MenuItem onClick={() => handleSort('price_asc')}>Price: Low to High</MenuItem>
                <MenuItem onClick={() => handleSort('price_desc')}>Price: High to Low</MenuItem>
                <MenuItem onClick={() => handleSort('dist_asc')}>Distance: Shortest First</MenuItem>
                <MenuItem onClick={() => handleSort('date_new')}>Date: Newest</MenuItem>
            </Menu>
        </div>
    );
};

export default FilterSortBar;
