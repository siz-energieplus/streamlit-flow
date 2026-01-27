import { useState } from 'react';

function CustomDropdown({ displayName, startValue, dropdown_options, dropdown_options_display_names, onEdit }) {
  const [selectedOption, setInputValue] = useState(startValue);
  if (!dropdown_options_display_names) {
    dropdown_options_display_names = dropdown_options;
  }

  function onOptionSelected(value) {
    setInputValue(value);
    onEdit(value);
  }

  return (
    <div class="form-floating">
      <select class="form-select" id="floatingSelect" defaultValue={selectedOption} aria-label="Floating label select">
        {dropdown_options.map((option, index) => (
          <option onClick={() => onOptionSelected(option)} value={option}>
            {dropdown_options_display_names[index]}
          </option>
        ))}
      </select>
      <label for="floatingSelect">{displayName}</label>
    </div>
  );
}

export default CustomDropdown;
