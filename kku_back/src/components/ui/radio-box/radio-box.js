import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';
import React from 'react'
import RadioBoxChild from './radio-child';
import './radio-box.scss';  

const RadioBoxUI = (props) => {
    const { data, value = 0, disabledId = null, cateError } = props  
  
    const handleChange = (event) => {
      props.onChange(event.target.value);
    }

    return (
        <div style={{border: cateError && "1px solid red"}} className={`box-radio-container ${props.className}`}>
            <div className="brc-body overflow-scroll-custom">
                <FormControl className='brc-form-control'>
                    <FormLabel id="box-radio">หมวดหมู่หลัก</FormLabel>
                    <RadioGroup
                        aria-labelledby="box-radio"
                        name="controlled-radio-buttons-group"
                        value={value}
                        onChange={handleChange} >  
                         <FormControlLabel
                            title={`level 0`}
                            style={{"--level": 0}}
                            className="box-item main-cate"
                            value={0}
                            control={<Radio />} 
                            label={`หมวดหมู่หลัก`} />
                        {data && <RadioBoxChild data={data} disabledId={disabledId} /> }
                    </RadioGroup>
                </FormControl>
            </div>
        </div>
    )
}

export default RadioBoxUI;