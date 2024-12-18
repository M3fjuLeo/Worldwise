import {
  ReactNode,
  useReducer,
  useCallback,
  useContext,
  createContext,
  useEffect,
} from "react";
import Cookies from "js-cookie";

const CitiesContext = createContext<
  | (State & {
      getCity: (id: number) => void;
      createCity: (newCity: City) => void;
      deleteCity: (id: number) => void;
    })
  | undefined
>(undefined);

interface Position {
  lat: number;
  lng: number;
}

export interface City {
  id: number;
  cityName: string;
  emoji: string;
  date: string | number | Date;
  position: Position;
  notes: string;
  country: string;
}

type State = {
  cities: City[];
  currentCity: City | null;
  isLoading: boolean;
  error: string;
};

const initialState: State = {
  cities: [],
  currentCity: null,
  isLoading: false,
  error: "",
};

type Action =
  | { type: "loading" }
  | { type: "cities/loaded"; payload: City[] }
  | { type: "city/loaded"; payload: City }
  | { type: "city/created"; payload: City }
  | { type: "city/deleted"; payload: number }
  | { type: "rejected"; payload: string };

function reducer(state: State, action: Action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };

    case "cities/loaded":
      return { ...state, cities: action.payload, isLoading: false };

    case "city/loaded":
      return { ...state, isLoading: false, currentCity: action.payload };

    case "city/created":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };

    case "city/deleted":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
        currentCity: null,
      };

    case "rejected":
      return { ...state, isLoading: false, error: action.payload };

    default:
      throw new Error("Unknown action type");
  }
}

type CitiesProviderProps = {
  children: ReactNode;
};

function CitiesProvider({ children }: CitiesProviderProps) {
  const [{ cities, currentCity, isLoading, error }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(() => {
    const storedCities = Cookies.get("cities");
    if (storedCities) {
      dispatch({ type: "cities/loaded", payload: JSON.parse(storedCities) });
    }
  }, []);

  const getCity = useCallback(
    (id: number) => {
      const city = cities.find((city) => city.id === id);
      if (city) {
        dispatch({ type: "city/loaded", payload: city });
      }
    },
    [cities]
  );

  function createCity(newCity: City) {
    dispatch({ type: "loading" });
    const updatedCities = [...cities, newCity];
    Cookies.set("cities", JSON.stringify(updatedCities), { expires: 7 }); // Ustaw cookie na 7 dni
    dispatch({ type: "city/created", payload: newCity });
  }

  function deleteCity(id: number) {
    dispatch({ type: "loading" });
    const updatedCities = cities.filter((city) => city.id !== id);
    Cookies.set("cities", JSON.stringify(updatedCities), { expires: 7 }); // Ustaw cookie na 7 dni
    dispatch({ type: "city/deleted", payload: id });
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
        createCity,
        deleteCity,
        error,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("CitiesContext was used outside the CitiesProvider");
  return context;
}

export { CitiesProvider, useCities };
