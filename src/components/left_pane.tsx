import { useState } from "react";

const TECH_LIST = Object.freeze({
  AARON: "Aaron Dickens",
  ANDREW: "Andrew Vigil",
  CHRIS: "James Williams",
  JEREMIAH: "Jeremiah Reed",
  JR: "Michael Hartz",
  JUSTIN: "Justin Jurado",
  NICK: "Nicholas Donet",
});

function notIgnored(partNumber: string) {
  const PARTS_TO_IGNORE = [
    "1516TL",
    "2420CRT",
    "ZC31B",
    "ZC20",
    "ENGINE OIL FILTER",
  ];
  const PARTS_TO_IGNORE_START = ["VC", "PM", "X", "TWS", "TA"];

  if (PARTS_TO_IGNORE.includes(partNumber)) return false;
  for (let i = 0; i < PARTS_TO_IGNORE_START.length; i++) {
    const startingString = PARTS_TO_IGNORE_START[i];
    if (partNumber.startsWith(startingString)) return false;
  }
  return true;
}

export const LeftPane = () => {
  const [value, setValue] = useState("");
  // const [make, setMake] = useState("");

  const onParseButtonPress = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    document.getElementById("ford-link")?.remove();

    const CONDITIONS = ["Item:", "TECH:", "VIN:", "RO NUMBER:", "Make/Model:"];
    let tech: string;
    let itemCount = 0;
    let partNumberList = "";

    const input_lines = value
      .split("\n")
      .filter((line) => CONDITIONS.some((v) => line.includes(v)))
      .map((line) => {
        if (line.includes("TECH:")) {
          tech = line.split("\t")[1];
          return line;
        }
        if (line.includes("VIN:")) {
          return line;
        }
        if (line.includes("RO NUMBER:")) {
          return "RO:\t" + line.split("\t")[1];
        }
        if (line.includes("Make/Model:")) {
          // setMake(line.split("\t")[1].split(":")[1]);
          return `Make:\t${line.split("\t")[1].split(":")[1]}\n\n`;
        }
        if (line.includes("Item:")) {
          itemCount += 1;
          let qty = line.split("\t")[2].split(": ")[1].replace(".00", "");
          let partNumber = line
            .split("\t")[1]
            .replace("DES: ", "")
            .replaceAll("-", "")
            .toUpperCase();
          switch (partNumber) {
            case "YELLOW COOLANT":
            case "PRE MIXED YELLOW COOLANT":
            case "FORD YELLOW COOLANT":
              partNumber = "VC13DLG";
              break;
            case "MOTORCRAFT BRAKE CLEAN":
            case "FORD BRAKE CLEAN":
              partNumber = "PM4B";
              break;
            case "MERCON LV":
              partNumber = "XT10BLV";
              break;
            case "MERCON ULV":
              partNumber = "XT12QULV";
              break;
            case "5W20":
            case "5W20 OIL":
            case "5W20 BULK":
              partNumber = "XO5W20BSP";
              break;
            case "5W30":
            case "5W30 OIL":
            case "5W30 BULK":
              partNumber = "XO5W30BSP";
              break;
            case "10W30":
            case "10W30 REEL 4":
            case "10W30 OIL":
            case "10W30 BULK":
              partNumber = "XO10W30BSD";
              break;
            case "15W40":
            case "15W40 OIL":
            case "15W40 BULK":
              partNumber = "XO15W40BSD";
              break;
            case "75W140 BOTTLE":
              partNumber = "XY75W140QL";
              break;
            case "2.5 GAL OF DEF FLUID":
              partNumber = "1516TL / PM27JUG";
              break;
            case "TUBE DYELECTRIC GREASE":
              partNumber = "XG3A";
              break;
            case "BRAKE CLEANER":
            case "BRAKE CLEAN":
              partNumber = "PM4B / 2420CRT";
              break;
            case "METAL PREP WIPE":
              partNumber = "ZC31B";
              break;
            case "SHAMPOO":
            case "ENGINE SHAMPOO":
              partNumber = "ZC20";
              break;
            case "SURFACE PREP WIPE":
              partNumber = "ZC31B";
              break;
            case "WASHER FLUID":
              partNumber = "TWS0013";
              break;
            case "DOT 3 BRAKE FLUID":
              partNumber = "PM1C";
              break;
            case "DOT 4 BRAKE FLUID":
              partNumber = "PM20";
              break;
            case "DOT 5 BRAKE FLUID":
              partNumber = "PM21";
              break;
          }

          switch (tech) {
            case TECH_LIST.JUSTIN:
              break;
            case TECH_LIST.CHRIS:
              break;
            case TECH_LIST.ANDREW:
              break;
            case TECH_LIST.AARON:
              break;
            case TECH_LIST.NICK:
              if (notIgnored(partNumber.split(" ")[0]))
                partNumberList += `${partNumber.split(" ")[0]},`;
              return "QTY: " + qty + "\t" + partNumber.split(" ")[0];
            case TECH_LIST.JR:
              partNumber = partNumber.replaceAll(" ", "");
              if (partNumber.includes("/")) {
                const splits = partNumber.split("/");
                let returnValue = "QTY: " + qty + "\t" + splits[0] + "\n";
                partNumberList += `${splits[0]},`;
                for (let index = 1; index < splits.length; index++) {
                  const suffix = splits[index];
                  returnValue +=
                    "QTY: " +
                    qty +
                    "\t" +
                    splits[0].substring(0, splits[0].length - 1) +
                    suffix;
                  partNumberList += `${splits[0].substring(0, splits[0].length - 1) + suffix},`;
                }
                return returnValue;
              }
              if (notIgnored(partNumber)) partNumberList += `${partNumber},`;
              return "QTY: " + qty + "\t" + partNumber;
            case TECH_LIST.JEREMIAH:
              break;
            default:
              console.warn("Couldn't find a tech");
              break;
          }
          if (notIgnored(partNumber)) partNumberList += `${partNumber},`;
          return "QTY: " + qty + "\t" + partNumber;
        }
        return line;
      })
      .join("\n");

    setValue(`Total # of parts: ${itemCount}\n${input_lines}`);

    // const anchor = document.createElement("a");
    // anchor.id = "ford-link";
    // anchor.href = `https://servicehub.ford.com/en-us/parts/?partNumber=${partNumberList.replaceAll(",", "%2C")}`;
    // anchor.target = "_blank";
    // anchor.classList.add("fake-button");
    // anchor.textContent = "Search In Ford";
    // document
    //   .getElementById("parse-container")
    //   .querySelector("div")
    //   .appendChild(anchor);
  };

  const onDoubleClickTextArea = (e: React.MouseEvent<HTMLTextAreaElement>) => {
    const selectedText = value
      .substring(e.currentTarget.selectionStart, e.currentTarget.selectionEnd)
      .trim();

    if (
      value.substring(
        e.currentTarget.selectionStart - 2,
        e.currentTarget.selectionStart - 1,
      ) === "*" ||
      selectedText.length === 17
    ) {
      navigator.clipboard.writeText(selectedText);
      return;
    }

    const make = e.currentTarget.dataset.make;
    switch (make) {
      case "FRH":
        switch (selectedText) {
          case "TWS0013":
            navigator.clipboard.writeText(`TWS0013:OW`);
            break;
          case "2420CRT":
            navigator.clipboard.writeText(`2420C-RT:BRM`);
            break;
          case "B160":
            navigator.clipboard.writeText(`B160JAB:BF`);
            break;
          default:
            navigator.clipboard.writeText(`${selectedText}:FRD`);
            break;
        }
        break;
      case "IZ":
        navigator.clipboard.writeText(formatIsuzu(selectedText));
        break;
      default:
        navigator.clipboard.writeText(selectedText);
        break;
    }

    setValue(
      `${value.substring(0, e.currentTarget.selectionStart - 1)} *${e.currentTarget.value.substring(e.currentTarget.selectionStart - 1, e.currentTarget.value.length)}`,
    );
  };

  const formatIsuzu = (string: string) => {
    if (string.length != 10) return string;
    return `${string.replace(/(\d{1})(\d{5})(\d{3})(\d{1})/, "$1-$2-$3-$4")}:IZ`;
  };

  return (
    <div id="parse-container">
      <button id="parse-button" onClick={onParseButtonPress}>
        Parse
      </button>
      <textarea
        name="parse-input"
        id="parse-input"
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          setValue(e.target.value)
        }
        value={value}
      />
      {/* <div> */}
      {/*   <button id="bulk-button">Bulk Parse TOs</button> */}
      {/* </div> */}
    </div>
  );
};
