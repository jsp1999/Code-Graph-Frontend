import Image from "next/image";
import icon from "@/public/code_icon.svg";
import React, { useEffect, useState } from "react";
import { getCodeRoute } from "@/pages/api/api";

interface CodeItemProps {
  id: number;
  projectId: number;
}

export default function CodeItem(props: CodeItemProps) {
  const [codeName, setCodeName] = useState("");

  useEffect(() => {
    getCodeRoute(props.id, props.projectId).then((response) => {
      setCodeName(response.data.text);
    });
  }, []);

  return (
    <div className="text-center" key={props.id}>
      <Image className="mx-auto" src={icon} alt="" width={40} height={40} priority />
      {codeName}
    </div>
  );
}
