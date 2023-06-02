import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

export const FiltersBlock = ({
  filters,
  handleFilterChange,
  handleResetFilters,
}) => {
  const [isFilterVisible, setFilterVisible] = useState(false);

  const toggleFilter = () => {
    setFilterVisible(!isFilterVisible);
  };

  return (
    <div
      style={{
        marginBottom: 16,
      }}
    >
      <Button startIcon={<FilterListIcon />} onClick={toggleFilter}>
        Фільтри
      </Button>
      {isFilterVisible && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 16,
          }}
        >
          <TextField
            style={{
              marginRight: 16,
              width: '170px',
            }}
            label="Номер перевезення"
            name="shipmentNum"
            value={filters.shipmentNum}
            onChange={handleFilterChange}
          />
          <TextField
            style={{
              marginRight: 16,
              width: '170px',
            }}
            label="Початковий пункт"
            name="originCity"
            value={filters.originCity}
            onChange={handleFilterChange}
          />
          <TextField
            style={{
              marginRight: 16,
              width: '170px',
            }}
            label="Кінцевий пункт"
            name="destinationCity"
            value={filters.destinationCity}
            onChange={handleFilterChange}
          />
          <FormControl>
            <InputLabel
              id="status-label"
              style={{ background: 'white', padding: '0 5px' }}
            >
              Статус
            </InputLabel>
            <Select
              labelId="status-label"
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              style={{ marginRight: 16, width: '170px' }}
            >
              <MenuItem value="">Усі</MenuItem>
              <MenuItem value="В очікуванні">В очікуванні</MenuItem>
              <MenuItem value="Виконано">Виконано</MenuItem>
              <MenuItem value="В процесі">В процесі</MenuItem>
            </Select>
          </FormControl>
          <IconButton
            style={{
              marginLeft: 16,
            }}
            variant="contained"
            color="primary"
            onClick={handleResetFilters}
          >
            <ClearIcon />
          </IconButton>
        </div>
      )}
    </div>
  );
};
