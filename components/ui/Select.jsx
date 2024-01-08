import ReactSelect from 'react-select'
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

const Select = ({ options, onChange, value, defaultValue, isDisabled = true, isLoading = false, isMulti = false, placeholder = ''}) => {
    return (
        <ReactSelect
            noOptionsMessage={() => 'Ничего не найдено'}              
            onChange={onChange}
            classNamePrefix={'custom-select'}
            isMulti={isMulti}
            placeholder={placeholder}
            options={options}
            defaultValue={defaultValue}
            value={value}
            maxMenuHeight={180}
            components={animatedComponents}
            isDisabled={isDisabled}
            isLoading={isLoading}
        />
    )
}

export default Select;
