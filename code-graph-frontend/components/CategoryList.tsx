import React from 'react';

interface Category {
    id: number;
    name: string;
    subcategories: {
        [key: string]: Category;
    };
}

interface CategoryListProps {
    categories: {
        [key: string]: Category;
    };
}

const CategoryList: React.FC<CategoryListProps> = ({ categories }) => {
    const renderCategories = (categories: { [key: string]: Category }): JSX.Element[] => {
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

export default CategoryList;
