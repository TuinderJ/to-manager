import React, { useState } from "react";
import { tables, reducers } from "../module_bindings";
import { useSpacetimeDB, useTable, useReducer } from "spacetimedb/react";
import { Card } from "./card";

interface FormData {
  repairOrderNumber: string;
  customerName: string;
}

export const RightPane = () => {
  const [formData, setFormData] = useState<FormData>({
    repairOrderNumber: "",
    customerName: "",
  });
  const [hideIncomplete, setHideComplete] = useState(false);

  const conn = useSpacetimeDB();
  const { isActive: connected } = conn;

  // Subscribe to all people in the database
  const [repairOrders] = useTable(tables.repairOrders);

  const addOrUpdateRepairOrderReducer = useReducer(
    reducers.addOrUpdateRepairOrder,
  );

  const addRepairOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.repairOrderNumber.trim() || !connected) return;

    // Call the add reducer
    addOrUpdateRepairOrderReducer({
      transferOrders: [],
      repairOrderNumber: Number(formData.repairOrderNumber),
      customer: formData.customerName || undefined,
    });
    setFormData({ repairOrderNumber: "", customerName: "" });
  };

  const updateFormData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div id="ro-container">
      <form id="ro-add-container" onSubmit={addRepairOrder}>
        <input
          type="text"
          name="repairOrderNumber"
          placeholder="RO..."
          value={formData.repairOrderNumber}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            if (isNaN(Number(e.target.value))) return;
            updateFormData(e);
          }}
        />
        <input
          type="text"
          name="customerName"
          placeholder="Customer..."
          value={formData.customerName}
          onChange={updateFormData}
        />
        <button type="submit" id="add-to-button">
          Add
        </button>
        <button
          type="button"
          id="show-hide-incomplete-button"
          onClick={(_e: React.MouseEvent<HTMLButtonElement>) =>
            setHideComplete((prev) => !prev)
          }
        >
          Hide Incomplete
        </button>
      </form>
      <div id="ro-list-container">
        {repairOrders.map((repairOrder) => {
          if (hideIncomplete && !repairOrder.allPartsAreHere) {
            return <></>;
          } else {
            return <Card key={repairOrder.number} repairOrder={repairOrder} />;
          }
        })}
      </div>
      <div id="copy-button-container">
        <button
          id="copy-ford-button"
          onClick={(_e: React.MouseEvent<HTMLButtonElement>) => {
            const fordCopyText = `copy(Array.from(document.querySelectorAll('span#bct-eta-required')).map((element) => element.parentElement.parentElement.parentElement.querySelector('#bct-procurement-edit-material-number').innerText.trim().split(':')[0]).join(','),)`;
            navigator.clipboard.writeText(fordCopyText);
          }}
        >
          Ford ETA
        </button>
        <button
          id="copy-isuzu-button"
          onClick={(_e: React.MouseEvent<HTMLButtonElement>) => {
            const isuzuCopyText = `copy(Array.from(document.querySelectorAll('span#bct-eta-required')).map((element) => element.parentElement.parentElement.parentElement.querySelector('#bct-procurement-edit-material-number').innerText.trim().split(':')[0].replaceAll('-', '')).join('\n'),);`;
            navigator.clipboard.writeText(isuzuCopyText);
          }}
        >
          Isuzu ETA
        </button>
      </div>
      <button
        id="copy-ro-button"
        onClick={(_e: React.MouseEvent<HTMLButtonElement>) => {
          const textToCopy = repairOrders
            .map((repairOrder) => String(repairOrder.number))
            .join("\n")
            .concat("\nGo through RO bulk add");
          navigator.clipboard.writeText(textToCopy);
        }}
      >
        Copy All ROs
      </button>
    </div>
  );
};
