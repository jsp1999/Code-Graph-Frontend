interface HeaderProps {
    title: string,
}

export default function Header(props: HeaderProps) {
    return(
        <header className="w-screen h-16 bg-blue-900 p-3 pl-5 mb-5 text-white">
            <h1 className="font-bold text-3xl">{props.title}</h1>
        </header>
    );
}