import { useState, useEffect } from "react";
import HomeCom from "../components/home-com/home-com";
import ShowResults from "../components/show-resuts/show-results";
import CustomTabs from "../components/taps/tabs";
import homestyle from "./home.module.css";

export default function Home() {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [theme, setTheme] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setErrorMsg("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      () => {
        setErrorMsg("Permission to access location was denied");
      }
    );
  }, []);

  useEffect(() => {
    if (!searchText) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            searchText
          )}&format=json&addressdetails=1&limit=5`
        );
        const data = await res.json();
        setSuggestions(data);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [searchText]);

  const handleSelect = (place: any) => {
    setLocation({
      latitude: parseFloat(place.lat),
      longitude: parseFloat(place.lon),
    });
    setSearchText(place.display_name);
    setSuggestions([]);
  };

  return (
    <div className={homestyle.homecontainer}
    style={{ backgroundColor: theme ? "#282c34fa" : "#fff" }}
    >
      <HomeCom theme={theme} />
      <div className={homestyle.themeButtonContainer}>
        
           <button
           
           style={{
            backgroundColor: theme ? "white" : "#282c34fa",

            color: theme ? "black" : "white",
            border: "none",
            }}
           
           className={homestyle.themeButton} onClick={() => setTheme(!theme)}>{theme ? "Dark" : "light"}</button>
      </div>
   <br />

      <div style={{ position: "relative" }}>
        <input style={{ color: theme ? "black" : "white", backgroundColor: theme ? "#fff" :  "#282c34fa" }}
          maxLength={30}
          className={homestyle.search}
          type="text"
          placeholder="Search location..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        {suggestions.length > 0 && (
          <ul
            style={{
              borderRadius: "10px",
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              background: "#282c34fa",
              border: "1px solid #f0f0f0fa",
              color: "white",
              fontWeight: "thin",
              fontFamily: "'Pacifico', Cursive",
              margin: 0,
              padding: 0,
              listStyle: "none",
              zIndex: 1000,
            }}
          >
            {suggestions.map((s, index) => (
              <li
                key={index}
                style={{ padding: "8px", cursor: "pointer" }}
                onClick={() => handleSelect(s)}
              >
                {s.display_name}
              </li>
            ))}
          </ul>
        )}
      </div>

    {location?.latitude && location?.longitude ? (
  <ShowResults
    theme={theme}
    latitude={location.latitude}
    longitude={location.longitude}
  />
) : (
  <p>Getting location...</p>
)}
      {
        
      }{location ? (
  <CustomTabs theme={theme} latitude={location.latitude} longitude={location.longitude} />
) : null}

      {errorMsg && <p>{errorMsg}</p>}
    </div>
  );
}
