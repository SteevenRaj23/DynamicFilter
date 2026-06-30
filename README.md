
## Quick Start

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build to dist/
npm run lint
```

## Architecture

```
src/
├── types/
│   ├── filter.types.ts        # Generic filter system types — zero domain knowledge
│   └── employee.types.ts      # Employee domain model
├── config/
│   ├── operators.ts           # FieldType -> operator list (single source of truth)
│   └── employeeFilterConfig.ts# The ONLY file that knows about "Employee" fields
├── utils/
│   ├── getValueByPath.ts      # Dot-notation resolver (address.city)
│   ├── filterEngine.ts        # Pure functions: evaluate one condition / apply all conditions
│   └── csvExport.ts           # CSV/JSON export (bonus)
├── hooks/
│   ├── useEmployeeData.ts     # Fetch + loading/error state
│   ├── useFilterConditions.ts # CRUD over the condition list + localStorage persistence
│   ├── useFilteredData.ts     # Memoized filtering
│   └── useDebouncedCallback.ts
├── api/
│   └── mockApi.ts             # Simulated REST layer over the local JSON
├── components/
│   ├── filters/
│   │   ├── FilterPanel.tsx        # Reusable filter builder shell
│   │   ├── FilterConditionRow.tsx # One condition: field / operator / value / remove
│   │   └── inputs/                # One component per field type + a dispatcher
│   └── table/
│       ├── EmployeeDataGrid.tsx   # AG Grid wrapper (loading/empty states)
│       ├── employeeGridColumns.ts # AG Grid column defs (separate from filter config)
│       └── cellRenderers.tsx      # Status chip, skill chips, rating color
└── App.tsx                    # Wires data + filter state + grid together
```

