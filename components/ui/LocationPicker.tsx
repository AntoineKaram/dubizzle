"use client";

import { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";

interface LocationPickerProps {
  value: string;
  onChange: (addr: string) => void;
  onCoordsChange?: (coords: { lat: number; lng: number }) => void;
  error?: string;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({
  value,
  onChange,
  onCoordsChange,
  error,
}) => {
  const [detected, setDetected] = useState<{ lat: number; lng: number } | null>(
    null
  );

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      setDetected({ lat: latitude, lng: longitude });
      if (onCoordsChange) onCoordsChange({ lat: latitude, lng: longitude });
    });
  }, [onCoordsChange]);

  const handleSelect = async (addr: string) => {
    onChange(addr);
    const results = await geocodeByAddress(addr);
    const ll = await getLatLng(results[0]);
    setDetected(ll);
    if (onCoordsChange) onCoordsChange(ll);
  };

  return (
    <div className="space-y-2">
      <LoadScript
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
        libraries={["places"]}
      >
        <PlacesAutocomplete
          value={value}
          onChange={onChange}
          onSelect={(address) => handleSelect(address)}
        >
          {({
            getInputProps,
            suggestions,
            getSuggestionItemProps,
            loading,
          }) => (
            <div className="space-y-1">
              <input
                {...getInputProps({
                  placeholder: "Enter location",
                  className: `w-full p-3 border rounded-md focus:outline-none transition border-gray-300 ${
                    error ? "border-red-500" : "border-gray-300"
                  }`,
                })}
              />
              <div
                className={`bg-white rounded-md ${
                  loading || suggestions.length > 0
                    ? "border border-gray-300"
                    : ""
                }`}
              >
                {loading && <div className="p-2 text-gray-400">Loading...</div>}

                {suggestions.map((suggestion, idx) => (
                  <div
                    {...getSuggestionItemProps(suggestion, {
                      className: `p-2 cursor-pointer ${
                        suggestion.active ? "bg-red-100" : "bg-white"
                      }`,
                    })}
                    key={idx}
                  >
                    {suggestion.description}
                  </div>
                ))}
              </div>
            </div>
          )}
        </PlacesAutocomplete>
        {error && <p className="text-sm text-red-500">{error}</p>}
        {detected && (
          <div className="mt-6">
            <GoogleMap
              center={detected}
              zoom={14}
              mapContainerStyle={{
                width: "100%",
                height: "300px",
                borderRadius: "8px",
              }}
              options={{
                disableDefaultUI: true,
                draggable: false,
                scrollwheel: false,
                disableDoubleClickZoom: true,
                keyboardShortcuts: false,
              }}
            >
              <Marker position={detected} />
            </GoogleMap>
          </div>
        )}
      </LoadScript>
    </div>
  );
};
