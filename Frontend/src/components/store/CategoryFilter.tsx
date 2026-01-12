type Category = 'all' | 'collections' | 'bundles'

interface CategoryFilterProps {
    value: Category
    onChange: (value: Category) => void
}

const CategoryFilter = ({ value, onChange }: CategoryFilterProps) => {
    const categories: { id: Category; label: string }[] = [
        { id: 'all', label: 'All' },
        { id: 'collections', label: 'Collections' },
        { id: 'bundles', label: 'Bundles' },
    ]

    return (
        <div className="flex gap-2">
            {categories.map((cat) => (
                <button
                    key={cat.id}
                    onClick={() => onChange(cat.id)}
                    className={`px-3 py-1 rounded-lg text-sm ${value === cat.id
                            ? 'bg-primary-600 text-white'
                            : 'bg-surface text-gray-400'
                        }`}
                >
                    {cat.label}
                </button>
            ))}
        </div>
    )
}

export default CategoryFilter
