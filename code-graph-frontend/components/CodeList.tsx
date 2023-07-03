import React from 'react';

interface Code {
    id: number;
    name: string;
    subcategories: {
        [key: string]: Code;
    };
}

interface CodeListProps {
    categories: {
        [key: string]: Code;
    };
}

const CodeList: React.FC<CodeListProps> = ({ categories }) => {
    const renderCategories = (categories: { [key: string]: Code }): JSX.Element[] => {
        return Object.values(categories).flatMap(category => {
            if (Object.keys(category.subcategories).length === 0) {
                return (
                    <div key={category.id}>
                        <span>{category.name}</span>
                    </div>
                );
            } else {
                return [
                    ...renderCategories(category.subcategories)
                ];
            }
        });
    };

    return <div>{renderCategories(categories)}</div>;
};

export default CodeList;
