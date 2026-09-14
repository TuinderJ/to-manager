import { FC, useState } from "react";
import { RepairOrder, TechName } from "../module_bindings/types";
import { reducers } from "../module_bindings";
import { useReducer } from "spacetimedb/react";

interface CardProps {
  repairOrder: RepairOrder;
}

export const Card: FC<CardProps> = ({ repairOrder }) => {
  const addTransferOrders = useReducer(reducers.addTransferOrders);
  const updateNotes = useReducer(reducers.updateNotes);
  const removeTransferOrder = useReducer(reducers.removeTransferOrder);
  const deleteRepairOrder = useReducer(reducers.deleteRepairOrder);
  const updateTech = useReducer(reducers.updateTech);
  const setAllPartsAreHereStatus = useReducer(
    reducers.setAllPartsAreHereStatus,
  );

  const techNameList = TechName.algebraicType.value.variants;

  const [tosToAdd, setTosToAdd] = useState("");
  const [notes, setNotes] = useState(repairOrder.notes);
  const [minimized, setMinimized] = useState(true);

  const toFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTransferOrders({
      repairOrderNumber: repairOrder.number,
      transferOrders: tosToAdd.split(",").map((to) => Number(to)),
    });
    setTosToAdd("");
  };

  const toggleMinimized = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!e.ctrlKey) return;
    setMinimized((prev) => !prev);
  };

  return (
    <div
      className={minimized ? "item minimized" : "item"}
      onClick={toggleMinimized}
    >
      <div className="card">
        <header>
          <div>{repairOrder.number}</div>
          <div>{repairOrder.customer || "customer..."}</div>
        </header>
        <div className="to-list">
          {repairOrder.transferOrders.map((transferOrder) => (
            <div
              key={transferOrder}
              className="to"
              onClick={(_) =>
                removeTransferOrder({
                  repairOrderNumber: repairOrder.number,
                  transferOrder: transferOrder,
                })
              }
            >
              <img src={`https://barcodeapi.org/api/qr/${transferOrder}`} />
              <div className="label">{transferOrder}</div>
            </div>
          ))}
        </div>
        <form onSubmit={toFormSubmit}>
          <input
            placeholder="Enter TO(s) to add..."
            type="text"
            name="to"
            value={tosToAdd}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              for (const transferOrder of e.target.value.split(",")) {
                if (!Number.isInteger(Number(transferOrder))) return;
              }
              setTosToAdd(e.target.value);
            }}
          />
          <button type="submit">Add</button>
        </form>
        <input
          className="notes"
          placeholder="Notes..."
          name="notes"
          value={notes}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            updateNotes({
              repairOrderNumber: repairOrder.number,
              notes: e.target.value,
            });
            setNotes(e.target.value);
          }}
        />
        <select
          className="tech"
          name="tech"
          value={repairOrder.techName.tag}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            const newTechName = e.target.value as keyof typeof TechName;
            const techName = TechName[newTechName] || TechName.Other;
            updateTech({
              repairOrderNumber: repairOrder.number,
              techName: techName as TechName,
            });
          }}
        >
          {techNameList.map(({ name }) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
        <div
          className={
            repairOrder.transferOrders.length === 0
              ? "to-count zero"
              : "to-count"
          }
        >
          TO's: <span>{repairOrder.transferOrders.length}</span>
        </div>
        <div className="complete">
          <input
            type="checkbox"
            checked={repairOrder.allPartsAreHere}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setAllPartsAreHereStatus({
                repairOrderNumber: repairOrder.number,
                allPartsAreHere: e.target.checked,
              })
            }
          />
          <label>All parts here</label>
        </div>
      </div>
      <i
        className="fa-solid fa-trash"
        onClick={(_) =>
          deleteRepairOrder({ repairOrderNumber: repairOrder.number })
        }
      />
    </div>
  );
};
