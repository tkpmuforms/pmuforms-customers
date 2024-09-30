import { TextField } from '@mui/material'
import React from 'react'

const PasswordInput = ({
    name,
    label,
    placeholder
}) => {
  return (
   <TextField
   name={name}
   label={label}
   type={password ? "password" : "text"}/>

  )
}

export default PasswordInput