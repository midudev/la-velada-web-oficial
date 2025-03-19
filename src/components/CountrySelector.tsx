import { useState } from "react";
import type { ChangeEvent } from "react";
import CustomGlobe from "./Globe";
import { fightersData } from "../consts/globeData";

const FighterSelector = () => {
  const [selectedFighter, setSelectedFighter] = useState("peereira7");

  const handleFighterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedFighter(e.target.value);
  };

  return (
    <div className="flex flex-col items-center p-4 w-full">
      <select
        value={selectedFighter}
        onChange={handleFighterChange}
        className="mt-2 p-2 rounded-lg border border-gray-300 focus:ring focus:border-blue-300"
      >
        {Object.keys(fightersData).map((fighterKey) => (
          <option key={fighterKey} value={fighterKey}>
            {fightersData[fighterKey].name} - {fightersData[fighterKey].city},{" "}
            {fightersData[fighterKey].country}
          </option>
        ))}
      </select>

      <div className="w-full flex justify-center my-4">
        <CustomGlobe selectedFighter={selectedFighter} />
      </div>
    </div>
  );
};

export default FighterSelector;
