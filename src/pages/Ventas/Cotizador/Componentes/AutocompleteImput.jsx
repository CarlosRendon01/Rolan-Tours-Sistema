import { useRef, useEffect } from "react";

const AutocompleteInput = ({
  value,
  onChange,
  placeholder,
  className = "",
  name,
  isLoaded,
}) => {
  const autocompleteRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isLoaded && inputRef.current && !autocompleteRef.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(
        inputRef.current,
        {
      componentRestrictions: { country: "mx" },
          fields: ["formatted_address", "name"],
      types: ["geocode"],
        }
      );

      autocompleteRef.current = autocomplete;

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        const newAddress = place.formatted_address || place.name || "";
        onChange(name, newAddress);
      });
    }
  }, [isLoaded, onChange, name]);

  // Sincroniza si el valor cambia externamente (reset del form)
  useEffect(() => {
    if (inputRef.current && value !== inputRef.current.value) {
      inputRef.current.value = value;
    }
  }, [value]);

    return (
      <input
      ref={inputRef}
        type="text"
        name={name}
        placeholder={placeholder}
        className={className}
      defaultValue={value}
        onChange={(e) => onChange(name, e.target.value)}
      disabled={!isLoaded}
        autoComplete="off"
      />
    );
};

export default AutocompleteInput;