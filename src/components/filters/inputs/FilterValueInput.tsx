import type { FilterCondition, FilterFieldConfig, FilterValue } from "../../../types/filter.types";
import TextValueInput from "./TextValueInput";
import NumberValueInput from "./NumberValueInput";
import AmountRangeValueInput from "./AmountRangeValueInput";
import DateValueInput from "./DateValueInput";
import BooleanValueInput from "./BooleanValueInput";
import SingleSelectValueInput from "./SingleSelectValueInput";
import MultiSelectValueInput from "./MultiSelectValueInput";

interface Props {
  fieldConfig: FilterFieldConfig;
  condition: FilterCondition;
  onChange: (value: FilterValue) => void;
}

/** Dispatches to the type-appropriate value input. This is the single
 * place that maps `FilterFieldType -> <Input>`; every input below is a
 * self-contained, independently reusable component. */
export default function FilterValueInput({ fieldConfig, condition, onChange }: Props) {
  switch (fieldConfig.type) {
    case "text":
      return <TextValueInput fieldConfig={fieldConfig} value={condition.value} onChange={onChange} />;
    case "number":
      return <NumberValueInput value={condition.value} onChange={onChange} />;
    case "amount":
      return <AmountRangeValueInput fieldConfig={fieldConfig} value={condition.value} onChange={onChange} />;
    case "date":
      return <DateValueInput operator={condition.operator} value={condition.value} onChange={onChange} />;
    case "boolean":
      return <BooleanValueInput value={condition.value} onChange={onChange} />;
    case "select":
      return <SingleSelectValueInput fieldConfig={fieldConfig} value={condition.value} onChange={onChange} />;
    case "multiselect":
      return <MultiSelectValueInput fieldConfig={fieldConfig} value={condition.value} onChange={onChange} />;
    default:
      return null;
  }
}
