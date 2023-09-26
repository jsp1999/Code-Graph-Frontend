import {Menu} from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Drawer } from '@mui/material';
import { useEffect, useState } from 'react';
import ConfirmModal from './ConfirmModal';
import EditModal from './EditModal';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Edit from '@mui/icons-material/Edit';
import Delete from '@mui/icons-material/Delete';
import {useRouter} from "next/router";
import {Button,ButtonGroup} from "@mui/material";
import {PiSuitcaseSimpleLight} from "react-icons/pi";
import {FcScatterPlot} from "react-icons/fc";
import {HiOutlineAnnotation} from "react-icons/hi";


interface HeaderProps {
    title: string,
}

export default function Header(props: HeaderProps) {
    const router = useRouter();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [projects, setProjects] = useState([""]);



    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };

    // Do api stuff here
    useEffect(() => {
        const fetchedProjects = ["haha", "hihi", "hohoo", "huhu"];
        setProjects(fetchedProjects);
    }, []);

    return(
        <header className="w-screen h-16 bg-blue-900 p-3 pl-5 mb-5 text-white flex items-center">
        <ConfirmModal open={confirmModalOpen} handleClose={()=> setConfirmModalOpen(false)} />
        <EditModal open={editModalOpen} handleClose={() => setEditModalOpen(false)} />

            <div className="mr-5">
                <button onClick={toggleDrawer}>
                    <Menu/>
                </button>
            </div>
            <div className="">
                <h1 className="font-bold text-3xl">{props.title}</h1>
            </div>
            <Drawer
                anchor="left"
                open={isDrawerOpen}
                onClose={toggleDrawer}
            >
                <div className="p-4">
                    <h1 className="text-2xl text-black">Menu</h1>
                    <div className="mt-5">
                    {/* Für jeden bereich bsp. Projects ein eigenes accordion */}
                        <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <p>haha</p>
                        </AccordionSummary>
                    {/* Styling noch anpassen und eigene sachen drüber mappen */}
                        {projects.map((value, index) => (
                            <div key={index} className="flex items-center space-between">
                                <p>{value}</p>
                                <div>
                                    <button onClick={() => setEditModalOpen(true)}>
                                        <Edit />
                                    </button>
                                    <button onClick={() => setConfirmModalOpen(true)}>
                                        <Delete />
                                    </button>
                                </div>
                            </div>
                        ))}
                        </Accordion>
                    </div>
                </div>
                <div className="content-center">
                    <div className="center">
                        <ButtonGroup variant="contained" color="primary" aria-label="contained primary button group" style={{ display: "flex", flexDirection: "column" }}>
                        <Button variant="outlined" component="label" onClick={() => router.push(`/list`)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>Projects</span>
                            <PiSuitcaseSimpleLight />
                        </Button>
                        <Button variant="outlined" component="label" onClick={() => router.push(`/clusterView`)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>Graph</span>
                            <FcScatterPlot />
                        </Button>
                        <Button variant="outlined" component="label" onClick={() => router.push(`/codeView`)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>Codes</span>
                            <HiOutlineAnnotation />
                        </Button>
                        </ButtonGroup>
                    </div>
                </div>
            </Drawer>
        </header>
    );
}