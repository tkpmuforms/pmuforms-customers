import { Autocomplete, TextField } from '@mui/material';

const CustomerSelector = ({ customers, onSelect, value }) => {
  return (
    <Autocomplete
      options={customers}
      getOptionLabel={(option) => option.name}
      value={value}
      onChange={(event, value) => onSelect(value)}
      renderInput={(params) => (
        <TextField {...params} label="Select a client" />
      )}
    />
  );
};

export default CustomerSelector;