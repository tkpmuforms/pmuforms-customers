import { Autocomplete, TextField, CircularProgress } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import { searchMyCustomers } from "../../services/services";

const CustomerSelector = ({ customers, onSelect, value, loading }) => {
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState(customers || []);
  const [searching, setSearching] = useState(false);
  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    // Initialize with provided customers
    if (customers && customers.length > 0) {
      setOptions(customers);
      console.log("Initial customers loaded:", customers);
    }

    // Cleanup function to clear any pending timeouts
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [customers]);

  // Handle input change for search functionality
  const handleInputChange = (event, newInputValue) => {
    setInputValue(newInputValue);

    // Clear any existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // If input is at least 2 characters, search for customers
    if (newInputValue && newInputValue.length >= 3) {
      setSearching(true);

      // Debounce the search with a timeout
      searchTimeoutRef.current = setTimeout(() => {
        searchMyCustomers(newInputValue)
          .then((result) => {
            if (result && result.customers) {
              setOptions(result.customers);
            }
          })
          .catch((error) => {
            console.error("Error searching customers:", error);
          })
          .finally(() => {
            setSearching(false);
          });
      }, 300); // 300ms debounce
    } else if (customers && customers.length > 0) {
      // Reset to initial customers list if input is cleared
      setOptions(customers);
    }
  };

  return (
    <Autocomplete
      options={options}
      getOptionLabel={(option) => {
        // Handle different data structures
        if (option?.customer?.name) {
          return option.customer.name;
        } else if (option?.name) {
          return option.name;
        } else if (option?.info?.client_name) {
          return option.info.client_name;
        }
        return "";
      }}
      value={value}
      onChange={(event, newValue) => {
        // Prevent default form submission behavior
        if (event) {
          event.preventDefault();
        }
        onSelect(newValue);
      }}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      loading={loading || searching}
      loadingText="Searching customers..."
      noOptionsText="No customers found"
      isOptionEqualToValue={(option, value) => option?.id === value?.id}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Select a client"
          variant="outlined"
          fullWidth
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading || searching ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
          sx={{
            "& .MuiInputBase-root": {
              borderRadius: "8px",
              backgroundColor: "#f8f8f8",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              border: "1px solid #e0e0e0",
            },
          }}
        />
      )}
    />
  );
};

export default CustomerSelector;
