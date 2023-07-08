import Image from "next/image";
import icon from "@/public/code_icon.svg";
import React from "react";

interface CodeItemProps {
    value: string,
}

export default function CodeItem(props: CodeItemProps) {
    return (
        <div className="text-center">
            <Image className="mx-auto" src={icon} alt="" width={50} height={50} priority/>
            {props.value}
        </div>
    )
}