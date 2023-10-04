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
    let isMounted = true;
    const localId = props.id;

    getCodeRoute(localId, props.projectId).then((response) => {
      if (isMounted && localId === props.id) {
        setCodeName(response.data.text);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [props.id, props.projectId]);

  return (
    <div className="text-center" key={props.id}>
      <Image className="mx-auto" src={icon} alt="" width={40} height={40} priority />
      {codeName}
    </div>
  );
}
