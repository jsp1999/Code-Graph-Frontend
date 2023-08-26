import React from 'react';
import { TreeView, TreeItem } from '@mui/lab';
import { makeStyles } from '@mui/styles';
import { ExpandMore, ChevronRight } from '@mui/icons-material';

interface Category {
    id: number;
    name: string;
    subcategories: Record<string, Category>;
}

const useStyles = makeStyles({
    root: {
        flexGrow: 1,
        maxWidth: 400,
    },
});

const renderTree = (node: Category): React.ReactNode => (
    <TreeItem key={node.id} nodeId={node.id.toString()} label={node.name}>
        {Object.keys(node.subcategories).map((subcategoryKey) =>
            renderTree(node.subcategories[subcategoryKey])
        )}
    </TreeItem>
);

interface TaxonomyTreeViewProps {
    taxonomyData: Record<string, Category>;
}

const CodeTreeView: React.FC<TaxonomyTreeViewProps> = ({ taxonomyData }) => {
    const classes = useStyles();

    return (
        <TreeView
            className={classes.root}
            defaultCollapseIcon={<ExpandMore />}
            defaultExpandIcon={<ChevronRight />}
        >
            {Object.keys(taxonomyData).map((topLevelKey) =>
                renderTree(taxonomyData[topLevelKey])
            )}
        </TreeView>
    );
};

export default CodeTreeView;<
