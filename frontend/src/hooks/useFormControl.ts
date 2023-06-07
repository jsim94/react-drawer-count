import React, { useState } from "react";

export default function useFormControl(initValues: Object) {
  const [fData, setFData] = useState(initValues);

  const onChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = evt.target;
    const copyData: any = { ...fData };
    copyData[name] = value;

    setFData(copyData);
  };
  return [fData, onChange];
}
