import React, {useState, useEffect} from 'react';
import SearchResultsTable from '../SearchResultsTable/SearchResultsTable';
import {toast} from 'react-toastify';
import {getTestKitShippingInfo, getShippingInfoByID} from '../../api/Api';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import SearchIcon from '@mui/icons-material/Search';
import Button from '@mui/material/Button';

import './search-box-and-result.css';


export default function SearchBoxAndResult() {
  const [textInput, updateTextInput] = useState('');
  const [kitData, updateKitData] = useState([]);
  const [selectedKits, updateSelectedKits] = useState([]);

  useEffect(() => {
    getTestKitShippingInfo().then((response) => {
      updateKitData(response);
    })
  }, []);

  const handleSubmit = (labelId) => {
    const id = labelId ? labelId : textInput;
    getShippingInfoByID(id)
      .then((response) => {
        if (response && response.length > 0) {
          const found = selectedKits.some(el => el.label_id === response[0].label_id);
          if (!found) {
            toast.info('Test Kit Retrieved', {position: toast.POSITION.TOP_RIGHT});
            updateSelectedKits(selectedKits.concat(response));
          } else {
            toast.warn('Test Kit Already Retrieved', {position: toast.POSITION.TOP_RIGHT});
          }
        } else {
          toast.error(`No Test Kit Found. Kit ID ${textInput}`, {position: toast.POSITION.TOP_RIGHT});
        }
      })
      .catch(console.error);
  };

  const handleAutocompleteChange = (event, value) => {
    updateTextInput(value);
    if (value) {
      handleSubmit(value);
    }
  }

  const handleInputChange = (event) => {
    updateTextInput(event.target.value);
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSubmit(null);
    }
  }

  const clearSearchResults = () => updateSelectedKits([]);

  return (
    <div className='search-box-and-result'>
      <div className='search-box-container'>
        <button className='search-box-submit-btn' type='button' title='search' aria-label='search'
                onMouseDown={() => handleSubmit(null)}>
          <SearchIcon/>
        </button>
        <div className='autocomplete-container'>
          <Autocomplete
            className='search-box-input'
            freeSolo
            onKeyDown={handleKeyDown}
            onChange={handleAutocompleteChange}
            options={kitData.map((option) => option.label_id)}
            renderInput={(params) =>
              <TextField
                {...params}
                label='Label Id'
                variant='standard'
                onChange={handleInputChange}
              />
            }
          />
        </div>
      </div>
      {selectedKits.length > 0 ? (
        <div className='results-container'>
          <SearchResultsTable searchResults={selectedKits}/>
          <div className='results-button-container'>
            <Button className='clear-results-btn' variant='contained' onClick={clearSearchResults}>Clear
              Results</Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
