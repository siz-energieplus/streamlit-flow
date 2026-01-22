import { useState } from 'react';

function CustomDropdown({ displayName, startValue, dropdown_options, onEdit }) {
  const [selectedOption, setInputValue] = useState(startValue);

  function onOptionSelected(value) {
    setInputValue(value);
    onEdit(value);
  }

  return (
    <div class="form-floating">
      <select class="form-select" id="floatingSelect" defaultValue={selectedOption} aria-label="Floating label select">
        {dropdown_options.map((option) => (
          <option onClick={() => onOptionSelected(option)} value={option}>
            {option}
          </option>
        ))}
      </select>
      <label for="floatingSelect">{displayName}</label>
    </div>
  );
}

export default CustomDropdown;
