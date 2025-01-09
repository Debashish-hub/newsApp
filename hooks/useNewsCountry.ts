import CountryList from "@/constants/CountryList";
import { useCallback, useState } from "react";

export const useNewsCountries = () => {
  const [newsCountries, setNewsCountries] = useState(CountryList);

  const toggleNewsCountry = useCallback((id: number) => {
    setNewsCountries((prevNewsCountries) => {
      return prevNewsCountries.map((category, index) => ({
        ...category,
        selected: index === id ? !category.selected : false,
      }));
    });
  }, []);

  const resetNewsCountry = useCallback(() => {
    setNewsCountries((prevNewsCountries) => {
      return prevNewsCountries.map((category, index) => ({
        ...category,
        selected: false,
      }));
    });
  }, []);
  return { newsCountries, toggleNewsCountry, resetNewsCountry };
};
