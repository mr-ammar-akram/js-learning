import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  slotProps: {
    paper: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  },
};

export default function MultipleSelectCheckmarks({ catsData = [], tagsData = [], postCats, postTags, selectedData }) {

  // Track IDs instead of names
  const [selectedCatIDs, setSelectedCatIDs] = useState([]);
  const [selectedTagIDs, setSelectedTagIDs] = useState([]);
  const hasLoggedPostData = useRef(false);

    useEffect(() => {
        if(postCats && postTags){
            if (postCats.length > 0 && postTags.length > 0 && !hasLoggedPostData.current) {
                setSelectedCatIDs(
                    postCats.map(cat => Number(typeof cat === 'object' ? cat.id : cat))
                );

                setSelectedTagIDs(
                    postTags.map(tag => Number(typeof tag === 'object' ? tag.id : tag))
                );
            
            hasLoggedPostData.current = true;
            }
        }
    }, [postCats,postTags]);

  useEffect(() => {
    if (selectedData) {
      selectedData({
        catIDs: selectedCatIDs,
        tagIDs: selectedTagIDs
      });
    }
  }, [selectedCatIDs, selectedTagIDs, selectedData]);

  const handleCatChange = (event) => {
    const { target: { value } } = event;
    // On autofill we get a stringified value.
    const currentCatIDs = typeof value === 'string' ? value.split(',') : value;
    setSelectedCatIDs(currentCatIDs);
  }; 
  
  const handleTagChange = (event) => {
    const { target: { value } } = event;
    // On autofill we get a stringified value.
    const currentTagIDs = typeof value === 'string' ? value.split(',') : value;
    setSelectedTagIDs(currentTagIDs);
  };


  // Helper function to map IDs back to Names for display purposes
  const getCatsNamesFromIDs = (ids) => {
    return ids
      .map((id) => catsData.find((cat) => cat.id === id)?.cat_name)
      .filter(Boolean)
      .join(', ');
  };

  // Helper function to map IDs back to Names for display purposes
  const getTagsNamesFromIDs = (ids) => {
    return ids
      .map((id) => tagsData.find((tag) => tag.id === id)?.tag_name)
      .filter(Boolean)
      .join(', ');
  };
  return (
    <div className='flex gap-2'>
      <FormControl sx={{ width: '100%' }}>
        <InputLabel id="demo-multiple-checkbox-label">Categories</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={selectedCatIDs} // Controlled by IDs array
          onChange={handleCatChange}
          input={<OutlinedInput label="Categories" />}
          renderValue={(selected) => getCatsNamesFromIDs(selected)} // Converts [1, 2] -> "Category A, Category B"
          MenuProps={MenuProps}
        >
          {catsData.map((category) => {
            const selected = selectedCatIDs.includes(category.id);
            const SelectionIcon = selected ? CheckBoxIcon : CheckBoxOutlineBlankIcon;

            return (
              <MenuItem key={category.id} value={category.id}>
                <SelectionIcon
                  fontSize="small"
                  style={{ marginRight: 8, padding: 9, boxSizing: 'content-box' }}
                />
                <ListItemText primary={category.cat_name} />
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
      <FormControl sx={{ width: "100%" }}>
        <InputLabel id="demo-multiple-checkbox-label">Tags</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={selectedTagIDs} // Controlled by IDs array
          onChange={handleTagChange}
          input={<OutlinedInput label="Tags" />}
          renderValue={(selected) => getTagsNamesFromIDs(selected)} // Converts [1, 2] -> "Category A, Category B"
          MenuProps={MenuProps}
        >
          {tagsData.map((tag) => {
            const selected = selectedTagIDs.includes(tag.id);
            const SelectionIcon = selected ? CheckBoxIcon : CheckBoxOutlineBlankIcon;

            return (
              <MenuItem key={tag.id} value={tag.id}>
                <SelectionIcon
                  fontSize="small"
                  style={{ marginRight: 8, padding: 9, boxSizing: 'content-box' }}
                />
                <ListItemText primary={tag.tag_name} />
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </div>
  );
}
