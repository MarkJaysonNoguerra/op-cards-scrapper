import fs from "fs";

const getDateManila = (options) => {
  return new Date().toLocaleString("en-US", {
    timeZone: "Asia/Manila",
    ...options,
  });
};

export const getCurrentDate = () => {
  const year = getDateManila({ year: "numeric" });
  const month = getDateManila({ month: "2-digit" });
  const day = getDateManila({ day: "2-digit" });
  const hour = getDateManila({ hour: "2-digit", hour12: false });
  const minute = getDateManila({ minute: "2-digit", hour12: false });

  return [day, month, year, hour, minute].join("-");
};

export const saveObjToJson = (obj, path) => {
  const jsonContent = JSON.stringify(obj);
  fs.writeFile(path, jsonContent, "utf8", (err) => {
    if (err) {
      console.log("An error occured while writing JSON Object to File.");
      throw err;
    }
    console.log(`Card List json has been saved in ${path}`);
  });
};

export const createDirectory = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
};

export const readObjFromJson = (path) => {
  return JSON.parse(fs.readFileSync(path));
};
